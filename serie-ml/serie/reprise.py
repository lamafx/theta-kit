"""Reprise sûre (conception/plan-automatisation.md, 11.7) : étapes, empreintes, écritures atomiques.

Chaque étape de la chaîne de production (11.3) enregistre dans etat.yaml la date et l'empreinte de ses
entrées. Une étape est à refaire si elle n'est pas faite, ou si l'une de ses entrées a changé depuis.
`/episode NN` repart de la première étape à refaire ; relancer une étape faite donne le même résultat.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import os
import time
from pathlib import Path

import yaml

from serie.depot import Depot, cle_episode, lire_yaml
from serie.schemas import Etat, Statut

# Étapes de 11.3, dans l'ordre, avec les entrées dont elles dépendent (chemins relatifs, motifs glob).
# Le texte du post et l'image retenue s'écrivent dans contenu/NN.yaml : « linkedin » suit « contenu », et
# /episode enregistre contenu, linkedin et images une fois l'image choisie, pour que les étapes suivantes
# (rendu, vérification, relecture) ne soient pas invalidées par une écriture plus tardive (A37).
ETAPES: dict[str, list[str]] = {
    "lecture": ["banque/episodes/{NN}-*.yaml"],
    "sources": ["banque/episodes/{NN}-*.yaml", "sources/{NN}/*"],
    "contenu": ["contenu/{NN}.yaml", "charte/glossaire.yaml", "charte/regles-redaction.md"],
    "linkedin": ["contenu/{NN}.yaml"],
    "images": ["contenu/{NN}.yaml", "assets/images/candidats/{NN}/*.yaml"],
    "rendu": ["contenu/{NN}.yaml", "gabarits/*", "bibliotheque/*.py", "bibliotheque/*.svg", "calculs/*.py",
              "charte/charte.yaml", "assets/images/candidats/{NN}/*"],
    "verification": ["contenu/{NN}.yaml", "sources/{NN}/*", "gabarits/*", "bibliotheque/*.py", "charte/charte.yaml"],
    "relecture": ["contenu/{NN}.yaml", "sources/{NN}/*", "sortie/{NN}/relecture.md"],
    "publication": ["contenu/{NN}.yaml", "sortie/{NN}/*.pdf", "publier/{NN}/*"],
}


def ecrire_atomique(chemin: Path, texte: str) -> None:
    """Écrit sous un nom provisoire puis renomme : une coupure ne laisse jamais un fichier à moitié écrit."""
    chemin.parent.mkdir(parents=True, exist_ok=True)
    provisoire = chemin.with_name(chemin.name + ".partiel")
    provisoire.write_text(texte, encoding="utf-8", newline="\n")
    # Sous Windows, le renommage échoue tant qu'un autre processus lit le fichier (la tournée LinkedIn
    # toutes les 5 minutes, l'éditeur) : on réessaie quelques fois avant d'abandonner.
    for essai in range(10):
        try:
            os.replace(provisoire, chemin)
            return
        except PermissionError:
            if essai == 9:
                raise
            time.sleep(0.2)


def entrees(depot: Depot, numero: int, etape: str) -> list[Path]:
    fichiers: set[Path] = set()
    for motif in ETAPES[etape]:
        fichiers |= {p for p in depot.racine.glob(motif.format(NN=f"{numero:02d}")) if p.is_file()}
    return sorted(fichiers)


def contenu_normalise(f: Path) -> bytes:
    """Contenu d'un fichier, fins de ligne Windows ramenées à LF pour un fichier texte : un fichier enregistré en
    CRLF sous Windows et le même extrait en LF par Git (GitHub Actions, .gitattributes) ont la même empreinte."""
    octets = f.read_bytes()
    return octets if b"\0" in octets else octets.replace(b"\r\n", b"\n")


def empreinte(depot: Depot, numero: int, etape: str) -> str:
    """sha256 des chemins et des contenus (fins de ligne normalisées) de toutes les entrées de l'étape."""
    h = hashlib.sha256()
    for f in entrees(depot, numero, etape):
        h.update(f.relative_to(depot.racine).as_posix().encode("utf-8"))
        h.update(hashlib.sha256(contenu_normalise(f)).digest())
    return h.hexdigest()


def lire_etat(depot: Depot) -> dict:
    brut = lire_yaml(depot.etat)
    Etat.model_validate(brut)
    brut["episodes"] = {cle_episode(k): v for k, v in brut["episodes"].items()}
    return brut


class _Cle(str):
    """Clé d'épisode écrite entre guillemets : « '08' » reste un texte pour tout lecteur YAML (A07)."""


class _Ecrivain(yaml.SafeDumper):
    pass


_Ecrivain.add_representer(_Cle, lambda d, v: d.represent_scalar("tag:yaml.org,2002:str", str(v), style="'"))


