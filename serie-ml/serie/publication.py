"""serie publier NN : le dossier publier/NN/ prêt à copier sur LinkedIn (decisions-automatisation.md, 9.5).

- NN-titre.pdf : le carrousel, nom de fichier sans caractère spécial ;
- titre.txt : le titre du document à saisir dans LinkedIn (« Nº 01 · Qu’est-ce que le Machine Learning ? ») ;
- texte.txt : le texte du post (charte/texte-linkedin.md), composé par le code à partir du bloc `linkedin`
  du contenu, plus la signature de série, les liens des licences CC BY (D5) et les hashtags ;
- premier-commentaire.txt : les références de la fiche et les crédits des images ;
- apercus/page-XX.png ;
- couvertures/a.png et classique.png : les deux variantes de couverture, au choix de l'utilisateur (`couverture`
  du contenu ; la retenue est la page 1 du carrousel) ;
- date.txt : la date et l'heure prévues par le calendrier (9.7).
"""

from __future__ import annotations

import json
import re
import shutil
from dataclasses import dataclass
from pathlib import Path

from serie import typographie
from serie.calendrier import date_en_clair, dates_prevues, jour_en_clair
from serie.charte import Charte
from serie.depot import Depot, lire_yaml
from serie.diagnostics import Diagnostic, avertissement, bloquants, erreur
from serie.images import ImageRetenue, licence_avec_lien
from serie.rendu import (Episode, ErreurRendu, Moteur, charger_episode, episode_suivant, image_retenue, rendre_bilan,
                         rendre_episode)
from serie.reprise import ecrire_atomique
from serie.schemas import Calendrier, ContenuBilan, Fiche, LinkedIn
from serie.verification import EMOJI, SUPERLATIFS, TUTOIEMENT, compter_mots

# charte/texte-linkedin.md, section 7.
MOTS_MIN, MOTS_MAX = 60, 220
HASHTAGS_FIXES = ("#MachineLearning", "#IntelligenceArtificielle")
HASHTAG_SERIE = "#ThetaML"  # à la fin de chaque post, écrit exactement ainsi (A34 ; charte.yaml, serie.hashtag)
HASHTAGS_MIN, HASHTAGS_MAX = 4, 5  # 2 fixes + générique + sujet + série = 5 : le maximum est atteint par construction
LIGNES_ACCROCHE = 3
# A68 (2026-11-08) : chaque post renvoie au site, page de l'épisode et labo 3D. Le site lit la même série
# (mode A, même dépôt) ; ses labos sont rattachés aux épisodes dans data/episodes-affichage.json.
SITE = "https://theta-ml.vercel.app"
SITE_LANGUE = "fr"
AFFICHAGE_SITE = Path("..") / "site" / "theta-kit" / "data" / "episodes-affichage.json"
CARACTERES_ACCROCHE = 150  # au-delà, LinkedIn coupe l'accroche avant « voir plus » sur mobile (avertissement, A33)

LIEU = "texte LinkedIn"


class ErreurPublication(Exception):
    pass


def composer(s: str) -> str:
    """Typographie 9.4, sauf dans les adresses (« 1412.6980 » ou « by/4.0 » ne deviennent pas « 1412,6980 »)."""
    adresses = re.findall(r"https?://\S+", s)
    for k, a in enumerate(adresses):  # repère d'un seul caractère (zone privée), que les règles ne touchent pas
        s = s.replace(a, chr(0xE000 + k), 1)
    s = typographie.texte(s)
    for k, a in enumerate(adresses):
        s = s.replace(chr(0xE000 + k), a)
    return s


def titre_document(fiche: Fiche) -> str:
    return composer(f"Nº {fiche.numero:02d} · {fiche.titre}")


def _phrase(s: str) -> str:
    s = s.strip()
    return s if s[-1:] in ".!?…" else s + "."


def prochain(ep: Episode) -> str:
    """Fin de la signature : l'étiquette et le titre du bloc « épisode suivant » de la page de fin, mot pour mot.

    Une seule source, `episode_suivant` (serie/rendu.py) : la page et le post annoncent la même chose (A22).
    """
    s = episode_suivant(ep)
    return _phrase(f"{s['etiquette']} : {s['titre']}" if s["titre"] else s["etiquette"])


