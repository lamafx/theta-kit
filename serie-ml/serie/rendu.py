"""serie rendre NN : contenu/NN.yaml + fiche + charte → gabarits Jinja → PNG et PDF (Chromium).

Le contenu ne porte que des textes et des paramètres ; toute la mise en forme vient de gabarits/,
de bibliotheque/ et de charte/charte.yaml.
"""

from __future__ import annotations

import io
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, StrictUndefined
from markupsafe import Markup

import bibliotheque
from calculs import CALCULS, calculer, couvertures
from bibliotheque.courbe import nombre_fr
from bibliotheque.robot import GESTES, placement, placer_robot
from serie import balisage, typographie
from serie.charte import Charte
from serie.depot import Depot, lire_yaml, slug
from serie.images import ImageRetenue, charger_image
from serie.prerequis import rappel_fixe
from serie.schemas import (
    STYLES_COUVERTURE, Calendrier, Contenu, ContenuBilan, Fiche, SuivantNumero, SuivantTexte, Visuel,
)

INVITATION = "Suivez la série et enregistrez ce carrousel pour le relire."
# Fin de la série (A22) : à la place de l'invitation à suivre.
INVITATION_FIN = "Retrouvez le sommaire de chaque saison dans son post bilan."


class ErreurRendu(Exception):
    pass


# --- Thèmes des visuels -------------------------------------------------------------------

def theme(charte: Charte, nom: str) -> dict[str, str]:
    """Couleurs passées aux familles : objet étudié, accent, contexte (bibliotheque-visuelle.md)."""
    cl, co = charte.claire, charte.couverture
    cx = charte.complements
    commun = {"alerte": charte.alerte, "gris": cx["icone"], "carte": co["carte"], "clair": co["texte"],
              "texte_bloc_sombre": cx["texte_bloc_sombre"]}
    if nom == "couverture":
        return {**commun, "nom": nom, "accent": co["accent"], "objet": co["texte"], "contexte": co["secondaire"],
                "filet": co["filet"], "secondaire": co["secondaire"], "fond": co["fond"]}
    return {**commun, "nom": "claire", "accent": cl["accent"], "objet": cl["texte"], "contexte": cl["gris_contexte"],
            "filet": cl["filet"], "secondaire": cl["secondaire"], "fond": cl["fond"]}


# --- Environnement Jinja ------------------------------------------------------------------

def environnement(depot: Depot) -> Environment:
    env = Environment(
        loader=FileSystemLoader(depot.racine / "gabarits"),
        autoescape=True,
        undefined=StrictUndefined,
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
    )
    env.filters["texte"] = lambda s: balisage.texte(s)
    env.filters["texte_stix"] = lambda s: balisage.texte(s, dans_stix=True)
    env.filters["titre_point"] = balisage.titre_point
    env.filters["formule"] = balisage.formule
    env.filters["symbole"] = balisage.symbole
    env.filters["typo"] = typographie.texte
    return env


