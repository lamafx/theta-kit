"""serie verifier NN : les contrôles d'un épisode (BRIEF-CONSTRUCTION.md, jalon 3).

Chaque contrôle renvoie des diagnostics classés selon charte/regles-redaction.md : erreur bloquante,
avertissement ou désaccord scientifique (ce dernier vient du relecteur, jamais d'un contrôle automatique).

Contrôles sur le contenu : schéma (C2 compris), familles et paramètres, mots par page, mots interdits et
vouvoiement, termes non encore introduits, rappel et prérequis, nombres, références, images (C4), page de fin,
texte du post LinkedIn quand le contenu en a un (mêmes règles que `serie publier`).
Contrôles sur le rendu : typographie du HTML final (C1), puis, dans Chromium (serie/mesures.py), débordement,
tailles de police, glyphes, ponctuation seule sur une ligne (C1) et remplissage (C3).
"""

from __future__ import annotations

import html as html_module
import inspect
import re
import tempfile
from dataclasses import dataclass, field
from decimal import Decimal
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

from pydantic import ValidationError

import bibliotheque
from calculs import CALCULS
from serie.depot import Depot, lire_yaml
from serie.diagnostics import Diagnostic, Niveau, avertissement, bloquants, erreur
from serie.prerequis import numeros_cites, prerequis, rappel_fixe
from serie.schemas import Contenu, Fiche, Sources, TermeGlossaire

# --- Seuils ----------------------------------------------------------------------------------

# C3 : hauteur vide entre le dernier bloc et le filet du pied, mesurée sur les pages de tests/reference/ (hors planches)
# (serie/mesures.py, `vide_png`). Le plus grand vide est celui de 02-Ouverture (261 px) ; seuil = 261 + 10 %.
# Image-Contexte : 4 px depuis la référence régénérée avec l'image d'essai (A24 ; 3 avant). Image-Capture : 52 px
# depuis que l'écran s'étend jusqu'au pied (A24 ; 242 avant). Main : 248 px avec le style de couverture du
# 2026-10-26 (130 avant). Session de design n° 2 (2026-11-01, couverture A, texte 30 px, pied plus haut, filet en
# 1243) : toutes les pages remesurées ; le plus grand vide des pages reste celui de 02-Ouverture (203 px), mais
# Bib-Visuels (planche, 212 px) le dépasse : le seuil reste calculé sur le maximum, comme avant.
VIDES_REFERENCES = {
    "Main": 60, "02-Ouverture": 203, "03-Mecanisme": 49, "04-Comparaison": 29, "05-Formule": 153,
    "06-Exemple": 89, "07-Piege": 102, "08-Fin": 7, "Image-Contexte": 9, "Image-Capture": 54,
    "Bilan-Couverture": 124, "Bilan-Sommaire": 98, "Bib-Motifs": 1, "Bib-Visuels": 212,
    "Bilan-Fin": 7, "Fin-Serie": 7,
}
SEUIL_REMPLISSAGE = int(max(VIDES_REFERENCES.values()) * 1.1)  # 233 px (287 avant la session de design n° 2)
# Couverture classique (gardée au choix le 2026-11-02) : sa mise en page d'origine laisse 245 px sous l'accroche
# (référence Couverture-Classique) ; seuil propre, même marge de 10 %, pour la page 1 quand le contenu la retient.
VIDE_COUVERTURE_CLASSIQUE = 245
SEUIL_COUVERTURE_CLASSIQUE = int(VIDE_COUVERTURE_CLASSIQUE * 1.1)  # 269 px

# A24 : écart type de la luminance (0 à 255) au-dessous duquel la zone d'une image réelle est jugée vide ou
# uniforme. Mesures (serie/mesures.py, `mesurer_images`, surlignage et badge masqués) : image unie 0 ; mires
# d'essai des tests 56,6 (photo) et 44,9 (capture).
SEUIL_IMAGE_UNIFORME = 8

MOTS_QUESTION = 30  # « Vérifiez-vous » (B5)
PROCHE_LIMITE = 0.9  # avertissement au-delà de 90 % de la limite de mots

SUPERLATIFS = re.compile(
    r"(?<![\w-])(incroyables?|extraordinaires?|révolutionnaires?|fantastiques?|géni(?:al|ale|aux|ales)|"
    r"phénom[ée]na(?:l|le|ux|les)|spectaculaires?|époustouflant(?:e|s|es)?|hallucinant(?:e|s|es)?|"
    r"ultimes?|exceptionnel(?:le|s|les)?|absolument|le plus puissant|la plus puissante|meilleur au monde)(?![\w-])",
    re.IGNORECASE,
)
EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿️‍]")
TUTOIEMENT = re.compile(r"(?<![\w-])(tu|toi|te|ton|ta|tes|tien|tienne|tiens)(?![\w-])|(?<![\w-])t'(?=\w)", re.IGNORECASE)
GRECQUES = "αβγδεζηθικλμνξοπρστυφχψωΓΔΘΛΞΠΣΦΨΩ∇"