def labos_du_site(depot: Depot, numero: int) -> list[str]:
    """Les labos 3D de l'épisode sur le site ; aucun si le site n'est pas à côté de la série."""
    chemin = depot.racine / AFFICHAGE_SITE
    if not chemin.is_file():
        return []
    episodes = json.loads(chemin.read_text(encoding="utf-8")).get("episodes", {})
    return list((episodes.get(f"{numero:02d}") or {}).get("themes") or [])


def liens_site(numero: int | None, labos: list[str]) -> str:
    """Le bloc de liens du post (A68) : la page de l'épisode, puis chaque labo. Sans numéro : l'accueil (bilan)."""
    base = f"{SITE}/{SITE_LANGUE}"
    if numero is None:
        return f"La saison sur le site : {base}"
    lignes = [f"À retrouver sur le site : {base}/episodes/{numero:02d}"]
    lignes += [f"À manipuler dans le labo 3D : {base}/labo/{labo}" for labo in labos]
    return "\n".join(lignes)


def signature(ep: Episode, charte: Charte) -> str:
    serie = charte.donnees["serie"]
    return f"Nº {ep.fiche.numero:02d} · {serie['affichage']}, {serie['sous_titre']}. {prochain(ep)}"


def composer_texte(ep: Episode, charte: Charte, licences: list[str], site: str | None = None) -> str:
    li = ep.contenu.linkedin
    assert li is not None
    blocs = [composer(li.corps), composer(signature(ep, charte))]
    if site:
        blocs.append(composer(site))
    if licences:  # « CC BY-SA 4.0 » est un nom : pas de virgule décimale
        blocs.append("\n".join(composer("Licence de l'image :") + " " + l.replace(" : ", typographie.INSECABLE + ": ")
                               for l in licences))
    texte = "\n\n".join(blocs)
    return texte + "\n\n" + " ".join([*HASHTAGS_FIXES, li.generique, li.hashtag, HASHTAG_SERIE]) + "\n"


def mots_du_texte(texte: str) -> int:
    """Mots du post, hors hashtags et adresses."""
    return compter_mots(re.sub(r"#\w+|https?://\S+", " ", texte))


def controler_linkedin(li: LinkedIn | None, texte: str | None) -> list[Diagnostic]:
    if li is None:
        return [erreur(LIEU, "bloc « linkedin » absent du contenu")]
    diags = []
    corps = li.corps
    if "$" in corps:
        diags.append(erreur(LIEU, "formule en balisage $…$ ; l'écrire en clair (θ ← θ − η∇J)"))
    if re.search(r"https?://|www\.", corps):
        diags.append(erreur(LIEU, "lien externe ; les références vont en premier commentaire"))
    if m := re.search(r"—|--", corps):
        diags.append(erreur(LIEU, f"tiret long « {m.group(0)} » ; employer deux-points, virgule ou nouvelle phrase"))
    if m := re.search(r"#\w+", corps):
        diags.append(erreur(LIEU, f"hashtag « {m.group(0)} » dans le texte ; les hashtags sont ajoutés à la fin par "
                                  "le code (champs hashtag et generique)"))
    for motif, quoi in ((SUPERLATIFS, "superlatif"), (EMOJI, "emoji"), (TUTOIEMENT, "tutoiement")):
        for m in motif.finditer(corps.replace("’", "'")):
            diags.append(erreur(LIEU, f"{quoi} « {m.group(0)} »"))
    accroche = corps.split("\n\n", 1)[0]
    if accroche.count("\n") + 1 > LIGNES_ACCROCHE:
        diags.append(erreur(LIEU, f"accroche : {LIGNES_ACCROCHE} lignes au plus"))
    if len(accroche) > CARACTERES_ACCROCHE:
        diags.append(avertissement(LIEU, f"accroche : {len(accroche)} caractères, LinkedIn risque de la couper "
                                         f"avant « voir plus » ({CARACTERES_ACCROCHE})"))
    fixes = {h.lower() for h in (*HASHTAGS_FIXES, HASHTAG_SERIE)}
    if li.hashtag.lower() in fixes | {li.generique.lower()}:
        diags.append(erreur(LIEU, f"hashtag : {li.hashtag} est déjà un hashtag fixe ; en choisir un propre au sujet"))
    if li.generique.lower() in fixes:
        diags.append(erreur(LIEU, f"generique : {li.generique} est déjà un hashtag fixe"))
    if texte is not None:
        n = mots_du_texte(texte)
        if not MOTS_MIN <= n <= MOTS_MAX:
            diags.append(erreur(LIEU, f"{n} mots, attendu {MOTS_MIN} à {MOTS_MAX}"))
        diags += controler_hashtags(texte, LIEU)
    return diags


