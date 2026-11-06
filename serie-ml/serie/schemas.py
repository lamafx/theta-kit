"""Schémas des fichiers du dépôt.

- Fiche : banque/episodes/NN-titre.yaml (entrée, ne change pas).
- Contenu : contenu/NN.yaml (ce que l'agent écrit : textes et paramètres de visuels).
- Glossaire, état, calendrier, provenance.

Les règles qui demandent d'autres fichiers (charte, état, glossaire) sont dans serie/fiches.py.
"""

from __future__ import annotations

import datetime as dt
import re
from enum import Enum
from typing import Annotated, Any, Literal, Union

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from serie.depot import cle_episode

NB_EPISODES = 62

Texte = Annotated[str, Field(min_length=1)]
NumeroEpisode = Annotated[int, Field(ge=1, le=NB_EPISODES)]


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)


# --- Familles de visuels (charte/bibliotheque-visuelle.md) -----------------------------

FAMILLES_COUVERTURE = ("nuage", "courbe", "reseau", "barres", "niveaux", "blocs", "grille", "arbre")
# « flux » ne sert qu'aux pages intérieures.
FAMILLES = FAMILLES_COUVERTURE + ("flux",)

FamilleCouverture = Literal["nuage", "courbe", "reseau", "barres", "niveaux", "blocs", "grille", "arbre"]
Famille = Literal["nuage", "courbe", "reseau", "barres", "niveaux", "blocs", "grille", "arbre", "flux"]
# Couverture A (session de design n° 2) : le geste du robot (bibliotheque/robot-gestes.json) et sa position.
Geste = Literal["visiere", "pointer", "menton", "deposer", "loupe", "balance", "compter", "paume", "gratter",
                "regler", "tracer", "porter", "ecoute"]
PositionRobot = Literal["droite", "gauche", "bas", "haut", "bas-centre"]
# Couverture A (robot qui fait le geste) ou classique (robot de face au centre, d'avant la session de design n° 2) :
# les deux sont rendues pour chaque épisode, celle du contenu va dans le carrousel (décision de l'utilisateur, 2026-11-02).
STYLES_COUVERTURE = ("a", "classique")
StyleCouverture = Literal["a", "classique"]


# --- Fiche d'épisode -------------------------------------------------------------------

# Types de page employés par la banque. Hors des pages fixes, le type d'une page de fiche
# devient le rôle de la page de contenu : l'étiquette affichée (A01). ROLES_VERS_GABARITS
# dit quel gabarit rend chaque rôle (A02).
TypePageFiche = Literal[
    "Couverture",
    "Ouverture",
    "Problème",
    "Mécanisme",
    "Comparaison",
    "Formule",
    "Exemple chiffré",
    "Exemple",
    "Piège",
    "Contexte",
    "Repère",
    "Lien",
    "Lecture",
    "Définition",
    "Remèdes",
    "Diagnostic",
    "Évaluation",
    "Fin",
]

PAGES_FIXES = {"Couverture": "couverture", "Ouverture": "ouverture", "Fin": "fin"}

Role = Literal[
    "Problème", "Mécanisme", "Comparaison", "Formule", "Exemple chiffré", "Piège", "Contexte",
    "Repère", "Lien", "Lecture", "Définition", "Remèdes", "Diagnostic", "Évaluation", "Exemple",
]

# Gabarits qui peuvent rendre chaque rôle (décisions A02 et A10).
ROLES_VERS_GABARITS: dict[str, tuple[str, ...]] = {
    "Problème": ("mecanisme",),
    "Mécanisme": ("mecanisme",),
    "Comparaison": ("comparaison",),
    "Formule": ("formule",),
    "Exemple chiffré": ("exemple",),
    "Piège": ("piege",),
    "Contexte": ("contexte",),
    "Repère": ("mecanisme",),
    "Lien": ("mecanisme",),
    "Lecture": ("mecanisme",),
    "Définition": ("formule",),
    "Remèdes": ("formule",),
    "Diagnostic": ("comparaison",),
    "Évaluation": ("exemple",),
    "Exemple": ("mecanisme", "capture"),  # capture si la fiche donne une image réelle (A09)
}