@dataclass
class Moteur:
    """Ce qui sert à rendre toutes les pages d'un dépôt."""

    depot: Depot
    dossier_images: Path | None = None  # par défaut assets/images/
    charte: Charte = field(init=False)
    env: Environment = field(init=False)
    style: Markup = field(init=False)

    def __post_init__(self) -> None:
        if self.dossier_images is None:
            self.dossier_images = self.depot.racine / "assets" / "images"
        self.charte = Charte.charger(self.depot)
        self.env = environnement(self.depot)
        d = self.charte.donnees
        valeurs = {
            "claire": self.charte.claire, "couverture": self.charte.couverture, "fin": self.charte.fin,
            "alerte": self.charte.alerte, "complements": self.charte.complements, "tailles": self.charte.tailles, "format": self.charte.format,
            "images": d["images_reelles"],
        }
        self.style = Markup(self.env.get_template("style.css.j2").render(c=valeurs))

    def page(self, gabarit: str, classe: str, titre_doc: str, /, **contexte: Any) -> str:
        return self.env.get_template(f"{gabarit}.html.j2").render(
            polices=Markup(self.charte.polices_css), style=self.style, classe_page=classe,
            titre_document=typographie.texte(titre_doc), signature=self.charte.signature, **contexte,
        )

    def robot(self, nom: str, classe: str) -> Markup:
        svg = (self.depot.racine / "bibliotheque" / f"{nom}.svg").read_text(encoding="utf-8").strip()
        return Markup(svg.replace("<svg ", f'<svg class="{classe}" ', 1))

    def visuel(self, visuel: Visuel, nom_theme: str = "claire", **en_plus: Any) -> Markup:
        if visuel.calcul is not None and visuel.calcul not in CALCULS:
            raise ErreurRendu(f"visuel {visuel.famille} : calcul inconnu « {visuel.calcul} »")
        params = {**visuel.params, **en_plus}
        return Markup(bibliotheque.rendre(visuel.famille, params, theme(self.charte, nom_theme)))


# --- Données d'un épisode -------------------------------------------------------------------

@dataclass
class Episode:
    fiche: Fiche
    contenu: Contenu
    fiches: dict[int, Fiche]
    calendrier: Calendrier

    @property
    def numero_affiche(self) -> str:
        return f"Nº {self.fiche.numero:02d}"

    @property
    def chapitre(self) -> str:
        return self.fiche.chapitre.titre

    @property
    def rappel(self) -> str:
        """Ligne de rappel de l'ouverture : fixée par 9.3, sinon écrite dans le contenu."""
        fixe = rappel_fixe(self.fiche.numero, self.fiches)
        ecrit = self.contenu.pages[1].rappel
        if fixe is not None:
            if ecrit is not None and typographie.texte(ecrit) != typographie.texte(fixe):
                raise ErreurRendu(f"ouverture : le rappel de cet épisode est « {fixe} », pas « {ecrit} »")
            return fixe
        if ecrit is None:
            raise ErreurRendu("ouverture : rappel manquant (il cite les numéros des prérequis)")
        return ecrit


def charger_fiches(depot: Depot) -> dict[int, Fiche]:
    fiches = {}
    for chemin in depot.fichiers_fiches():
        f = Fiche.model_validate(lire_yaml(chemin))
        fiches[f.numero] = f
    return fiches


def chemin_contenu(depot: Depot, numero: int) -> Path:
    return depot.racine / "contenu" / f"{numero:02d}.yaml"


def charger_episode(depot: Depot, numero: int, contenu: Contenu | Path | None = None) -> Episode:
    fiches = charger_fiches(depot)
    if numero not in fiches:
        raise ErreurRendu(f"pas de fiche pour l'épisode {numero}")
    if not isinstance(contenu, Contenu):
        chemin = Path(contenu) if contenu is not None else chemin_contenu(depot, numero)
        if not chemin.exists():
            nom = chemin.relative_to(depot.racine).as_posix() if chemin.is_relative_to(depot.racine) else str(chemin)
            raise ErreurRendu(f"{nom} n'existe pas")
        contenu = Contenu.model_validate(lire_yaml(chemin))
    if contenu.episode != numero:
        raise ErreurRendu(f"le contenu est celui de l'épisode {contenu.episode}, pas {numero}")
    calendrier = Calendrier.model_validate(lire_yaml(depot.calendrier))
    return Episode(fiches[numero], contenu, fiches, calendrier)