LIBELLES_TYPES = {
    "couverture": "couverture", "ouverture": "ouverture", "mecanisme": "mécanisme", "comparaison": "comparaison",
    "formule": "formule", "exemple": "exemple", "piege": "piège", "contexte": "contexte", "capture": "capture",
    "fin": "fin",
}


def lieu(numero: int, page) -> str:
    return f"page {numero} ({LIBELLES_TYPES.get(page.type, page.type)})"


# --- Textes d'une page --------------------------------------------------------------------------

def textes_visuel(visuel) -> list[str]:
    """Textes affichés par un visuel : étiquettes `textes`, étapes et lignes d'un flux, colonnes, mots et fenêtre
    d'une grille."""
    if visuel is None:
        return []
    p = visuel.params
    sortie = []
    for v in p.get("textes", {}).values():
        sortie += [str(x) for x in v] if isinstance(v, list) else [str(v)]
    sortie += [str(e) for e in p.get("etapes", []) if not isinstance(e, list)]
    sortie += [str(c) for c in p.get("colonnes", [])]
    sortie += [v for v in p.get("valeurs", []) if isinstance(v, str)]
    if isinstance(p.get("fenetre"), dict) and p["fenetre"].get("texte"):
        sortie.append(str(p["fenetre"]["texte"]))
    for li in p.get("lignes", []):
        if isinstance(li, list):  # une rangée de tableau (famille Grille) : seuls les mots sont du texte
            sortie += [v for v in li if isinstance(v, str)]
            continue
        if li.get("etiquette"):
            sortie.append(str(li["etiquette"]))
        for e in li.get("etapes", []):
            sortie += [str(x) for x in e] if isinstance(e, list) else [str(e)]
    if p.get("retour"):
        sortie.append(str(p["retour"]))
    return [s.lstrip("!") for s in sortie]


def textes_page(p) -> list[tuple[str, str]]:
    """(champ, texte) de tout ce que la page affiche et que l'agent a écrit."""
    t: list[tuple[str, str]] = []

    def ajouter(champ, valeur):
        if valeur:
            t.append((champ, str(valeur)))

    for champ in ("rappel", "titre", "texte", "legende", "conclusion", "fenetre"):
        ajouter(champ, getattr(p, champ, None))
    for k, e in enumerate(getattr(p, "encadres", []) or []):
        ajouter(f"encadré {k + 1}", e.titre)
        ajouter(f"encadré {k + 1}", e.texte)
    if getattr(p, "encadre", None):
        ajouter("encadré", p.encadre.titre)
        ajouter("encadré", p.encadre.texte)
    for k, c in enumerate(getattr(p, "cas", []) or []):
        ajouter(f"cas {k + 1}", c.etiquette)
        ajouter(f"cas {k + 1}", c.titre)
        ajouter(f"cas {k + 1}", c.texte)
    if getattr(p, "panneau", None) and p.panneau.phrase:
        ajouter("panneau", p.panneau.phrase)
    for k, ligne in enumerate(getattr(p, "lignes", []) or []):
        ajouter(f"ligne {k + 1}", ligne.sens)
    if getattr(p, "tableau", None):
        for col in p.tableau.colonnes:
            ajouter("tableau", col.titre)
    if getattr(p, "image", None):
        ajouter("légende de l'image", p.image.legende)
    for r in getattr(p, "reperes", []) or []:
        ajouter("repère", r.date)
        ajouter("repère", r.texte)
    if getattr(p, "annotation", None):
        ajouter("annotation", p.annotation.texte)
    for k, pt in enumerate(getattr(p, "points", []) or []):
        ajouter(f"point {k + 1}", pt)
    if getattr(p, "verification", None):
        ajouter("vérifiez-vous", p.verification.question)
    for v in (getattr(p, "visuel", None), getattr(p, "sans_image", None)):
        for s in textes_visuel(v):
            ajouter("visuel", s)
    return t


def sans_balises(texte: str) -> str:
    return texte.replace("**", "").replace("$!", "$").replace("$", "").replace("\n", " ")


def compter_mots(texte: str) -> int:
    return sum(1 for m in sans_balises(texte).split() if any(c.isalnum() for c in m))


def normaliser(texte: str) -> str:
    return re.sub(r"[   ]", " ", sans_balises(texte).replace("’", "'"))


# --- Contrôles sur le contenu ----------------------------------------------------------------------

def controler_schema(brut: Any) -> tuple[Contenu | None, list[Diagnostic]]:
    try:
        return Contenu.model_validate(brut), []
    except ValidationError as exc:
        diags = []
        for e in exc.errors():
            chemin = ".".join(str(x) for x in e["loc"]) or "(racine)"
            diags.append(erreur("schéma", f"{chemin} : {e['msg']}"))
        return None, diags