class Chapitre(Strict):
    numero: Annotated[int, Field(ge=1, le=10)]
    titre: Texte


class Couverture(Strict):
    famille: FamilleCouverture
    description: Texte
    verbe: Texte  # ce que fait le robot ; il donne le geste
    geste: Geste
    position: PositionRobot | None = None  # par défaut, celle du geste
    doigts: Annotated[int, Field(ge=1, le=5)] | None = None  # geste « compter »


class TermeIntroduit(Strict):
    terme: Texte
    formes: Annotated[list[Texte], Field(min_length=1)]


class PageFiche(Strict):
    page: Annotated[int, Field(ge=1)]
    type: TypePageFiche
    message: Texte | None = None
    image_reelle: Texte | None = None


def gabarit_page_fiche(page: PageFiche) -> str | None:
    """Gabarit qui rend une page de fiche ; None si aucun n'est décidé."""
    if page.type in PAGES_FIXES:
        return PAGES_FIXES[page.type]
    if page.type == "Exemple":
        return "capture" if page.image_reelle else "mecanisme"
    gabarits = ROLES_VERS_GABARITS.get(page.type)
    return gabarits[0] if gabarits else None


class SuivantNumero(Strict):
    numero: NumeroEpisode
    transition: Texte


class SuivantTexte(Strict):
    """Utilisé par le dernier épisode de la série, qui n'a pas de suivant."""

    texte: Texte


class Lien(Strict):
    titre: Texte
    url: Annotated[str, Field(pattern=r"^https?://\S+$")]


class SourceOriginale(Strict):
    citation: Texte
    liens: list[Lien] = []


class References(Strict):
    cours: list[Lien] = []
    sources_originales: list[SourceOriginale] = []

    @property
    def nombre(self) -> int:
        return len(self.cours) + len(self.sources_originales)


class Fiche(Strict):
    numero: NumeroEpisode
    titre: Texte
    format: Literal["court", "long"]
    saison: Annotated[int, Field(ge=1, le=4)]
    chapitre: Chapitre
    accroche: Texte
    couverture: Couverture
    prerequis_explicites: list[NumeroEpisode]
    termes_introduits: list[TermeIntroduit]
    pages: Annotated[list[PageFiche], Field(min_length=3)]
    episode_suivant: Union[SuivantNumero, SuivantTexte]
    references: References
    faits_verifies: list[Texte] = []
    a_ne_pas_ecrire: list[Texte] = []

    @model_validator(mode="after")
    def _structure(self) -> "Fiche":
        numeros = [p.page for p in self.pages]
        if numeros != list(range(1, len(self.pages) + 1)):
            raise ValueError(f"pages numérotées {numeros}, attendu 1 à {len(self.pages)} dans l'ordre")

        types = [p.type for p in self.pages]
        if types[0] != "Couverture" or types[1] != "Ouverture" or types[-1] != "Fin":
            raise ValueError(f"les pages doivent commencer par Couverture, Ouverture et finir par Fin : {types}")
        for p in self.pages[2:-1]:
            if p.type in ("Couverture", "Ouverture", "Fin"):
                raise ValueError(f"page {p.page} : {p.type} n'est permis qu'à sa place fixe")
        for p in self.pages:
            fixe = p.type in ("Couverture", "Fin")
            if not fixe and p.message is None:
                raise ValueError(f"page {p.page} ({p.type}) : message manquant")
            if fixe and p.message is not None:
                raise ValueError(f"page {p.page} ({p.type}) : pas de message sur cette page")

        for n in self.prerequis_explicites:
            if n >= self.numero:
                raise ValueError(f"prérequis {n} n'est pas antérieur à l'épisode {self.numero}")

        if isinstance(self.episode_suivant, SuivantNumero):
            if self.episode_suivant.numero != self.numero + 1:
                raise ValueError(
                    f"épisode suivant {self.episode_suivant.numero}, attendu {self.numero + 1}"
                )
        elif self.numero != NB_EPISODES:
            raise ValueError("seul le dernier épisode peut remplacer l'épisode suivant par un texte")

        if self.references.nombre == 0:
            raise ValueError("aucune référence")
        return self


# --- Contenu d'un épisode (écrit par l'agent) --------------------------------------------