def controler_hashtags(texte: str, lieu: str) -> list[Diagnostic]:
    """Hashtags d'un post (texte-linkedin.md, A34, A63) : 4 à 5 en tout, jamais plus ; #ThetaML présent, écrit
    exactement ainsi, et dernier du post. Sert à `serie verifier`, `serie publier` et `serie valider`."""
    hashtags = re.findall(r"#\w+", texte)
    diags = []
    if not HASHTAGS_MIN <= len(hashtags) <= HASHTAGS_MAX:
        diags.append(erreur(lieu, f"{len(hashtags)} hashtags, attendu {HASHTAGS_MIN} à {HASHTAGS_MAX}"))
    if HASHTAG_SERIE not in hashtags:
        autres = [h for h in hashtags if h.lower() == HASHTAG_SERIE.lower()]
        if autres:
            diags.append(erreur(lieu, f"hashtag de série écrit « {autres[0]} » : l'écrire exactement {HASHTAG_SERIE}"))
        else:
            diags.append(erreur(lieu, f"hashtag de série {HASHTAG_SERIE} absent : il termine chaque post"))
    elif hashtags[-1] != HASHTAG_SERIE or hashtags.count(HASHTAG_SERIE) > 1:
        diags.append(erreur(lieu, f"{HASHTAG_SERIE} doit être le dernier hashtag du post, une seule fois"))
    return diags


def premier_commentaire(fiche: Fiche, images: list[ImageRetenue]) -> str:
    """Références de la fiche et crédits des images. Les titres et citations sont recopiés tels quels :
    « D2L 12.3 » est un numéro de section, pas un nombre décimal."""
    deux_points = typographie.INSECABLE + ": "
    lignes = [composer(f"Références de l'épisode Nº {fiche.numero:02d} :")]
    for c in fiche.references.cours:
        lignes.append(f"- {c.titre}{deux_points}{c.url}")
    for s in fiche.references.sources_originales:
        liens = " ; ".join(l.url for l in s.liens)
        lignes.append(f"- {s.citation}" + (f"{deux_points}{liens}" if liens else ""))
    if images:
        lignes += ["", composer("Images :")]
        for im in images:
            lignes.append(f"- {im.credit}{deux_points}{im.fiche.page_source}")
    return "\n".join(lignes) + "\n"


def texte_du_post(moteur: Moteur, ep: Episode) -> tuple[str | None, list[ImageRetenue]]:
    """Texte du post (None sans bloc `linkedin`) et images retenues de l'épisode, dont les licences CC BY."""
    images = [im for p in ep.contenu.pages if p.type in ("contexte", "capture")
              if (im := image_retenue(moteur, p.image)) is not None]
    licences = sorted({l for im in images if (l := licence_avec_lien(im.fiche))})
    site = liens_site(ep.fiche.numero, labos_du_site(moteur.depot, ep.fiche.numero))
    return (composer_texte(ep, moteur.charte, licences, site) if ep.contenu.linkedin else None), images


@dataclass
class Publication:
    dossier: Path | None
    diagnostics: list[Diagnostic]


