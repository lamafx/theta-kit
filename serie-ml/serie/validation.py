"""Validation de l'import : fiches, glossaire, état, calendrier, et comparaison à provenance.yaml."""

from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, TypeVar

from pydantic import BaseModel, ValidationError

from serie.depot import Depot, lire_yaml, slug
from serie.diagnostics import Diagnostic, Niveau, avertissement, bloquants, erreur
from serie.etalon import AJOUTEES
from serie.schemas import (
    NB_EPISODES,
    Calendrier,
    Etat,
    Fiche,
    Provenance,
    SuivantTexte,
    TermeGlossaire,
    gabarit_page_fiche,
)

M = TypeVar("M", bound=BaseModel)

# Noms des familles dans charte/bibliotheque-visuelle.md → identifiants des fiches.
NOMS_FAMILLES = {
    "Nuage de points": "nuage",
    "Courbe": "courbe",
    "Réseau": "reseau",
    "Barres": "barres",
    "Lignes de niveau": "niveaux",
    "Blocs": "blocs",
    "Grille": "grille",
    "Arbre": "arbre",
}


def decrire_erreurs(exc: ValidationError) -> list[str]:
    lignes = []
    for e in exc.errors():
        lieu = ".".join(str(x) for x in e["loc"]) or "(racine)"
        lignes.append(f"{lieu} : {e['msg']}")
    return lignes


def valider_modele(modele: type[M], donnees: Any, lieu: str, diags: list[Diagnostic]) -> M | None:
    try:
        return modele.model_validate(donnees)
    except ValidationError as exc:
        diags.extend(erreur(lieu, m) for m in decrire_erreurs(exc))
        return None


@dataclass
class Comparaison:
    cle: str
    attendu: int
    trouve: int

    @property
    def ok(self) -> bool:
        return self.attendu == self.trouve


@dataclass
class Rapport:
    fichiers_fiches: int = 0
    fiches: dict[int, Fiche] = field(default_factory=dict)
    fiches_invalides: list[str] = field(default_factory=list)
    provenance: Provenance | None = None
    comparaisons: list[Comparaison] = field(default_factory=list)
    diagnostics: list[Diagnostic] = field(default_factory=list)
    informations: list[str] = field(default_factory=list)

    @property
    def erreurs(self) -> list[Diagnostic]:
        return bloquants(self.diagnostics)

    @property
    def avertissements(self) -> list[Diagnostic]:
        return [d for d in self.diagnostics if d.niveau is not Niveau.ERREUR]

    @property
    def ok(self) -> bool:
        return not self.erreurs and all(c.ok for c in self.comparaisons)


# --- Fiches ------------------------------------------------------------------------------

def charger_fiche(chemin: Path, diags: list[Diagnostic]) -> Fiche | None:
    try:
        donnees = lire_yaml(chemin)
    except Exception as exc:  # YAML illisible
        diags.append(erreur(chemin.name, f"YAML illisible : {exc}"))
        return None
    return valider_modele(Fiche, donnees, chemin.name, diags)


def controler_fiche(
    chemin: Path, fiche: Fiche, formats: dict[str, list[int]], calendrier: Calendrier | None
) -> list[Diagnostic]:
    """Règles d'une fiche qui dépendent de la charte ou du calendrier."""
    diags = []
    lieu = chemin.name
    attendu = f"{fiche.numero:02d}-{slug(fiche.titre)}.yaml"
    if chemin.name != attendu:
        diags.append(erreur(lieu, f"nom de fichier attendu : {attendu}"))

    mini, maxi = formats[fiche.format]
    if not mini <= len(fiche.pages) <= maxi:
        diags.append(erreur(lieu, f"format {fiche.format} : {len(fiche.pages)} pages, attendu {mini} à {maxi}"))

    if calendrier is not None:
        saison = calendrier.saison_de(fiche.numero)
        if fiche.saison != saison:
            diags.append(erreur(lieu, f"saison {fiche.saison}, calendrier.yaml la place en saison {saison}"))

    if isinstance(fiche.episode_suivant, SuivantTexte):
        cites = {int(s) for s in re.findall(r"saison (\d+)", fiche.episode_suivant.texte)}
        if cites and cites != {fiche.saison}:
            diags.append(avertissement(
                lieu,
                f"episode_suivant annonce « {fiche.episode_suivant.texte} » "
                f"alors que l'épisode est en saison {fiche.saison}",
            ))
    return diags


def controler_banque(fiches: dict[int, Fiche]) -> list[Diagnostic]:
    """Règles qui portent sur l'ensemble des fiches."""
    diags = []
    manquants = sorted(set(range(1, NB_EPISODES + 1)) - set(fiches))
    if manquants:
        diags.append(erreur("banque/episodes", f"fiches manquantes : {manquants}"))

    titres_chapitres: dict[int, set[str]] = {}
    precedent = 0
    for n in sorted(fiches):
        ch = fiches[n].chapitre
        titres_chapitres.setdefault(ch.numero, set()).add(ch.titre)
        if ch.numero < precedent or ch.numero > precedent + 1:
            diags.append(erreur(f"épisode {n:02d}", f"chapitre {ch.numero} après le chapitre {precedent}"))
        precedent = max(precedent, ch.numero)
    for numero, titres in titres_chapitres.items():
        if len(titres) > 1:
            diags.append(erreur(f"chapitre {numero}", f"titres différents : {sorted(titres)}"))
    return diags


# --- Glossaire et couvertures ----------------------------------------------------------