TypePage = Literal[
    "couverture", "ouverture", "mecanisme", "comparaison", "formule",
    "exemple", "piege", "contexte", "capture", "fin",
]


class Visuel(Strict):
    """Un visuel de la bibliothèque : une famille et ses paramètres, jamais de dessin libre.

    Les paramètres autorisés par famille sont contrôlés par `serie verifier` (jalon 3).
    `calcul` nomme la fonction de calculs/ qui produit les valeurs (courbe, points, chemin).
    """

    famille: Famille
    params: dict[str, Any] = {}
    calcul: Texte | None = None


class Encadre(Strict):
    titre: Texte
    texte: Texte


class Panneau(Strict):
    """Le panneau gris de la page formule : une formule, ou une phrase définie (Définition, Remèdes)."""

    formule: Texte | None = None
    phrase: Texte | None = None

    @model_validator(mode="after")
    def _un_seul(self) -> "Panneau":
        if (self.formule is None) == (self.phrase is None):
            raise ValueError("le panneau porte une formule ou une phrase, pas les deux")
        return self


class LigneFormule(Strict):
    """Une ligne sous le panneau : un symbole et son sens, ou un point d'une liste numérotée."""

    symbole: Texte | None = None
    sens: Texte


class Colonne(Strict):
    titre: Texte
    champ: Texte  # clé d'une ligne renvoyée par le calcul
    style: Literal["normal", "accent", "gras"] = "normal"


class Tableau(Strict):
    """Les valeurs viennent toutes d'une fonction de calculs/, appelée avec `params`."""

    colonnes: Annotated[list[Colonne], Field(min_length=1)]
    calcul: Texte
    params: dict[str, Any] = {}


class Cas(Strict):
    etiquette: Texte
    titre: Texte
    texte: Texte
    alerte: bool = False
    retenu: bool = False  # le cas à garder : filet et titre en accent
    params: dict[str, Any] = {}


class Image(Strict):
    """Une image réelle demandée par la page (decisions-automatisation.md, 9.5, et serie/images.py).

    L'agent écrit ce que l'image doit montrer, tiré d'un fait sourcé de la fiche ; `serie images NN`
    cherche les candidates, et `fichier` nomme l'image retenue (chemin dans assets/images/, avec sa
    fiche .yaml à côté). Le crédit est écrit par le code à partir de cette fiche, jamais par l'agent.
    Sans image retenue, la page est rendue dans sa variante sans image.
    """

    attendu: Texte  # ce que l'image doit montrer : sujet, lieu, date
    legende: Texte  # ce que montre l'image, rien de plus
    fichier: Texte | None = None
    recherche: list[Texte] = []  # mots-clés pour `serie images NN` (par défaut : attendu)


class Annotation(Strict):
    """Cadre d'accent posé sur une rangée de la capture, son badge à l'intérieur (A24) : une seule position,
    `haut`, en pixels depuis le haut de l'écran ; `hauteur` : celle de la rangée, assez pour le badge."""

    texte: Texte
    haut: Annotated[int, Field(ge=0)]
    hauteur: Annotated[int, Field(ge=40)]


class Repere(Strict):
    date: Texte
    texte: Texte


class PageBase(Strict):
    sources: list[Texte] = []  # identifiants d'extraits de sources/NN/


class PageAvecRole(PageBase):
    role: Role  # l'étiquette affichée au-dessus du titre

    @model_validator(mode="after")
    def _role_permis(self) -> "PageAvecRole":
        permis = ROLES_VERS_GABARITS[self.role]
        if self.type not in permis:
            raise ValueError(f"le rôle « {self.role} » se rend avec {' ou '.join(permis)}, pas {self.type}")
        return self


class PageCouverture(PageBase):
    type: Literal["couverture"]
    titre: Texte | None = None  # par défaut, le titre de l'ouverture ; à part si ses coupures de ligne diffèrent
    visuel: Visuel | None = None  # la famille est fixée par la fiche
    # Réglages du motif pour la couverture classique (robot au centre, motif pleine largeur) ; par défaut, `visuel`.
    visuel_classique: Visuel | None = None


