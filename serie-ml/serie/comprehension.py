"""Note de compréhension d'un épisode, pour un débutant (décision de l'utilisateur du 2026-11-12).

La série est faite pour être comprise. Des lecteurs ont trouvé le Nº 01 peu compréhensible au premier abord, et
c'est le post qui a eu le moins de réactions. Chaque épisode reçoit donc deux notes sur 10, l'une pour le
carrousel, l'autre pour le texte du post, données par le sous-agent `lecteur-debutant` dans
`sortie/NN/comprehension.yaml`. Le code calcule chaque note (moyenne des critères) et la compare au seuil :
sous 8,5, l'étape « comprehension » ne s'enregistre pas, `serie publier NN` refuse d'écrire `publier/NN/` et la
tournée refuse le post. La règle vaut pour tout épisode pas encore publié, Nº 02 compris.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

import yaml

from serie.depot import Depot

SEUIL = 8.5

# Critère → ce que le lecteur débutant juge. Mêmes clés dans sortie/NN/comprehension.yaml.
CRITERES: dict[str, dict[str, str]] = {
    "carrousel": {
        "premier_abord": "La couverture et l'ouverture disent en mots simples de quoi parle l'épisode et pourquoi "
                         "cela compte ; on le comprend en quelques secondes, sans relire.",
        "vocabulaire": "Chaque terme technique, symbole ou sigle est expliqué en mots simples là où il apparaît ; "
                       "aucun mot savant laissé sans explication.",
        "une_notion_par_page": "Une seule idée nouvelle par page ; aucune nuance secondaire ne brouille l'idée "
                               "principale ; les phrases sont complètes, pas télégraphiques.",
        "concret": "Chaque notion abstraite s'appuie sur un exemple concret ou un visuel qui la montre.",
        "enchainement": "Le lecteur sait pourquoi chaque page suit la précédente.",
        "retenu": "Après une seule lecture, il sait répondre à « Vérifiez-vous » et redire l'idée en une phrase.",
    },
    "post": {
        "accroche": "Les trois premières lignes se comprennent sans rien connaître au Machine Learning et donnent "
                    "envie de lire la suite.",
        "vocabulaire": "Aucun terme technique ou sigle sans explication en mots simples.",
        "message": "À la fin, le lecteur peut dire en une phrase ce qu'il a appris.",
        "fil": "Chaque paragraphe découle du précédent, sans détour ni phrase qu'il faut relire.",
    },
}

NOMS = {"carrousel": "carrousel", "post": "texte du post"}


def chemin(depot: Depot, numero: int) -> Path:
    return depot.racine / "sortie" / f"{numero:02d}" / "comprehension.yaml"


@dataclass
class Notes:
    numero: int
    notes: dict[str, float | None] = field(default_factory=dict)  # partie → moyenne des critères
    problemes: list[str] = field(default_factory=list)

    @property
    def suffisante(self) -> bool:
        return not self.problemes

    def resume(self) -> str:
        parties = [f"{NOMS[p]} {format_note(n)}" for p, n in self.notes.items() if n is not None]
        return f"compréhension : {', '.join(parties) or 'non notée'} (seuil {format_note(SEUIL)})"


def format_note(n: float) -> str:
    return f"{n:.2f}".rstrip("0").rstrip(".").replace(".", ",") + "/10"


def evaluer(depot: Depot, numero: int) -> Notes:
    """Lit sortie/NN/comprehension.yaml, calcule chaque note et liste tout ce qui empêche le post."""
    res = Notes(numero)
    f = chemin(depot, numero)
    nom_f = f.relative_to(depot.racine).as_posix()
    if not f.is_file():
        res.problemes.append(f"compréhension non notée ({nom_f} absent : lancer le sous-agent lecteur-debutant)")
        return res
    try:
        brut = yaml.safe_load(f.read_text(encoding="utf-8")) or {}
    except yaml.YAMLError as exc:
        res.problemes.append(f"{nom_f} illisible : {exc}")
        return res
    if brut.get("episode") != numero:
        res.problemes.append(f"{nom_f} : « episode » vaut {brut.get('episode')!r}, attendu {numero}")
    for partie, criteres in CRITERES.items():
        bloc = (brut.get(partie) or {}).get("criteres") or {}
        valeurs = []
        for cle in criteres:
            c = bloc.get(cle)
            note = c.get("note") if isinstance(c, dict) else None
            if isinstance(note, bool) or not isinstance(note, (int, float)) or not 0 <= note <= 10:
                res.problemes.append(f"{nom_f} : {partie}.{cle} sans note entre 0 et 10")
                continue
            if not str(c.get("raison") or "").strip():
                res.problemes.append(f"{nom_f} : {partie}.{cle} sans raison")
            valeurs.append(float(note))
        inconnus = sorted(set(bloc) - set(criteres))
        if inconnus:
            res.problemes.append(f"{nom_f} : critères inconnus dans {partie} : {', '.join(inconnus)}")
        moyenne = round(sum(valeurs) / len(criteres), 2) if len(valeurs) == len(criteres) else None
        res.notes[partie] = moyenne
        if moyenne is not None and moyenne < SEUIL:
            res.problemes.append(f"compréhension du {NOMS[partie]} {format_note(moyenne)}, sous le seuil de "
                                 f"{format_note(SEUIL)} : simplifier (voir {nom_f})")
    return res


def exiger(depot: Depot, numero: int) -> Notes:
    """Lève ValueError si l'épisode n'atteint pas le seuil : rien n'est généré ni publié en dessous."""
    res = evaluer(depot, numero)
    if not res.suffisante:
        raise ValueError(f"Nº {numero:02d} : " + " ; ".join(res.problemes))
    return res


def modele(numero: int) -> str:
    """Squelette de sortie/NN/comprehension.yaml, dans l'ordre des critères (pour le sous-agent)."""
    lignes = [f"episode: {numero}", "lecteur: <profil du lecteur, recopié de la consigne>"]
    for partie, criteres in CRITERES.items():
        lignes += [f"{partie}:", "  criteres:"]
        for cle in criteres:
            lignes += [f"    {cle}:", "      note: <0 à 10, par demi-point>", "      raison: <une phrase>"]
        lignes += ["  blocages:", "  - endroit: <page N, champ ; ou paragraphe N du post>",
                   "    passage: <le texte exact qui bloque>", "    pourquoi: <ce que le débutant ne comprend pas>",
                   "    proposition: <le texte réécrit, prêt à appliquer>"]
    return "\n".join(lignes) + "\n"