def controler_visuels(contenu: Contenu) -> list[Diagnostic]:
    """Familles, formes et paramètres admis par la bibliothèque ; calcul connu."""
    diags = []
    for k, p in enumerate(contenu.pages, start=1):
        visuels = [("visuel", getattr(p, "visuel", None)), ("schéma sans image", getattr(p, "sans_image", None))]
        for nom, v in visuels:
            if v is None:
                continue
            ici = f"{lieu(k, p)}, {nom}"
            formes = bibliotheque.parametres(v.famille)
            forme = {"couverture": "couverture", "capture": "page"}.get(p.type, v.params.get("forme", "vignette"))
            if forme not in formes:
                diags.append(erreur(ici, f"{v.famille} : forme « {forme} » inconnue ({', '.join(formes)})"))
                continue
            if forme == "vignette" and p.type != "couverture":
                diags.append(erreur(ici, f"{v.famille} : la vignette est réservée aux planches ; choisir une forme de page"))
            # Une comparaison peut changer de forme d'un cas à l'autre (pivot / decalage) : chaque cas est
            # contrôlé avec sa propre forme, les paramètres communs avec chacune.
            groupes = [(forme, set(v.params))]
            if p.type == "comparaison":
                groupes = [(cas.params.get("forme", forme), set(v.params) | set(cas.params)) for cas in p.cas]
            for forme_cas, cles in groupes:
                if forme_cas not in formes:
                    diags.append(erreur(ici, f"{v.famille} : forme « {forme_cas} » inconnue ({', '.join(formes)})"))
                    continue
                inconnus = sorted(cles - formes[forme_cas])
                if inconnus:
                    diags.append(erreur(ici, f"{v.famille}, forme {forme_cas} : paramètres non admis {inconnus}"))
            if v.calcul is not None and v.calcul not in CALCULS:
                diags.append(erreur(ici, f"calcul inconnu « {v.calcul} » (connus : {', '.join(sorted(CALCULS))})"))
        if getattr(p, "tableau", None) and p.tableau.calcul not in CALCULS:
            diags.append(erreur(f"{lieu(k, p)}, tableau", f"calcul inconnu « {p.tableau.calcul} »"))
    return diags


def controler_mots(contenu: Contenu, limites: dict[str, int]) -> list[Diagnostic]:
    """Titre + texte (+ conclusion) : 40 mots sur l'ouverture, 70 sur une page de contenu ; question ≤ 30."""
    diags = []
    for k, p in enumerate(contenu.pages, start=1):
        if p.type in ("couverture", "fin"):
            if p.type == "fin":
                n = compter_mots(p.verification.question)
                if n > MOTS_QUESTION:
                    diags.append(erreur(lieu(k, p), f"« Vérifiez-vous » : {n} mots, {MOTS_QUESTION} au plus"))
            continue
        limite = limites["ouverture"] if p.type == "ouverture" else limites["contenu"]
        n = sum(compter_mots(getattr(p, c, None) or "") for c in ("titre", "texte", "conclusion"))
        if n > limite:
            diags.append(erreur(lieu(k, p), f"{n} mots (titre et texte), {limite} au plus"))
        elif n >= PROCHE_LIMITE * limite:
            diags.append(avertissement(lieu(k, p), f"{n} mots, proche de la limite de {limite}"))
    return diags


def controler_interdits(contenu: Contenu) -> list[Diagnostic]:
    """Superlatifs, emoji, tutoiement (le vouvoiement est la règle)."""
    diags = []
    for k, p in enumerate(contenu.pages, start=1):
        for champ, texte in textes_page(p):
            t = normaliser(texte)
            for m in SUPERLATIFS.finditer(t):
                diags.append(erreur(lieu(k, p), f"{champ} : superlatif « {m.group(0)} »"))
            for m in EMOJI.finditer(texte):
                diags.append(erreur(lieu(k, p), f"{champ} : emoji « {m.group(0)} »"))
            for m in TUTOIEMENT.finditer(t):
                diags.append(erreur(lieu(k, p), f"{champ} : tutoiement « {m.group(0)} » (vouvoiement)"))
    return diags


# --- Termes ------------------------------------------------------------------------------------------

@dataclass
class Terme:
    terme: str
    introduit_par: int
    formes: set[str]
    courant: bool


def _pluriel_mot(mot: str) -> str:
    if not mot.isalpha() or mot.isupper() or mot[-1] in "sxz":
        return mot
    if mot.endswith("al"):
        return mot[:-2] + "aux"
    if mot.endswith(("eau", "au", "eu")):
        return mot + "x"
    return mot + "s"


def pluriel(forme: str) -> str:
    mots = forme.split(" ")
    liaison = next((i for i, m in enumerate(mots) if m in ("de", "à", "du", "des") or m.startswith(("d'", "d’"))), None)
    if liaison is not None:  # « jeu de données » → « jeux de données »
        return " ".join([*(_pluriel_mot(m) for m in mots[:liaison]), *mots[liaison:]])
    return " ".join(_pluriel_mot(m) if "-" not in m else m for m in mots)


def deriver(forme: str) -> set[str]:
    """La forme, sans symbole final, sans parenthèse, et leurs pluriels réguliers."""
    formes = {forme}
    m = re.fullmatch(r"(.*?)\s*\((.*?)\)", forme)
    if m:
        formes |= {m.group(1), m.group(2)}
    for f in list(formes):
        mots = f.split(" ")
        if len(mots) > 1 and (len(mots[-1]) <= 2 or mots[-1][0] in GRECQUES):
            formes.add(" ".join(mots[:-1]))
    formes |= {pluriel(f) for f in formes}
    return {f for f in formes if f}