def ecrire_etat(depot: Depot, brut: dict) -> None:
    """etat.yaml validé, puis écrit atomiquement, clés d'épisode entre guillemets (A07)."""
    Etat.model_validate(brut)
    brut = {**brut, "episodes": {_Cle(cle_episode(k)): v for k, v in sorted(brut["episodes"].items())}}
    ecrire_atomique(depot.etat, yaml.dump(brut, Dumper=_Ecrivain, allow_unicode=True, sort_keys=False,
                                          default_flow_style=False))


def enregistrer_etape(depot: Depot, numero: int, etape: str, **details) -> dict:
    """Marque l'étape faite, avec l'empreinte de ses entrées ; la publication fait passer l'épisode à « généré »."""
    if etape not in ETAPES:
        raise ValueError(f"étape inconnue « {etape} » ({', '.join(ETAPES)})")
    brut = lire_etat(depot)
    ep = brut["episodes"][cle_episode(numero)]
    ep.setdefault("etapes", {})[etape] = {
        "fait_le": dt.datetime.now().isoformat(timespec="seconds"),
        "empreinte": empreinte(depot, numero, etape),
        **details,
    }
    if etape == "publication" and ep["statut"] == Statut.A_FAIRE.value:
        ep["statut"] = Statut.GENERE.value
    ecrire_etat(depot, brut)
    return ep


def etapes_a_refaire(depot: Depot, numero: int) -> list[tuple[str, str]]:
    """(étape, raison) pour chaque étape non faite ou dont une entrée a changé, dans l'ordre de 11.3."""
    ep = lire_etat(depot)["episodes"][cle_episode(numero)]
    faites = ep.get("etapes") or {}
    sortie = []
    for etape in ETAPES:
        if etape not in faites:
            sortie.append((etape, "pas encore faite"))
        elif faites[etape].get("empreinte") != empreinte(depot, numero, etape):
            sortie.append((etape, "une entrée a changé"))
    return sortie


def premiere_etape(depot: Depot, numero: int) -> str | None:
    a_refaire = etapes_a_refaire(depot, numero)
    return a_refaire[0][0] if a_refaire else None


def mettre_a_jour(depot: Depot) -> list[str]:
    """Un épisode « relu » dont une entrée a changé repasse à « généré » (11.7, « Correction d'un épisode »)."""
    brut = lire_etat(depot)
    changements = []
    for cle, ep in brut["episodes"].items():
        if not ep.get("etapes"):
            continue
        modifiees = [e for e, raison in etapes_a_refaire(depot, int(cle)) if raison == "une entrée a changé"]
        if modifiees and ep["statut"] == Statut.RELU.value:
            ep["statut"] = Statut.GENERE.value
            changements.append(f"Nº {cle} : relu → généré ({', '.join(modifiees)} à refaire)")
    if changements:
        ecrire_etat(depot, brut)
    return changements


# Passages de statut faits par l'utilisateur (9.6) ; « généré » est posé par l'étape publication.
PASSAGES = {
    Statut.RELU: {Statut.GENERE, Statut.RELU},  # l'utilisateur a lu relecture.md et valide
    Statut.PUBLIE: {Statut.RELU},  # rien n'est publié sans relecture
    Statut.MESURE: {Statut.PUBLIE},  # statistiques saisies (/stats)
    Statut.GENERE: {Statut.RELU},  # retour en arrière : une correction est demandée
}


def changer_statut(depot: Depot, cle: str, statut: str, le: dt.date | None = None) -> dict:
    """`cle` : « 8 » ou « 08 » pour un épisode, « bilan-1 » pour un post bilan. `le` : date de publication."""
    nouveau = Statut(statut)
    brut = lire_etat(depot)
    if cle.startswith("bilan-"):
        rubrique, ici = brut["bilans"], int(cle.removeprefix("bilan-"))
        nom = f"Bilan {ici}"
    else:
        rubrique, ici = brut["episodes"], cle_episode(cle)
        nom = f"Nº {ici}"
    if ici not in rubrique:
        raise ValueError(f"{nom} inconnu dans etat.yaml")
    entree = rubrique[ici]
    actuel = Statut(entree["statut"])
    permis = PASSAGES.get(nouveau, set())
    if cle.startswith("bilan-") and nouveau is Statut.GENERE:
        permis = permis | {Statut.A_FAIRE}  # un bilan n'a pas d'étapes : /bilan le passe à « généré »
    if actuel not in permis:
        raise ValueError(f"{nom} : passage {actuel.value} → {nouveau.value} refusé")
    if nouveau is Statut.PUBLIE:
        if le is None:
            raise ValueError(f"{nom} : la date de publication est obligatoire (--le AAAA-MM-JJ)")
        entree["publie_le"] = le
    entree["statut"] = nouveau.value
    ecrire_etat(depot, brut)
    return entree