def controler_glossaire(termes: list[TermeGlossaire], fiches: dict[int, Fiche]) -> list[Diagnostic]:
    diags = []
    doublons = [t for t, c in Counter(t.terme for t in termes).items() if c > 1]
    if doublons:
        diags.append(erreur("glossaire.yaml", f"termes en double : {doublons}"))
    glossaire = {(t.terme, t.introduit_par): tuple(t.formes) for t in termes}
    banque = {
        (t.terme, f.numero): tuple(t.formes)
        for f in fiches.values()
        for t in f.termes_introduits
    }
    for cle in sorted(set(banque) - set(glossaire), key=lambda c: c[1]):
        diags.append(erreur("glossaire.yaml", f"terme « {cle[0]} » de l'épisode {cle[1]} absent du glossaire"))
    for cle in sorted(set(glossaire) - set(banque), key=lambda c: c[1]):
        diags.append(erreur("glossaire.yaml", f"terme « {cle[0]} » (épisode {cle[1]}) absent de la fiche"))
    for cle in sorted(set(glossaire) & set(banque), key=lambda c: c[1]):
        if glossaire[cle] != banque[cle]:
            diags.append(avertissement(
                "glossaire.yaml", f"formes de « {cle[0]} » différentes entre la fiche et le glossaire"
            ))
    return diags


def lire_affectation_couvertures(chemin: Path) -> dict[int, str]:
    """Lit le tableau « L'affectation des 62 couvertures » de bibliotheque-visuelle.md."""
    texte = chemin.read_text(encoding="utf-8")
    section = texte.split("### L'affectation des 62 couvertures", 1)[-1].split("###", 1)[0]
    affectation = {}
    for ligne in section.splitlines():
        cellules = [c.strip() for c in ligne.strip().strip("|").split("|")]
        if len(cellules) == 2 and cellules[0] in NOMS_FAMILLES:
            for n in re.findall(r"\d+", cellules[1]):
                affectation[int(n)] = NOMS_FAMILLES[cellules[0]]
    return affectation


def controler_couvertures(affectation: dict[int, str], fiches: dict[int, Fiche]) -> list[Diagnostic]:
    diags = []
    for n, fiche in sorted(fiches.items()):
        prevue = affectation.get(n)
        if prevue is None:
            diags.append(erreur("bibliotheque-visuelle.md", f"épisode {n:02d} absent de l'affectation"))
        elif prevue != fiche.couverture.famille:
            diags.append(erreur(
                f"épisode {n:02d}",
                f"couverture « {fiche.couverture.famille} », la bibliothèque prévoit « {prevue} »",
            ))
    return diags


# --- Ensemble --------------------------------------------------------------------------

def valider_depot(depot: Depot) -> Rapport:
    r = Rapport()
    d = r.diagnostics

    charte = lire_yaml(depot.charte / "charte.yaml")
    formats = charte["format"]["formats"]

    valider_modele(Etat, lire_yaml(depot.etat), "etat.yaml", d)
    calendrier = valider_modele(Calendrier, lire_yaml(depot.calendrier), "calendrier.yaml", d)
    termes = [
        t for i, brut in enumerate(lire_yaml(depot.glossaire) or [])
        if (t := valider_modele(TermeGlossaire, brut, f"glossaire.yaml[{i}]", d)) is not None
    ]

    chemins = depot.fichiers_fiches()
    r.fichiers_fiches = len(chemins)
    for chemin in chemins:
        fiche_diags: list[Diagnostic] = []
        fiche = charger_fiche(chemin, fiche_diags)
        if fiche is not None:
            fiche_diags.extend(controler_fiche(chemin, fiche, formats, calendrier))
            if fiche.numero in r.fiches:
                fiche_diags.append(erreur(chemin.name, f"numéro {fiche.numero} déjà utilisé"))
            else:
                r.fiches[fiche.numero] = fiche
        if bloquants(fiche_diags):
            r.fiches_invalides.append(chemin.name)
        d.extend(fiche_diags)

    d.extend(controler_banque(r.fiches))
    d.extend(controler_glossaire(termes, r.fiches))
    affectation = lire_affectation_couvertures(depot.charte / "bibliotheque-visuelle.md")
    d.extend(controler_couvertures(affectation, r.fiches))

    r.provenance = valider_modele(Provenance, lire_yaml(depot.provenance), "provenance.yaml", d)
    if r.provenance is not None:
        cours = sum(len(f.references.cours) for f in r.fiches.values())
        originales = sum(len(f.references.sources_originales) for f in r.fiches.values())
        trouve = {
            "fiches": r.fichiers_fiches,
            "episodes_avec_references": sum(1 for f in r.fiches.values() if f.references.nombre > 0),
            "references_total": cours + originales,
            "cours": cours,
            "sources_originales": originales,
            "termes_glossaire": len(termes),
            # Les références ajoutées en session de design ne sont pas dans le document exporté.
            "gabarits_reference": sum(1 for p in depot.references_png.glob("*.png") if p.stem not in AJOUTEES),
        }
        r.comparaisons = [Comparaison(k, getattr(r.provenance, k), v) for k, v in trouve.items()]

    sans_gabarit = Counter(
        p.type for f in r.fiches.values() for p in f.pages if gabarit_page_fiche(p) is None
    )
    for type_, n in sans_gabarit.most_common():
        d.append(erreur("banque/episodes", f"{n} page(s) « {type_} » sans gabarit décidé (voir AMBIGUITES.md)"))
    d.extend(controler_posts(depot))
    return r


def controler_posts(depot: Depot) -> list[Diagnostic]:
    """Posts déjà préparés (publier/NN/texte.txt) : 3 à 5 hashtags, #ThetaML en dernier (A34)."""
    from serie.publication import controler_hashtags

    diags = []
    for texte in sorted((depot.racine / "publier").glob("*/texte.txt")):
        diags += controler_hashtags(texte.read_text(encoding="utf-8"), texte.relative_to(depot.racine).as_posix())
    return diags