def charger_termes(depot: Depot) -> list[Terme]:
    supplement = lire_yaml(Path(__file__).parent / "donnees" / "formes-glossaire.yaml")
    ajouts, courants = supplement.get("formes", {}), set(supplement.get("courants", []))
    termes = []
    for brut in lire_yaml(depot.glossaire):
        t = TermeGlossaire.model_validate(brut)
        formes = set().union(*(deriver(f) for f in t.formes)) | set(ajouts.get(t.terme, []))
        termes.append(Terme(t.terme, t.introduit_par, formes, t.terme in courants))
    return termes


def _motif(forme: str) -> re.Pattern:
    corps = r"\s+".join(re.escape(m) for m in forme.replace("’", "'").split())
    sensible = forme.isupper() and len(forme) > 1
    return re.compile(rf"(?<![\w-]){corps}(?![\w-])", 0 if sensible else re.IGNORECASE)


def controler_termes(contenu: Contenu, numero: int, termes: list[Terme]) -> list[Diagnostic]:
    """Un terme n'apparaît que s'il est introduit dans cet épisode ou un précédent (glossaire.yaml).

    Exception (décision du 2026-10-26) : un terme annoncé, c'est-à-dire cité dans une phrase qui donne le numéro
    de l'épisode qui l'introduit (« Non supervisé et renforcement : Nº 03. »), est admis.
    """
    diags = []
    a_venir = [t for t in termes if t.introduit_par > numero]
    motifs = [(t, f, _motif(f)) for t in a_venir for f in sorted(t.formes, key=len, reverse=True)]
    for k, p in enumerate(contenu.pages, start=1):
        for champ, texte in textes_page(p):
            deja = set()
            for phrase in re.split(r"(?<=[.!?…])\s+", texte):
                t = normaliser(phrase)
                annonces = set(numeros_cites(phrase))
                for terme, forme, motif in motifs:
                    m = motif.search(t)
                    if m and terme.introduit_par in annonces:
                        deja.add(terme.terme)  # annoncé : la forme plus courte du même terme ne compte pas non plus
                        continue
                    if not m or terme.terme in deja:
                        continue
                    deja.add(terme.terme)
                    message = (f"{champ} : « {m.group(0)} » est le terme « {terme.terme} », introduit à l'épisode "
                               f"{terme.introduit_par:02d}")
                    if terme.courant:
                        diags.append(avertissement(lieu(k, p), message + " (mot courant : vérifier le sens)"))
                    else:
                        diags.append(erreur(lieu(k, p), message))
    return diags


def controler_rappel(contenu: Contenu, numero: int, fiches: dict[int, Fiche]) -> list[Diagnostic]:
    """La ligne de rappel cite les numéros des prérequis (9.3), ou est fixée par le code."""
    ouverture = contenu.pages[1]
    ici = lieu(2, ouverture)
    fixe = rappel_fixe(numero, fiches)
    if fixe is not None:
        if ouverture.rappel is not None and normaliser(ouverture.rappel) != normaliser(fixe):
            return [erreur(ici, f"le rappel de cet épisode est fixé : « {fixe} »")]
        return []
    if ouverture.rappel is None:
        return [erreur(ici, "rappel manquant : il cite les numéros des prérequis")]
    attendus = prerequis(numero, fiches)
    cites = numeros_cites(ouverture.rappel)
    diags = []
    if not cites:
        diags.append(erreur(ici, f"le rappel ne cite aucun prérequis (Nº {', '.join(f'{n:02d}' for n in attendus)})"))
    hors = sorted(set(cites) - set(attendus))
    if hors:
        diags.append(erreur(ici, f"le rappel cite {', '.join(f'Nº {n:02d}' for n in hors)}, qui n'est pas un prérequis"))
    oublies = sorted(set(attendus) - set(cites))
    if cites and oublies:
        diags.append(avertissement(ici, f"prérequis non cités : {', '.join(f'Nº {n:02d}' for n in oublies)}"))
    return diags


# --- Nombres ------------------------------------------------------------------------------------------

# Un nombre groupé par milliers (« 1 030 », espace fine insécable après la typographie) est lu d'un bloc ;
# il n'est jamais une date, qui s'écrit sans espace.
NOMBRE = re.compile(r"(?<![\w,.])([−-]?\d{1,3}(?:\u202f\d{3})+(?:,\d+)?|[−-]?\d+(?:[,.]\d+)?)(?![\w])")
ANNEE = re.compile(r"1\d{3}|20\d{2}")  # date historique (A30)
FINE_MILLIERS = "\u202f"