def episode_suivant(ep: Episode) -> dict[str, str]:
    """Bloc « épisode suivant » de la page de fin (decisions-automatisation.md, 9.3) : étiquette, titre,
    phrase de transition de la fiche (A15), puis l'invitation fixe du canevas.

    Le dernier épisode d'une saison annonce le bilan, puis la saison suivante et son premier épisode (A22).
    Le dernier épisode de la série (texte au lieu d'un numéro) devient un bloc de clôture : les saisons de la
    série, et l'invitation à relire leur sommaire (A22).
    """
    s = ep.fiche.episode_suivant
    if isinstance(s, SuivantTexte):
        etiquette, _, titre = s.texte.partition(" · ")
        return {"etiquette": etiquette, "titre": titre[:1].upper() + titre[1:] if titre else "", "transition": "",
                "invitation": INVITATION_FIN, "saisons": saisons_de_la_serie(ep.calendrier)}
    assert isinstance(s, SuivantNumero)
    saison = ep.calendrier.saisons[ep.fiche.saison]
    if ep.fiche.numero == saison.episodes[1] and saison.bilan:
        etiquette = f"Bilan, puis saison {ep.fiche.saison + 1} · Nº {s.numero:02d}"
    else:
        etiquette = f"Épisode suivant · Nº {s.numero:02d}"
    return {"etiquette": etiquette, "titre": ep.fiches[s.numero].titre, "transition": s.transition,
            "invitation": INVITATION, "saisons": []}


def saisons_de_la_serie(calendrier: Calendrier) -> list[dict[str, int]]:
    """Chaque saison et ses épisodes, de calendrier.yaml : numéro, premier et dernier épisode."""
    return [{"numero": k, "debut": calendrier.saisons[k].episodes[0], "fin": calendrier.saisons[k].episodes[1]}
            for k in sorted(calendrier.saisons)]


def cellules_tableau(tableau) -> dict[str, Any]:
    lignes = calculer(tableau.calcul, **tableau.params)
    classes = {"normal": None, "accent": "accent", "gras": "gras"}
    rangees = []
    for ligne in lignes:
        rangee = []
        for col in tableau.colonnes:
            if col.champ not in ligne:
                raise ErreurRendu(f"tableau : le calcul {tableau.calcul} ne donne pas « {col.champ} »")
            v = ligne[col.champ]
            texte = str(v) if isinstance(v, int) else nombre_fr(v, 4)
            rangee.append({"texte": texte, "classe": classes[col.style]})
        rangees.append(rangee)
    return {"colonnes": [c.titre for c in tableau.colonnes], "lignes": rangees}


def image_retenue(moteur: Moteur, image) -> ImageRetenue | None:
    """L'image retenue pour une page, ou None : la page passe alors à sa variante sans image."""
    if image.fichier is None:
        return None
    return charger_image(moteur.dossier_images, image.fichier)


# --- Pages ------------------------------------------------------------------------------------

TITRE_LONG = 26  # caractères : au-delà, le titre de couverture passe de 124 à 96 px (session de design n° 2)
LIGNE_LONGUE = 14  # caractères sur une ligne imposée : au-delà, 96 px aussi (sinon trois lignes à 124 px)


def contexte_couverture(moteur: Moteur, fiche: Fiche, visuel: Visuel, titre: str, accroche: str) -> dict[str, Any]:
    """Couverture A : le robot fait le geste de l'épisode (fiche, `couverture.geste`), à la position du geste ;
    le motif de la famille, calculé en mode zone, occupe la zone que son bras atteint ; le titre va en haut si le
    robot occupe le bas, et passe à 96 px s'il est long."""
    cv = fiche.couverture
    position = cv.position or GESTES[cv.geste]["position"]
    pl = placement(position)
    with couvertures.en_zone():
        fond = moteur.visuel(visuel, "couverture", forme="couverture")
    robot = placer_robot(cv.geste, position, accent=moteur.charte.couverture["accent"], ident=f"r{fiche.numero:02d}",
                         doigts=cv.doigts, label=f"Le robot de la série : {cv.verbe}.")
    long = (len(" ".join(titre.split())) > TITRE_LONG
            or any(len(ligne.strip()) > LIGNE_LONGUE for ligne in titre.splitlines()))
    return {
        "fond": fond, "robot": Markup(robot), "titre": titre, "accroche": accroche, "titre_long": long,
        "zone": pl["zone_motif"], "titre_en_haut": pl["titre"] == "haut",
        "serie_visible": position not in ("haut", "droite"),
        "pied_etroit": position == "bas",
        "largeur_titre": 920 if position == "gauche" or pl["titre"] == "haut" else 760,
    }