class PageOuverture(PageBase):
    type: Literal["ouverture"]
    rappel: Texte | None = None  # fixé par le code pour l'épisode 01 et un début de chapitre (serie/prerequis.py)
    titre: Texte
    texte: Texte
    visuel: Visuel  # obligatoire (C2)
    legende: Texte | None = None


class PageMecanisme(PageAvecRole):
    type: Literal["mecanisme"]
    titre: Texte
    texte: Texte
    visuel: Visuel
    encadres: Annotated[list[Encadre], Field(max_length=2)] = []


class PageComparaison(PageAvecRole):
    type: Literal["comparaison"]
    titre: Texte
    texte: Texte
    visuel: Visuel  # même visuel pour chaque cas, un seul paramètre change
    cas: Annotated[list[Cas], Field(min_length=2, max_length=3)]
    encadre: Encadre | None = None


class PageFormule(PageAvecRole):
    type: Literal["formule"]
    titre: Texte
    texte: Texte
    panneau: Panneau
    lignes: Annotated[list[LigneFormule], Field(min_length=1)]

    @model_validator(mode="after")
    def _forme(self) -> "PageFormule":
        symboles = [l.symbole is not None for l in self.lignes]
        if self.role == "Formule":
            if self.panneau.formule is None or not all(symboles):
                raise ValueError("rôle Formule : une formule dans le panneau, un symbole par ligne")
        elif self.panneau.phrase is None or any(symboles):
            raise ValueError(f"rôle {self.role} : une phrase dans le panneau, des lignes numérotées sans symbole")
        return self


class PageExemple(PageAvecRole):
    type: Literal["exemple"]
    titre: Texte
    texte: Texte
    tableau: Tableau | None = None
    visuel: Visuel | None = None
    conclusion: Texte | None = None

    @model_validator(mode="after")
    def _illustration(self) -> "PageExemple":
        if self.tableau is None and self.visuel is None:
            raise ValueError("une page exemple a un tableau ou un visuel")
        return self


class EncadrePiege(Strict):
    """L'encadré d'alerte du piège (tests/reference/07-Piege.png) : son titre est fixe."""

    titre: Literal["Ce que ça veut dire"] = "Ce que ça veut dire"
    texte: Texte


class PagePiege(PageAvecRole):
    type: Literal["piege"]
    titre: Texte
    texte: Texte
    visuel: Visuel  # obligatoire (C2)
    encadre: EncadrePiege  # obligatoire (C2)


class PageContexte(PageAvecRole):
    type: Literal["contexte"]
    titre: Texte
    texte: Texte
    image: Image
    reperes: Annotated[list[Repere], Field(max_length=3)] = []


class PageCapture(PageAvecRole):
    """Capture d'écran. Une capture personnelle ne se cherche pas et ne se fabrique pas : sans image
    retenue, la page montre le schéma `sans_image` (famille Flux), avec la légende « Schéma » (règle D6)."""

    type: Literal["capture"]
    titre: Texte
    texte: Texte
    fenetre: Texte  # titre de la barre de fenêtre au-dessus de la capture
    image: Image
    sans_image: Visuel  # schéma Flux de la variante sans image
    annotation: Annotation | None = None

    @model_validator(mode="after")
    def _schema_flux(self) -> "PageCapture":
        if self.sans_image.famille != "flux":
            raise ValueError("le schéma d'une page capture est un visuel de la famille flux")
        return self


class Verification(Strict):
    """Encadré « Vérifiez-vous » de la page de fin : une question sur ce que l'épisode a montré."""

    question: Texte  # 30 mots au plus (serie verifier)
    page: Annotated[int, Field(ge=2)]  # la page (ouverture ou contenu) qui donne la réponse


class PageFin(PageBase):
    type: Literal["fin"]
    points: Annotated[list[Texte], Field(min_length=3, max_length=3)]
    verification: Verification


PageContenu = Annotated[
    Union[
        PageCouverture, PageOuverture, PageMecanisme, PageComparaison, PageFormule,
        PageExemple, PagePiege, PageContexte, PageCapture, PageFin,
    ],
    Field(discriminator="type"),
]


Hashtag = Annotated[str, Field(pattern=r"^#[A-Za-z][A-Za-z0-9]+$")]