def nombres(texte: str) -> list[str]:
    """Nombres d'un texte affiché, hors formules ($…$), numéros d'épisode (Nº 05) et de page."""
    t = re.sub(r"\$[^$]*\$", " ", texte)
    t = re.sub(r"N[º°]\s*[\d\s,et]+", " ", t)
    t = re.sub(r"page\s+\d+", " ", t)
    t = t.replace("\u00a0", " ")
    t = re.sub(r"(?<![\d,])(\d{1,3}) (?=\d{3}(?!\d))", r"\1" + FINE_MILLIERS, t)  # comme typographie.texte
    t = re.sub(r"(?<!\d)\u202f|\u202f(?!\d{3}(?!\d))", "", t)
    return NOMBRE.findall(t)


def _valeurs(x: Any) -> list[float]:
    if isinstance(x, bool):
        return []
    if isinstance(x, (int, float)):
        return [float(x)]
    if isinstance(x, dict):
        return [v for e in x.values() for v in _valeurs(e)]
    if isinstance(x, (list, tuple)):
        return [v for e in x for v in _valeurs(e)]
    return []


def _appeler(nom: str, params: dict) -> Any:
    fonction = CALCULS[nom]
    admis = inspect.signature(fonction).parameters
    return fonction(**{k: v for k, v in params.items() if k in admis})


def valeurs_calculees(contenu: Contenu, moteur=None) -> list[float]:
    """Ce que le code produit : paramètres des visuels, résultats des calculs, étiquettes chiffrées des dessins."""
    vals: list[float] = []
    for p in contenu.pages:
        visuels = [getattr(p, "visuel", None), getattr(p, "sans_image", None)]
        for v in visuels:
            if v is None:
                continue
            params = {k: x for k, x in v.params.items() if k not in ("textes", "description", "lignes", "etapes", "retour")}
            vals += _valeurs(params)
            for cas in getattr(p, "cas", []) or []:
                vals += _valeurs({k: x for k, x in cas.params.items() if k != "description"})
                if "descente" in cas.params:  # Nuage `droite` : w, b et J de la droite dessinée
                    d = cas.params["descente"]
                    vals += _valeurs(CALCULS["descente_droite"](d["eta"], [d["iteration"]], d.get("depart")))
                if v.calcul in CALCULS:
                    try:
                        vals += _valeurs(_appeler(v.calcul, {**params, **cas.params}))
                    except (TypeError, ValueError, KeyError):
                        pass
            if v.calcul in CALCULS:
                try:
                    vals += _valeurs(_appeler(v.calcul, params))
                except (TypeError, ValueError, KeyError):
                    pass
            if moteur is not None:  # étiquettes chiffrées écrites par le code dans le dessin
                try:
                    svg = str(moteur.visuel(v.model_copy(update={"params": {**params, "textes": {}}})))
                    for texte in re.findall(r"<text[^>]*>(.*?)</text>", svg, re.S):
                        vals += [_en_nombre(n) for n in nombres(re.sub(r"<[^>]+>", "", html_module.unescape(texte)))]
                except Exception:  # un visuel qui ne se rend pas est signalé par le rendu lui-même
                    pass
        if getattr(p, "tableau", None) and p.tableau.calcul in CALCULS:
            vals += _valeurs(p.tableau.params)
            vals += _valeurs(_appeler(p.tableau.calcul, p.tableau.params))
    return vals


def _en_nombre(texte: str) -> float:
    return float(texte.replace(FINE_MILLIERS, "").replace("−", "-").replace(",", "."))


def _decimales(texte: str) -> int:
    m = re.search(r"[,.](\d+)$", texte)
    return len(m.group(1)) if m else 0


def nombre_justifie(texte: str, valeurs: list[float]) -> bool:
    x, k = Decimal(texte.replace(FINE_MILLIERS, "").replace("−", "-").replace(",", ".")), _decimales(texte)
    for y in valeurs:
        for candidat in (y, abs(y)):
            if Decimal(str(round(candidat, k))) == x or abs(float(x) - candidat) < 1e-9:
                return True
    return False


def controler_nombres(contenu: Contenu, fiche: Fiche, sources: Sources | None, moteur=None) -> list[Diagnostic]:
    """Chaque nombre affiché vient d'un calcul ou d'un paramètre du contenu, ou d'un extrait de source.

    Une date historique (une année, 1000 à 2099) ne peut venir que d'un extrait de sources/NN/, traçable
    jusqu'à sa référence : la fiche ne suffit pas (A30).
    """
    def nombres_de(textes: list[str]) -> list[float]:
        return [_en_nombre(n) for t in textes for n in NOMBRE.findall(t.replace(" ", "").replace("−", "-"))]

    extraits = nombres_de([e.extrait for e in sources.extraits] if sources is not None else [])
    autorises = valeurs_calculees(contenu, moteur) + extraits + nombres_de(
        [fiche.titre, *(p.message or "" for p in fiche.pages), *fiche.faits_verifies])
    diags = []
    for k, p in enumerate(contenu.pages, start=1):
        if p.type == "couverture":
            continue
        for champ, texte in textes_page(p):
            if champ == "rappel":
                continue
            for n in nombres(texte):
                if ANNEE.fullmatch(n):
                    if not nombre_justifie(n, extraits):
                        diags.append(erreur(lieu(k, p), f"{champ} : la date « {n} » ne vient d'aucun extrait de source"))
                elif not nombre_justifie(n, autorises):
                    diags.append(erreur(lieu(k, p), f"{champ} : le nombre « {n} » ne vient d'aucun calcul, paramètre ni extrait de source"))
    return diags