def page_html(moteur: Moteur, ep: Episode, p, numero: int, total: int, style_couverture: str | None = None) -> str:
    """Le HTML d'une page de l'épisode. Couverture : le style retenu par le contenu (`couverture`), ou
    `style_couverture` pour rendre l'autre variante."""
    titre_doc = f"{ep.numero_affiche} · {ep.fiche.titre}"
    commun = {"ep": ep, "page": {"numero": numero, "total": total}, "p": p}
    if p.type == "couverture":
        famille = ep.fiche.couverture.famille
        for v in (p.visuel, p.visuel_classique):
            if v is not None and v.famille != famille:
                raise ErreurRendu(f"couverture : famille {v.famille}, la fiche prévoit {famille}")
        visuel = p.visuel or Visuel(famille=famille)
        titre = p.titre or ep.contenu.pages[1].titre
        if (style_couverture or ep.contenu.couverture) == "classique":
            visuel = p.visuel_classique or visuel
            # Couverture d'avant la session de design n° 2 (gardée au choix de l'utilisateur, 2026-11-02) : robot de
            # face au centre, motif pleine largeur autour de lui, titre (92 px) et accroche dessous.
            return moteur.page("couverture-classique", "sombre page-couverture", titre_doc,
                               fond=moteur.visuel(visuel, "couverture", forme="couverture"),
                               robot=moteur.robot("robot-couverture", "robot-couverture"), titre=titre,
                               accroche=ep.fiche.accroche, **commun)
        contexte = contexte_couverture(moteur, ep.fiche, visuel, titre, ep.fiche.accroche)
        return moteur.page("couverture", "sombre page-couverture page-couverture-a", titre_doc, **contexte, **commun)
    if p.type == "ouverture":
        visuel = moteur.visuel(p.visuel) if p.visuel else ""
        return moteur.page("ouverture", "page-ouverture", titre_doc, visuel=visuel, rappel=ep.rappel, **commun)
    if p.type == "comparaison":
        cas = []
        for c in p.cas:
            v = moteur.visuel(p.visuel, alerte=c.alerte, **c.params)
            cas.append({**c.model_dump(), "visuel": v})
        return moteur.page("comparaison", "page-comparaison", titre_doc, cas=cas, **commun)
    if p.type == "exemple":
        tableau = cellules_tableau(p.tableau) if p.tableau else None
        visuel = moteur.visuel(p.visuel) if p.visuel else ""
        return moteur.page("exemple", "page-exemple", titre_doc, tableau=tableau, visuel=visuel, **commun)
    if p.type in ("contexte", "capture"):
        image = image_retenue(moteur, p.image)
        schema = ""
        if p.type == "capture" and image is None:
            schema = moteur.visuel(p.sans_image, forme="page", largeur=moteur.charte.donnees["images_reelles"]["largeur"] - 80)
        return moteur.page(p.type, f"page-{p.type}", titre_doc, image=image, schema=schema, **commun)
    if p.type == "fin":
        return moteur.page("fin", "page-fin", titre_doc, suivant=episode_suivant(ep),
                           robot=moteur.robot("robot-baguette", "robot-baguette"), **commun)
    visuel = moteur.visuel(p.visuel) if getattr(p, "visuel", None) else ""
    return moteur.page(p.type, f"page-{p.type}", titre_doc, visuel=visuel, **commun)


def pages_html(moteur: Moteur, ep: Episode) -> list[str]:
    """Le HTML de chaque page de l'épisode, dans l'ordre."""
    total = len(ep.contenu.pages)
    return [page_html(moteur, ep, p, i, total) for i, p in enumerate(ep.contenu.pages, start=1)]