class LinkedIn(Strict):
    """Texte du post (charte/texte-linkedin.md) : l'agent écrit `texte` (accroche, corps, conclusion) et le hashtag
    du sujet ; la signature de série, les hashtags fixes et les liens de licence (D5) sont ajoutés par
    serie/publication.py.

    Ancienne forme, acceptée pour les contenus écrits avant A63 : accroche, intuition, promesse, question."""

    texte: Texte | None = None  # structure libre ; séparer les paragraphes par une ligne vide
    accroche: Texte | None = None
    intuition: Texte | None = None
    promesse: Texte | None = None
    question: Texte | None = None
    hashtag: Hashtag  # propre au sujet
    generique: Hashtag = "#DataScience"  # à remplacer quand un hashtag plus précis existe

    @model_validator(mode="after")
    def _une_seule_forme(self) -> "LinkedIn":
        anciens = (self.accroche, self.intuition, self.promesse, self.question)
        complet = all(b is not None for b in anciens)
        vide = all(b is None for b in anciens)
        if not (complet if self.texte is None else vide):
            raise ValueError("bloc linkedin : soit `texte`, soit accroche, intuition, promesse et question ensemble")
        return self

    @property
    def corps(self) -> str:
        """Le texte du post, avant la signature : `texte`, ou les quatre parties de l'ancienne forme."""
        if self.texte is not None:
            return self.texte.strip()
        return "\n\n".join(b.strip() for b in (self.accroche, self.intuition, self.promesse, self.question))


class Contenu(Strict):
    episode: NumeroEpisode
    pages: Annotated[list[PageContenu], Field(min_length=4, max_length=9)]
    linkedin: LinkedIn | None = None  # obligatoire pour `serie publier`
    couverture: StyleCouverture = "a"  # la variante de couverture retenue pour le carrousel

    @model_validator(mode="after")
    def _ordre(self) -> "Contenu":
        types = [p.type for p in self.pages]
        if types[0] != "couverture" or types[1] != "ouverture" or types[-1] != "fin":
            raise ValueError(f"les pages doivent commencer par couverture, ouverture et finir par fin : {types}")
        for t in types[2:-1]:
            if t in ("couverture", "ouverture", "fin"):
                raise ValueError(f"{t} n'est permis qu'à sa place fixe")
        fin = self.pages[-1]
        if not 2 <= fin.verification.page <= len(self.pages) - 1:
            raise ValueError(
                f"« Vérifiez-vous » : réponse page {fin.verification.page}, "
                f"attendu l’ouverture ou une page de contenu (2 à {len(self.pages) - 1})"
            )
        return self


class BilanCouverture(Strict):
    titre: Texte
    accroche: Texte


class BilanSommaire(Strict):
    titre: Texte
    texte: Texte


class ContenuBilan(Strict):
    """Post bilan d'une saison (charte/bibliotheque-visuelle.md) : couverture et sommaire.

    Les épisodes du sommaire viennent des fiches ; la page de fin, de calendrier.yaml et des fiches (A35).
    """

    saison: Annotated[int, Field(ge=1, le=4)]
    couverture: BilanCouverture
    sommaire: BilanSommaire
    linkedin: LinkedIn | None = None  # texte du post ; obligatoire pour `serie bilan N --publier`


# --- Extraits des références (sources/NN/extraits.yaml) ---------------------------------

class Extrait(Strict):
    """Une courte citation, mot pour mot, d'une référence de la fiche, lue à l'adresse `lu_sur`."""

    id: Annotated[str, Field(pattern=r"^[a-z0-9][a-z0-9-]*$")]
    reference: Texte  # l'adresse de la référence dans la fiche (cours ou source originale)
    lu_sur: Texte  # l'adresse réellement lue (la même, ou une copie : PDF, archive, page de l'éditeur)
    lu_le: dt.date
    extrait: Texte  # la phrase de la source, recopiée mot pour mot (une courte phrase au plus)
    appuie: Texte  # ce que l'extrait justifie dans l'épisode


class ReferenceIllisible(Strict):
    reference: Texte
    raison: Texte