# --- Références -----------------------------------------------------------------------------------------

def urls_fiche(fiche: Fiche) -> list[str]:
    urls = [c.url for c in fiche.references.cours]
    for s in fiche.references.sources_originales:
        urls += [lien.url for lien in s.liens]
    return urls


def controler_references(contenu: Contenu, fiche: Fiche, sources: Sources | None) -> list[Diagnostic]:
    """Chaque page qui affirme quelque chose cite un extrait de sources/NN/ ; chaque référence a un extrait."""
    if sources is None:
        return [erreur("sources", f"sources/{fiche.numero:02d}/extraits.yaml absent : aucune affirmation n'est rattachée")]
    diags = []
    ids = {e.id for e in sources.extraits}
    for k, p in enumerate(contenu.pages, start=1):
        if p.type in ("couverture", "fin"):
            continue
        if not p.sources:
            diags.append(erreur(lieu(k, p), "aucun extrait de source cité (champ sources)"))
        for i in p.sources:
            if i not in ids:
                diags.append(erreur(lieu(k, p), f"extrait « {i} » absent de sources/{fiche.numero:02d}/extraits.yaml"))
    lues = {e.reference for e in sources.extraits}
    illisibles = {r.reference: r.raison for r in sources.illisibles}
    for url in urls_fiche(fiche):
        if url in illisibles:
            diags.append(erreur("références", f"{url} illisible ({illisibles[url]}) : épisode bloqué"))
        elif url not in lues:
            diags.append(erreur("références", f"{url} : aucun extrait"))
    for e in sources.extraits:
        if e.reference not in urls_fiche(fiche):
            diags.append(avertissement("références", f"extrait « {e.id} » : {e.reference} n'est pas une référence de la fiche"))
    return diags


# --- Images (C4) et page de fin -----------------------------------------------------------------------------

def controler_images(contenu: Contenu, fiche: Fiche, moteur) -> tuple[list[Diagnostic], list[str], list[str]]:
    """Pages qui demandent une image réelle : image retenue, sinon variante sans image signalée.

    Renvoie aussi les images manquantes et les images « à confirmer », pour le rapport de relecture.
    """
    from serie.rendu import image_retenue

    diags, manquantes, a_confirmer = [], [], []
    demandees = [p for p in fiche.pages if p.image_reelle]
    pages_image = [(k, p) for k, p in enumerate(contenu.pages, start=1) if p.type in ("contexte", "capture")]
    if len(pages_image) < len(demandees):
        for pf in demandees[len(pages_image):]:
            diags.append(erreur("images", f"la fiche demande une image réelle page {pf.page} ({pf.image_reelle}) : "
                                          "la page doit être une page contexte ou capture"))
    for k, p in pages_image:
        image = image_retenue(moteur, p.image)
        if image is None:
            texte = f"{lieu(k, p)} : aucune image retenue pour « {p.image.attendu} » ; rendue dans sa variante sans image"
            manquantes.append(texte)
            diags.append(avertissement(lieu(k, p), "image manquante : variante sans image"))
        elif image.fiche.classe == "a_confirmer":
            a_confirmer.append(f"{lieu(k, p)} : {image.chemin.name} ({image.fiche.page_source}) — {image.fiche.conditions}")
            diags.append(avertissement(lieu(k, p), "image « à confirmer » : conditions de réutilisation à valider"))
        elif p.type == "capture" and image.fiche.genre != "capture":
            diags.append(erreur(lieu(k, p), "une page capture n'affiche qu'une capture d'écran réelle"))
    return diags, manquantes, a_confirmer


MOTS_OUTILS = {"pourquoi", "comment", "combien", "quelle", "quelles", "quels", "lequel", "laquelle", "lesquels",
              "quand", "parce", "entre", "encore", "aussi", "toujours", "alors", "avant", "après", "chaque",
              "comme", "cette", "votre", "vous", "selon", "pendant", "depuis", "plutôt"}


def _racines(texte: str) -> set[str]:
    mots = re.findall(r"[a-zàâäéèêëîïôöùûüç]{5,}", normaliser(texte).lower())
    return {m[:6] for m in mots if m not in MOTS_OUTILS}


def controler_fin(contenu: Contenu, fiche: Fiche) -> list[Diagnostic]:
    """La page de fin ne contient rien de nouveau : chaque mot des points et de la question est déjà dans les pages."""
    fin = contenu.pages[-1]
    deja = _racines(fiche.titre)
    for p in contenu.pages[:-1]:
        for _, texte in textes_page(p):
            deja |= _racines(texte)
    diags = []
    for champ, texte in textes_page(fin):
        nouveaux = sorted(_racines(texte) - deja)
        if nouveaux:
            diags.append(avertissement(lieu(len(contenu.pages), fin), f"{champ} : mots absents des pages ({', '.join(nouveaux)})"))
    return diags