def couvertures_html(moteur: Moteur, ep: Episode) -> dict[str, str]:
    """Les deux variantes de la couverture, pour que l'utilisateur choisisse (`couverture` du contenu)."""
    total = len(ep.contenu.pages)
    return {style: page_html(moteur, ep, ep.contenu.pages[0], 1, total, style) for style in STYLES_COUVERTURE}


# --- Bilan de saison -----------------------------------------------------------------------

def orbite(charte: Charte, episodes: list[tuple[int, int]]) -> Markup:
    """Couverture de bilan : un numéro par épisode sur une orbite, plus lumineux à chaque chapitre."""
    import math

    from bibliotheque._svg import MONO, balise, n, points, svg

    ac = charte.couverture["accent"]
    cx, cy, rx, ry = 540, 320, 450, 255
    nb = len(episodes)
    chapitres = sorted({ch for _, ch in episodes})
    rang = {ch: k for k, ch in enumerate(chapitres)}
    pts = []
    for k in range(nb):
        angle = math.radians(160 - 320 * k / (nb - 1)) if nb > 1 else 0.0
        pts.append((cx + rx * math.cos(angle), cy - ry * math.sin(angle)))
    c = [f'<g fill="none" stroke="{ac}" stroke-width="1.5">'
         + balise("ellipse", cx=540, cy=320, rx=560, ry=320, stroke_opacity="0.06")
         + balise("ellipse", cx=540, cy=320, rx=330, ry=185, stroke_opacity="0.1") + "</g>",
         balise("polyline", points=points(pts), fill="none", stroke=ac, stroke_opacity="0.35", stroke_width=1.5,
                stroke_dasharray="2 6", stroke_linecap="round")]
    for (numero, chapitre), (x, y) in zip(episodes, pts):
        r, dernier = rang[chapitre], rang[chapitre] == len(chapitres) - 1
        trait = 1.0 if dernier else 0.35 + 0.2 * r
        texte = 1.0 if dernier else 0.64 + 0.11 * r
        c.append(balise("circle", cx=float(x), cy=float(y), r=15, fill=charte.couverture["fond"], stroke=ac,
                        stroke_opacity=f"{trait:.2f}", stroke_width=2))
        c.append(f'<text x="{n(x)}" y="{n(y + 4.5)}" text-anchor="middle" font-family="{MONO}" font-size="12" '
                 f'font-weight="500" fill="{charte.couverture["texte"]}" fill-opacity="{texte:.2f}">{numero:02d}</text>')
    return Markup(svg(1080, 780, c, None, "position: absolute; left: -80px; top: -30px; display: block"))


def pages_bilan_html(moteur: Moteur, bilan: ContenuBilan, calendrier: Calendrier | None = None) -> list[str]:
    """Couverture, sommaire et fin du post bilan. `calendrier` : celui du dépôt par défaut."""
    fiches = charger_fiches(moteur.depot)
    calendrier = calendrier or Calendrier.model_validate(lire_yaml(moteur.depot.calendrier))
    debut, fin = calendrier.saisons[bilan.saison].episodes
    episodes = [fiches[k] for k in range(debut, fin + 1)]
    ep = {"numero_affiche": f"Saison {bilan.saison}", "chapitre": "Bilan"}
    titre_doc = f"Saison {bilan.saison} · bilan"
    total = 3
    couverture = moteur.page(
        "bilan-couverture", "sombre page-couverture", titre_doc, ep=ep, page={"numero": 1, "total": total},
        fond=orbite(moteur.charte, [(f.numero, f.chapitre.numero) for f in episodes]),
        robot=moteur.robot("robot-couverture", "robot-couverture"),
        titre=bilan.couverture.titre, accroche=bilan.couverture.accroche,
    )
    chapitres: list[dict[str, Any]] = []
    for f in episodes:
        if not chapitres or chapitres[-1]["numero"] != f.chapitre.numero:
            chapitres.append({"numero": f.chapitre.numero, "titre": f.chapitre.titre, "episodes": []})
        chapitres[-1]["episodes"].append({"numero": f.numero, "titre": f.titre})
    # Deux colonnes : les chapitres restent entiers, la gauche s'arrête dès qu'elle a la moitié des épisodes.
    gauche, cumul = [], 0
    for ch in chapitres:
        if cumul * 2 >= len(episodes):
            break
        gauche.append(ch)
        cumul += len(ch["episodes"])
    colonnes = [gauche, chapitres[len(gauche):]]
    sommaire = moteur.page(
        "bilan-sommaire", "page-sommaire", titre_doc, ep=ep, page={"numero": 2, "total": total},
        titre=bilan.sommaire.titre, texte_sommaire=bilan.sommaire.texte, colonnes=colonnes,
    )
    reprise, suivant = fin_du_bilan(bilan.saison, fiches, calendrier)
    fin_page = moteur.page("fin", "page-fin", titre_doc, ep=ep, p=None, page={"numero": 3, "total": total},
                           reprise=reprise, suivant=suivant, robot=moteur.robot("robot-baguette", "robot-baguette"))
    return [couverture, sommaire, fin_page]