class Sources(Strict):
    episode: NumeroEpisode
    extraits: list[Extrait] = []
    illisibles: list[ReferenceIllisible] = []  # une référence illisible bloque l'épisode (NUIT.md)

    @model_validator(mode="after")
    def _ids_uniques(self) -> "Sources":
        ids = [e.id for e in self.extraits]
        doublons = sorted({i for i in ids if ids.count(i) > 1})
        if doublons:
            raise ValueError(f"identifiants d'extraits en double : {doublons}")
        return self


# --- Glossaire, état, calendrier, provenance -------------------------------------------

class TermeGlossaire(Strict):
    terme: Texte
    introduit_par: NumeroEpisode
    formes: Annotated[list[Texte], Field(min_length=1)]


class Statut(str, Enum):
    A_FAIRE = "a_faire"
    GENERE = "genere"
    RELU = "relu"
    PUBLIE = "publie"
    MESURE = "mesure"

    @property
    def libelle(self) -> str:
        return {
            "a_faire": "à faire",
            "genere": "généré",
            "relu": "relu",
            "publie": "publié",
            "mesure": "mesuré",
        }[self.value]


class EpisodeEtat(BaseModel):
    model_config = ConfigDict(extra="forbid")

    statut: Statut
    etapes: dict[str, Any] = {}
    publie_le: dt.date | None = None


class Saison(Strict):
    episodes: tuple[NumeroEpisode, NumeroEpisode]
    bilan: bool


class Etat(BaseModel):
    model_config = ConfigDict(extra="forbid")

    episodes: dict[str, EpisodeEtat]
    bilans: dict[int, EpisodeEtat]  # posts bilan, par saison (A03)

    @field_validator("episodes", mode="before")
    @classmethod
    def _cles(cls, v: Any) -> Any:
        if isinstance(v, dict):
            return {cle_episode(k): e for k, e in v.items()}
        return v

    @model_validator(mode="after")
    def _tous_les_episodes(self) -> "Etat":
        attendu = {cle_episode(n) for n in range(1, NB_EPISODES + 1)}
        if set(self.episodes) != attendu:
            manquants = sorted(attendu - set(self.episodes))
            en_trop = sorted(set(self.episodes) - attendu)
            raise ValueError(f"épisodes manquants {manquants}, en trop {en_trop}")
        if set(self.bilans) != {1, 2, 3, 4}:
            raise ValueError(f"bilans des saisons {sorted(self.bilans)}, attendu 1 à 4")
        return self


JOURS = Literal["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]


class Calendrier(Strict):
    fuseau: Texte
    creneaux: dict[Literal["semaine_impaire", "semaine_paire"], list[tuple[JOURS, str]]]
    avance_minimum_episodes_relus: Annotated[int, Field(ge=0)]
    date_lancement: dt.date | None = None
    saisons: dict[int, Saison]
    pause_entre_saisons_semaines: Annotated[int, Field(ge=0)]

    @field_validator("creneaux")
    @classmethod
    def _heures(cls, v: dict[str, list[tuple[str, str]]]) -> dict[str, list[tuple[str, str]]]:
        for semaine, creneaux in v.items():
            for jour, heure in creneaux:
                if not re.fullmatch(r"([01]\d|2[0-3]):[0-5]\d", heure):
                    raise ValueError(f"{semaine}, {jour} : heure « {heure} » au format HH:MM attendu")
        return v

    @model_validator(mode="after")
    def _saisons_contigues(self) -> "Calendrier":
        couverts = []
        for s in sorted(self.saisons):
            debut, fin = self.saisons[s].episodes
            couverts.extend(range(debut, fin + 1))
        if couverts != list(range(1, NB_EPISODES + 1)):
            raise ValueError("les saisons doivent couvrir les épisodes 1 à 62, sans trou ni chevauchement")
        return self

    def saison_de(self, numero: int) -> int:
        for s, saison in self.saisons.items():
            debut, fin = saison.episodes
            if debut <= numero <= fin:
                return s
        raise KeyError(numero)


class Provenance(Strict):
    document: Texte
    version_document: int
    exporte_le: dt.date
    fiches: int
    episodes_avec_references: int
    references_total: int
    cours: int
    sources_originales: int
    termes_glossaire: int
    gabarits_reference: int