def publier_episode(depot: Depot, numero: int, contenu: Path | None = None, sortie: Path | None = None,
                    rendu: Path | None = None) -> Publication:
    """Contrôle le texte du post, rend l'épisode (incrémental) et écrit publier/NN/ ; rien n'est écrit si une
    erreur bloquante est trouvée."""
    ep = charger_episode(depot, numero, contenu)
    moteur = Moteur(depot)
    texte, images = texte_du_post(moteur, ep)
    diags = controler_linkedin(ep.contenu.linkedin, texte)
    dates = dates_prevues(ep.calendrier)
    quand = dates.get(("episode", numero))
    if quand is None:
        diags.append(avertissement("calendrier", "date_lancement non fixée dans calendrier.yaml : date à venir"))
    if bloquants(diags):
        return Publication(None, diags)

    try:
        resultat = rendre_episode(depot, numero, rendu, contenu)
    except ErreurRendu as exc:
        raise ErreurPublication(str(exc)) from exc
    dossier = sortie or depot.racine / "publier" / f"{numero:02d}"
    if dossier.exists():
        shutil.rmtree(dossier)
    (dossier / "apercus").mkdir(parents=True)
    shutil.copy(resultat.pdf, dossier / resultat.pdf.name)
    for png in resultat.pngs:
        shutil.copy(png, dossier / "apercus" / png.name)
    if resultat.couvertures:
        (dossier / "couvertures").mkdir()
        for style, png in resultat.couvertures.items():
            shutil.copy(png, dossier / "couvertures" / f"{style}.png")
    ecrire_atomique(dossier / "titre.txt", titre_document(ep.fiche) + "\n")
    ecrire_atomique(dossier / "texte.txt", texte)
    ecrire_atomique(dossier / "premier-commentaire.txt", premier_commentaire(ep.fiche, images))
    date = date_en_clair(quand, ep.calendrier.fuseau) if quand else "à fixer : date_lancement absente de calendrier.yaml"
    ecrire_atomique(dossier / "date.txt", date + "\n")
    return Publication(dossier, diags)


def signature_bilan(saison: int, calendrier: Calendrier, charte: Charte) -> str:
    """Signature du post bilan : la reprise vient de calendrier.yaml, comme sur la page de fin (A35)."""
    serie = charte.donnees["serie"]
    debut = f"Saison {saison} · {serie['affichage']}, {serie['sous_titre']}."
    suivante = calendrier.saisons.get(saison + 1)
    if suivante is None:
        return debut
    date = dates_prevues(calendrier).get(("episode", suivante.episodes[0]))
    return f"{debut} Saison {saison + 1} : reprise {'le ' + jour_en_clair(date) if date else 'prochainement'}."


def composer_texte_bilan(bilan: ContenuBilan, calendrier: Calendrier, charte: Charte, site: str | None = None) -> str:
    li = bilan.linkedin
    assert li is not None
    blocs = [composer(li.corps), composer(signature_bilan(bilan.saison, calendrier, charte))]
    if site:
        blocs.append(composer(site))
    corps = "\n\n".join(blocs)
    return corps + "\n\n" + " ".join([*HASHTAGS_FIXES, li.generique, li.hashtag, HASHTAG_SERIE]) + "\n"


def publier_bilan(depot: Depot, saison: int, contenu: Path | None = None, sortie: Path | None = None,
                  rendu: Path | None = None) -> Publication:
    """Contrôle le texte du post bilan, rend le bilan et écrit publier/bilan-N/ ; rien n'est écrit si une erreur
    bloquante est trouvée. Les références restent sur chaque épisode : pas de premier commentaire."""
    from serie.etat import charger_calendrier

    calendrier = charger_calendrier(depot)
    chemin = contenu or depot.racine / "contenu" / f"bilan-{saison}.yaml"
    if not chemin.exists():
        raise ErreurPublication(f"{chemin.name} n'existe pas")
    bilan = ContenuBilan.model_validate(lire_yaml(chemin))
    texte = composer_texte_bilan(bilan, calendrier, Moteur(depot).charte, liens_site(None, [])) if bilan.linkedin else None
    diags = controler_linkedin(bilan.linkedin, texte)
    if bloquants(diags):
        return Publication(None, diags)
    try:
        resultat = rendre_bilan(depot, saison, contenu, rendu)
    except ErreurRendu as exc:
        raise ErreurPublication(str(exc)) from exc
    dossier = sortie or depot.racine / "publier" / f"bilan-{saison}"
    if dossier.exists():
        shutil.rmtree(dossier)
    (dossier / "apercus").mkdir(parents=True)
    shutil.copy(resultat.pdf, dossier / resultat.pdf.name)
    for png in resultat.pngs:
        shutil.copy(png, dossier / "apercus" / png.name)
    ecrire_atomique(dossier / "titre.txt", f"Saison {saison} · bilan\n")
    ecrire_atomique(dossier / "texte.txt", texte)
    quand = dates_prevues(calendrier).get(("bilan", saison))
    date = date_en_clair(quand, calendrier.fuseau) if quand else "à fixer : date_lancement absente de calendrier.yaml"
    ecrire_atomique(dossier / "date.txt", date + "\n")
    return Publication(dossier, diags)