def fin_du_bilan(saison: int, fiches: dict[int, Fiche], calendrier: Calendrier) -> tuple[dict, dict]:
    """Page de fin du post bilan (A35) : le gabarit de fin, sans points ni « Vérifiez-vous ».

    En haut, « Saison N+1 : reprise le [date] » (serie/calendrier.py ; « prochainement » tant que la date de
    lancement n'est pas fixée) et les chapitres de la saison suivante ; en bas, son premier épisode. Après la
    dernière saison : les saisons de la série, puis le bloc de clôture du dernier épisode (A22).
    """
    from serie.calendrier import dates_prevues, jour_en_clair

    suivante = saison + 1
    if suivante not in calendrier.saisons:
        saisons = saisons_de_la_serie(calendrier)
        dernier = fiches[saisons[-1]["fin"]]
        reprise = {"etiquette": "Au total", "titre": f"{dernier.numero} épisodes en {len(saisons)} saisons.",
                   "lignes": [{"numero": f"{s['numero']:02d}",
                               "titre": f"Saison {s['numero']} · épisodes {s['debut']} à {s['fin']}"} for s in saisons]}
        texte = dernier.episode_suivant
        assert isinstance(texte, SuivantTexte)
        etiquette, _, titre = texte.texte.partition(" · ")
        return reprise, {"etiquette": etiquette, "titre": titre[:1].upper() + titre[1:], "transition": "",
                         "invitation": INVITATION_FIN, "saisons": []}
    debut = calendrier.saisons[suivante].episodes[0]
    date = dates_prevues(calendrier).get(("episode", debut))
    quand = f"reprise le {jour_en_clair(date)}" if date else "reprise prochainement"
    chapitres = []
    for k in range(debut, calendrier.saisons[suivante].episodes[1] + 1):
        ch = fiches[k].chapitre
        if not chapitres or chapitres[-1]["numero"] != f"{ch.numero:02d}":
            chapitres.append({"numero": f"{ch.numero:02d}", "titre": ch.titre})
    reprise = {"etiquette": "À suivre", "titre": f"Saison {suivante} : {quand}.", "lignes": chapitres}
    avant = fiches[debut - 1].episode_suivant
    transition = avant.transition if isinstance(avant, SuivantNumero) and avant.numero == debut else ""
    return reprise, {"etiquette": f"Saison {suivante} · Nº {debut:02d}", "titre": fiches[debut].titre,
                     "transition": transition, "invitation": INVITATION, "saisons": []}


# --- Chromium : PNG et PDF ------------------------------------------------------------------

@dataclass
class Resultat:
    pngs: list[Path]
    pdf: Path | None
    rephotographiees: list[int] = field(default_factory=list)
    couvertures: dict[str, Path] = field(default_factory=dict)  # variante → PNG (sortie/NN/couvertures/)