# --- Contrôles sur le rendu -------------------------------------------------------------------------------

class _Textes(HTMLParser):
    """Nœuds de texte d'un document HTML, hors <style>, <script> et <title>."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.pile: list[str] = []
        self.textes: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag not in ("br", "img", "meta", "link", "path", "circle", "line", "rect", "ellipse", "polyline", "stop"):
            self.pile.append(tag)

    def handle_endtag(self, tag):
        if tag in self.pile:
            while self.pile and self.pile.pop() != tag:
                pass

    def handle_data(self, data):
        if data.strip() and not any(t in ("style", "script", "title") for t in self.pile):
            self.textes.append(data)


ESPACE_ORDINAIRE_AVANT = re.compile(r"[ \t\n ]([;!?:])")
SANS_ESPACE_AVANT = re.compile(r"(?<=[\w»)])([;!?])")


def controler_typographie_html(htmls: list[str], premiere: int = 1) -> list[Diagnostic]:
    """C1 sur le HTML final : apostrophe droite, espace ordinaire avant ; ! ? : ou dans « Nº 01 »."""
    diags = []
    for k, document in enumerate(htmls, start=premiere):
        lecteur = _Textes()
        lecteur.feed(document)
        for texte in lecteur.textes:
            extrait = " ".join(texte.split())[:60]
            if "'" in texte:
                diags.append(erreur(f"page {k}", f"apostrophe droite dans « {extrait} »"))
            for m in ESPACE_ORDINAIRE_AVANT.finditer(texte):
                if m.group(1) == ":" and texte[m.end():m.end() + 2] == "//":
                    continue
                diags.append(erreur(f"page {k}", f"espace ordinaire avant « {m.group(1)} » dans « {extrait} »"))
            for m in SANS_ESPACE_AVANT.finditer(texte):
                diags.append(erreur(f"page {k}", f"espace fine manquante avant « {m.group(1)} » dans « {extrait} »"))
            if re.search(r"N[º°][ \t\n]", texte):
                diags.append(erreur(f"page {k}", f"espace ordinaire après « Nº » dans « {extrait} »"))
            if re.search(r"«[ \t\n]|[ \t\n]»", texte):
                diags.append(erreur(f"page {k}", f"espace ordinaire dans les guillemets de « {extrait} »"))
    return diags


def controler_mesures(mesures, seuil_vide: int = SEUIL_REMPLISSAGE, seuils: dict[int, int] | None = None
                      ) -> list[Diagnostic]:
    """`seuils` : seuil de vide propre à une page (numéro → px), sinon `seuil_vide`."""
    diags = []
    for m in mesures:
        ici = f"page {m.numero}"
        seuil = (seuils or {}).get(m.numero, seuil_vide)
        for d in m.debordements:
            diags.append(erreur(ici, f"débordement : « {d['texte']} » {d['raison']}"))
        for d in m.tailles:
            diags.append(erreur(ici, f"police de {d['taille']:g} px sous le minimum de {d['minimum']} px : « {d['texte']} »"))
        for d in m.orphelines:
            diags.append(erreur(ici, f"ponctuation seule sur une ligne (« {d['ligne'].strip()} ») dans « {d['texte']} »"))
        for d in m.glyphes:
            message = f"« {d['texte']} » dessiné en partie par une police du système ({', '.join(d['polices'])})"
            # Les lettres grecques ont leur police de complément (A29) : une police du système est toujours une erreur.
            diags.append(erreur(ici, message))
        if m.vide is not None and m.vide > seuil:
            diags.append(erreur(ici, f"page trop vide : {m.vide} px entre le dernier bloc et le pied (seuil {seuil} px)"))
        for z in m.images:  # A24 : une page ne sort jamais avec une zone image vide
            if not z["chargee"]:
                diags.append(erreur(ici, f"image non chargée : {z['image']}"))
            elif z["ecart_type"] < SEUIL_IMAGE_UNIFORME:
                diags.append(erreur(ici, f"zone image vide ou uniforme ({z['image']}, écart type {z['ecart_type']:g}, "
                                         f"seuil {SEUIL_IMAGE_UNIFORME})"))
    return diags


# --- Ensemble -----------------------------------------------------------------------------------------------

@dataclass
class Verification:
    numero: int
    diagnostics: list[Diagnostic] = field(default_factory=list)
    mesures: list = field(default_factory=list)
    images_manquantes: list[str] = field(default_factory=list)
    images_a_confirmer: list[str] = field(default_factory=list)
    mots: dict[int, int] = field(default_factory=dict)

    @property
    def erreurs(self) -> list[Diagnostic]:
        return bloquants(self.diagnostics)

    @property
    def avertissements(self) -> list[Diagnostic]:
        return [d for d in self.diagnostics if d.niveau is Niveau.AVERTISSEMENT]

    @property
    def ok(self) -> bool:
        return not self.erreurs

    def rapport(self) -> str:
        l = [f"# Vérification de l'épisode {self.numero:02d}", "",
             f"Résultat : {'aucune erreur bloquante' if self.ok else f'{len(self.erreurs)} erreur(s) bloquante(s)'}, "
             f"{len(self.avertissements)} avertissement(s).", ""]
        if self.images_a_confirmer:
            l += ["## Images « à confirmer »", ""] + [f"- {i}" for i in self.images_a_confirmer] + [""]
        if self.images_manquantes:
            l += ["## Images manquantes (variante sans image)", ""] + [f"- {i}" for i in self.images_manquantes] + [""]
        if self.erreurs:
            l += ["## Erreurs bloquantes", ""] + [f"- {d.lieu} : {d.message}" for d in self.erreurs] + [""]
        if self.avertissements:
            l += ["## Avertissements", ""] + [f"- {d.lieu} : {d.message}" for d in self.avertissements] + [""]
        if self.mesures:
            l += ["## Mesures", "", "| Page | Mots | Vide au-dessus du pied (px) |", "| --- | ---: | ---: |"]
            for m in self.mesures:
                l.append(f"| {m.numero} | {self.mots.get(m.numero, '—')} | {m.vide if m.vide is not None else '—'} |")
            l += ["", f"Seuil de remplissage : {SEUIL_REMPLISSAGE} px."]
        return "\n".join(l) + "\n"


def charger_sources(depot: Depot, numero: int, dossier: Path | None = None) -> Sources | None:
    chemin = (dossier or depot.racine / "sources" / f"{numero:02d}") / "extraits.yaml"
    if not chemin.exists():
        return None
    return Sources.model_validate(lire_yaml(chemin))


def verifier_episode(depot: Depot, numero: int, contenu: Path | Contenu | None = None, *,
                     sources: Path | None = None, dossier_images: Path | None = None,
                     mesurer: bool = True) -> Verification:
    from serie.rendu import Moteur, charger_episode, charger_fiches, chemin_contenu, pages_html

    v = Verification(numero)
    if not isinstance(contenu, Contenu):
        chemin = Path(contenu) if contenu is not None else chemin_contenu(depot, numero)
        if not chemin.exists():
            v.diagnostics.append(erreur("contenu", f"{chemin} n'existe pas"))
            return v
        contenu, diags = controler_schema(lire_yaml(chemin))
        v.diagnostics += diags
        if contenu is None:
            return v
    fiches = charger_fiches(depot)
    fiche = fiches[numero]
    charte = lire_yaml(depot.charte / "charte.yaml")
    moteur = Moteur(depot, dossier_images=dossier_images)
    srcs = charger_sources(depot, numero, sources)

    v.diagnostics += controler_visuels(contenu)
    v.diagnostics += controler_mots(contenu, charte["limites_mots"])
    v.diagnostics += controler_interdits(contenu)
    v.diagnostics += controler_termes(contenu, numero, charger_termes(depot))
    v.diagnostics += controler_rappel(contenu, numero, fiches)
    v.diagnostics += controler_nombres(contenu, fiche, srcs, moteur)
    v.diagnostics += controler_references(contenu, fiche, srcs)
    diags, v.images_manquantes, v.images_a_confirmer = controler_images(contenu, fiche, moteur)
    v.diagnostics += diags
    v.diagnostics += controler_fin(contenu, fiche)
    if contenu.linkedin is not None:  # texte du post : mêmes règles que `serie publier`
        from serie.publication import controler_linkedin, texte_du_post

        texte, _ = texte_du_post(moteur, charger_episode(depot, numero, contenu))
        v.diagnostics += controler_linkedin(contenu.linkedin, texte)
    for k, p in enumerate(contenu.pages, start=1):
        v.mots[k] = sum(compter_mots(getattr(p, c, None) or "") for c in ("titre", "texte", "conclusion"))

    if bloquants(v.diagnostics) and any(d.lieu.startswith("page") and "forme" in d.message for d in v.diagnostics):
        return v  # un visuel non admis ne se rend pas
    try:
        htmls = pages_html(moteur, charger_episode(depot, numero, contenu))
    except Exception as exc:  # le rendu lui-même échoue : erreur bloquante
        v.diagnostics.append(erreur("rendu", str(exc)))
        return v
    v.diagnostics += controler_typographie_html(htmls)
    if mesurer:
        from serie.mesures import mesurer_pages

        f = charte["format"]
        zone = {"gauche": f["marges_px"]["cotes"], "droite": f["largeur_px"] - f["marges_px"]["cotes"],
                "haut": f["marges_px"]["haut"], "bas": f["hauteur_px"] - f["marges_px"]["bas"]}
        t = charte["tailles_px"]
        with tempfile.TemporaryDirectory() as dossier:
            v.mesures = mesurer_pages(htmls, Path(dossier), zone, t["texte_min"], t["credit"])
        classique = {1: SEUIL_COUVERTURE_CLASSIQUE} if contenu.couverture == "classique" else None
        v.diagnostics += controler_mesures(v.mesures, seuils=classique)
    return v