def photographier(htmls: list[str], dossier: Path, prefixe: str = "page", pdf: Path | None = None,
                  largeur: int = 1080, hauteur: int = 1350, seulement: set[int] | None = None) -> Resultat:
    """Écrit chaque page en HTML puis en PNG ; assemble le PDF si demandé.

    `seulement` : numéros des pages à rephotographier (rendu incrémental) ; les autres gardent leur PNG et
    leur page PDF (dossier pdf/), écrits au rendu précédent.
    """
    from playwright.sync_api import sync_playwright
    from pypdf import PdfReader, PdfWriter

    dossier.mkdir(parents=True, exist_ok=True)
    (dossier / "html").mkdir(exist_ok=True)
    pages_pdf = dossier / "pdf"
    if pdf is not None:
        pages_pdf.mkdir(exist_ok=True)
    pngs = [dossier / f"{prefixe}-{k:02d}.png" for k in range(1, len(htmls) + 1)]
    a_faire = [k for k in range(1, len(htmls) + 1) if seulement is None or k in seulement]
    if a_faire:
        with sync_playwright() as pw:
            navigateur = pw.chromium.launch()
            try:
                onglet = navigateur.new_page(viewport={"width": largeur, "height": hauteur}, device_scale_factor=1)
                for k in a_faire:
                    source = dossier / "html" / f"{prefixe}-{k:02d}.html"
                    source.write_text(htmls[k - 1], encoding="utf-8", newline="\n")
                    onglet.goto(source.as_uri())
                    onglet.evaluate("document.fonts.ready.then(() => true)")
                    echecs = onglet.evaluate("[...document.fonts].filter(f => f.status === 'error').map(f => f.family)")
                    if echecs:
                        raise ErreurRendu(f"{source.name} : polices non chargées {sorted(set(echecs))}")
                    # A24 : une image absente laisserait la zone de la photo vide sans autre signe.
                    absentes = onglet.evaluate("Promise.all([...document.images].map(i => i.decode().catch(() => null)))"
                                               ".then(() => [...document.images].filter(i => !i.naturalWidth)"
                                               ".map(i => decodeURI(i.src)))")
                    if absentes:
                        raise ErreurRendu(f"{source.name} : images non chargées {absentes}")
                    onglet.screenshot(path=str(pngs[k - 1]), clip={"x": 0, "y": 0, "width": largeur, "height": hauteur})
                    if pdf is not None:
                        octets = onglet.pdf(width=f"{largeur}px", height=f"{hauteur}px", print_background=True,
                                            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
                        (pages_pdf / f"{prefixe}-{k:02d}.pdf").write_bytes(octets)
            finally:
                navigateur.close()
    if pdf is not None:
        ecrivain = PdfWriter()
        for k in range(1, len(htmls) + 1):
            ecrivain.append(PdfReader(pages_pdf / f"{prefixe}-{k:02d}.pdf"), pages=[0])
        provisoire = pdf.with_name(pdf.name + ".partiel")
        with open(provisoire, "wb") as f:
            ecrivain.write(f)
        provisoire.replace(pdf)
    return Resultat(pngs, pdf)


def empreinte_page(html: str) -> str:
    """sha256 du HTML d'une page et des fichiers locaux qu'il charge (images, polices)."""
    import hashlib
    import re
    from urllib.parse import urlparse
    from urllib.request import url2pathname

    h = hashlib.sha256(html.encode("utf-8"))
    for url in sorted(set(re.findall(r"file:///[^'\")\s]+", html))):
        chemin = Path(url2pathname(urlparse(url).path))
        if chemin.exists():
            h.update(hashlib.sha256(chemin.read_bytes()).digest())
    return h.hexdigest()


def rendre_episode(depot: Depot, numero: int, sortie: Path | None = None,
                   contenu: Contenu | Path | None = None, incremental: bool = True,
                   avec_planche: bool = True) -> Resultat:
    """Rend l'épisode : PNG par page, carrousel PDF, planche, et les deux variantes de couverture. Seules les pages
    modifiées sont rephotographiées."""
    import yaml

    moteur = Moteur(depot)
    ep = charger_episode(depot, numero, contenu)
    htmls = pages_html(moteur, ep)
    dossier = sortie or depot.racine / "sortie" / f"{numero:02d}"
    dossier.mkdir(parents=True, exist_ok=True)
    for ancien in [*dossier.glob("page-*.png"), *(dossier / "pdf").glob("page-*.pdf")]:
        if int(ancien.stem.split("-")[1]) > len(htmls):  # page retirée du contenu
            ancien.unlink()
    for ancien in dossier.glob("*.pdf"):
        if ancien.name != f"{numero:02d}-{slug(ep.fiche.titre)}.pdf":
            ancien.unlink()
    fichier_empreintes = dossier / "empreintes.yaml"
    anciennes = (lire_yaml(fichier_empreintes) or {}) if incremental and fichier_empreintes.exists() else {}
    nouvelles = {f"page-{k:02d}": empreinte_page(h) for k, h in enumerate(htmls, start=1)}
    a_faire = {k for k in range(1, len(htmls) + 1)
               if anciennes.get(f"page-{k:02d}") != nouvelles[f"page-{k:02d}"]
               or not (dossier / f"page-{k:02d}.png").exists() or not (dossier / "pdf" / f"page-{k:02d}.pdf").exists()}
    pdf = dossier / f"{numero:02d}-{slug(ep.fiche.titre)}.pdf"
    resultat = photographier(htmls, dossier, "page", pdf, seulement=a_faire)
    resultat.rephotographiees = sorted(a_faire)
    # Les deux variantes de couverture, pour le choix de l'utilisateur : sortie/NN/couvertures/a.png et classique.png.
    variantes = couvertures_html(moteur, ep)
    for style, html in variantes.items():
        nouvelles[f"couverture-{style}"] = empreinte_page(html)
    styles = [s for s in variantes if anciennes.get(f"couverture-{s}") != nouvelles[f"couverture-{s}"]
              or not (dossier / "couvertures" / f"{s}.png").exists()]
    if styles:
        rendus = photographier([variantes[s] for s in styles], dossier / "couvertures", "variante")
        for style, png in zip(styles, rendus.pngs):
            png.replace(dossier / "couvertures" / f"{style}.png")
    resultat.couvertures = {s: dossier / "couvertures" / f"{s}.png" for s in variantes}
    fichier_empreintes.write_text(yaml.safe_dump(nouvelles, sort_keys=True), encoding="utf-8", newline="\n")
    if avec_planche and (a_faire or not (dossier / "planche.png").exists()):
        from serie.planche import planche

        planche(resultat.pngs, dossier / "planche.png")
    return resultat


def rendre_bilan(depot: Depot, saison: int, contenu: Path | None = None, sortie: Path | None = None) -> Resultat:
    """Post bilan de la saison : couverture, sommaire (contenu/bilan-N.yaml) et fin → sortie/bilan-N/, PNG et PDF.

    La fin (« Saison N+1 : reprise le… », A35) vient de calendrier.yaml et des fiches : rien à écrire.
    """
    chemin = contenu or depot.racine / "contenu" / f"bilan-{saison}.yaml"
    if not chemin.exists():
        raise ErreurRendu(f"{chemin.name} n'existe pas")
    bilan = ContenuBilan.model_validate(lire_yaml(chemin))
    if bilan.saison != saison:
        raise ErreurRendu(f"le contenu est celui du bilan {bilan.saison}, pas {saison}")
    dossier = sortie or depot.racine / "sortie" / f"bilan-{saison}"
    return photographier(pages_bilan_html(Moteur(depot), bilan), dossier, "page", dossier / f"bilan-saison-{saison}.pdf")
