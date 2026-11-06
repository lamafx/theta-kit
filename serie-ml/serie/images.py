"""Images réelles : fiche de chaque image, classe de réutilisation et crédit.

Chaque image téléchargée a, à côté d'elle, une fiche .yaml de même nom (voir `FicheImage`).
Le crédit affiché sous l'image est écrit par le code à partir de cette fiche, jamais par l'agent :
« Photo : Auteur · Licence ou conditions · Source ».
"""

from __future__ import annotations

import datetime as dt
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from serie.depot import lire_yaml

Classe = Literal["libre", "a_confirmer", "exclue"]
LIBELLES_CLASSES = {"libre": "libre", "a_confirmer": "à confirmer", "exclue": "exclue"}


class FicheImage(BaseModel):
    """Fiche .yaml d'une image candidate ou retenue (assets/images/)."""

    model_config = ConfigDict(extra="forbid")

    titre: str
    auteur: str
    date: str  # date de la prise de vue, telle que la source la donne
    page_source: str  # page qui décrit l'image et donne ses conditions
    url_fichier: str  # adresse du fichier téléchargé
    source: str  # nom court de la source, pour le crédit (« Wikimedia Commons », « LLNL »…)
    genre: Literal["photo", "capture"] = "photo"
    classe: Classe
    licence: str  # « Domaine public », « CC BY-SA 4.0 », ou les conditions résumées
    conditions: str  # la phrase de la source qui donne les conditions, recopiée mot pour mot
    lien_licence: str | None = None
    description_source: str = ""  # ce que la source dit de l'image, recopié
    sha256: str
    largeur: int = Field(gt=0)
    hauteur: int = Field(gt=0)
    telecharge_le: dt.date
    verification: str = ""  # ce que montre l'image, vérifié à l'œil et contre la description


@dataclass
class ImageRetenue:
    chemin: Path
    fiche: FicheImage

    @property
    def url(self) -> str:
        return self.chemin.as_uri()

    @property
    def credit(self) -> str:
        return credit(self.fiche)


def credit(f: FicheImage) -> str:
    """« Photo : Auteur · Licence ou conditions · Source » (capture : « Capture : Auteur »)."""
    if f.genre == "capture":
        return f"Capture : {f.auteur}"
    morceaux = [f.auteur, f.licence]
    if f.source not in (f.auteur, f.licence):
        morceaux.append(f.source)
    return "Photo : " + " · ".join(morceaux)


def fiche_de(chemin: Path) -> Path:
    return chemin.with_suffix(".yaml")


def charger_image(dossier: Path, fichier: str) -> ImageRetenue | None:
    """L'image `fichier` (chemin dans `dossier`, en principe assets/images/) et sa fiche, si elle peut être affichée.

    Une image sans fiche, ou de classe « exclue », n'est jamais affichée.
    """
    chemin = dossier / fichier
    if not chemin.exists() or not fiche_de(chemin).exists():
        return None
    fiche = FicheImage.model_validate(lire_yaml(fiche_de(chemin)))
    if fiche.classe == "exclue":
        return None
    return ImageRetenue(chemin, fiche)


# --- Classification du droit de réutiliser (consigne D2) ---------------------------------------------------

_EXCLUSIONS = [
    (r"by[- ]nc|(?<![a-z0-9])nc[- ](sa|nd)|non[- ]?commercial|pas d.utilisation commerciale", "pas d'utilisation commerciale (NC)"),
    (r"by[- ](nc[- ])?nd|no[- ]?deriv|pas de modification|sans modification", "pas de modification (ND)"),
    (r"all rights reserved|tous droits réservés", "tous droits réservés"),
    (r"getty|shutterstock|alamy|adobe stock|istock|dreamstime|123rf|depositphotos", "banque d'images payante"),
    (r"générée? par (une )?ia|ai[- ]generated|generated (by|with) (an )?ai|midjourney|dall[- ]?e|stable diffusion",
     "image générée par IA"),
    (r"illustration retouchée|photo[- ]illustration|photomontage", "illustration retouchée"),
]
_LIBRES = [
    (r"public domain|domaine public|pd-usgov|(?<![a-z])pd-|no known copyright restrictions|no restrictions", "domaine public"),
    (r"cc0|cc-zero|creative commons zero", "CC0"),
    (r"cc[- ]by[- ]sa|attribution[- ]share ?alike", "CC BY-SA"),
    (r"cc[- ]by(?![- ]?(nc|nd))|creative commons attribution", "CC BY"),
]
_AUTORISATION = (r"may be (freely )?(used|reproduced|reused|republished)|free(ly)? to (use|reuse)"
                 r"|peu(t|vent) être (librement )?(utilisée?s?|reproduite?s?|réutilisée?s?)")
_MODIFICATION = r"modif|adapt|alter|crop|recadr|derivative|transform"


def classer(licence: str, conditions: str) -> tuple[Classe, str]:
    """Classe une image d'après sa licence et la phrase de la source qui donne ses conditions.

    - « libre » : domaine public (dont les œuvres du gouvernement fédéral américain), CC0, CC BY, CC BY-SA,
      ou une autorisation écrite de réutilisation avec crédit qui couvre la modification ;
    - « exclue » : NC, ND, tous droits réservés, banque payante, image générée par IA, illustration retouchée ;
    - « à confirmer » : tout le reste (conditions floues, « Courtesy of… » sans licence écrite).
    """
    texte = f"{licence} {conditions}".lower()
    for motif, raison in _EXCLUSIONS:
        if re.search(motif, texte):
            return "exclue", raison
    for motif, raison in _LIBRES:
        if re.search(motif, texte):
            return "libre", raison
    if re.search(_AUTORISATION, texte):
        if re.search(_MODIFICATION, texte):
            return "libre", "réutilisation autorisée avec crédit, modification comprise"
        return "a_confirmer", "réutilisation autorisée, mais la modification (noir et blanc, recadrage) n'est pas écrite"
    if "courtesy" in texte or "aimable autorisation" in texte:
        return "a_confirmer", "« Courtesy of… » sans licence écrite"
    return "a_confirmer", "conditions absentes ou incomplètes"


def licence_avec_lien(f: FicheImage) -> str | None:
    """Pour CC BY et CC BY-SA : « CC BY-SA 4.0 : https://… », à reprendre dans le texte LinkedIn (D5)."""
    if re.search(r"cc[- ]by", f.licence.lower()) and f.lien_licence:
        return f"{f.licence} : {f.lien_licence}"
    return None


# --- Recherche et téléchargement (consignes D1 et D3) -------------------------------------------------------

USER_AGENT = "SerieThetaImages/0.1 (projet personnel de carrousels educatifs ; recherche d'images libres)"
TAILLE_MINIMALE = 1200  # plus grand côté, en pixels
CANDIDATES_MAX = 5
PAUSE = 1.0  # secondes entre deux requêtes


@dataclass
class Candidate:
    titre: str
    auteur: str
    date: str
    page_source: str
    url_fichier: str
    source: str
    licence: str
    conditions: str
    lien_licence: str | None
    description: str
    largeur: int
    hauteur: int


def _get(url: str, params: dict | None = None) -> bytes:
    """GET avec l'en-tête User-Agent du projet, puis une pause (rythme des sites).

    Passe par curl quand il existe : sur cet ordinateur, le magasin de certificats de Python contient une
    racine expirée et refuse les sites que curl (Schannel) vérifie correctement.
    """
    import shutil
    import subprocess
    import time
    import urllib.parse
    import urllib.request

    if params:
        url = f"{url}?{urllib.parse.urlencode(params)}"
    if shutil.which("curl"):
        r = subprocess.run(["curl", "-sS", "-L", "--fail", "--max-time", "90", "-A", USER_AGENT, url],
                           capture_output=True, check=False)
        if r.returncode != 0:
            raise OSError(f"curl {url} : {r.stderr.decode('utf-8', 'replace').strip()}")
        donnees = r.stdout
    else:
        requete = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(requete, timeout=90) as reponse:
            donnees = reponse.read()
    time.sleep(PAUSE)
    return donnees


def robots_permet(url: str) -> bool:
    """Respect de robots.txt du site qui sert le fichier."""
    import urllib.parse
    import urllib.robotparser

    base = urllib.parse.urlsplit(url)
    lecteur = urllib.robotparser.RobotFileParser()
    try:
        lecteur.parse(_get(f"{base.scheme}://{base.netloc}/robots.txt").decode("utf-8", "replace").splitlines())
    except Exception:
        return True  # pas de robots.txt lisible : rien n'est interdit
    return lecteur.can_fetch(USER_AGENT, url)


def _sans_html(t: str) -> str:
    import html as h

    return " ".join(h.unescape(re.sub(r"<[^>]+>", " ", t or "")).split())


def chercher_commons(requete: str, limite: int = 10) -> list[Candidate]:
    """Wikimedia Commons (API publique) : fichiers dont le titre ou la description correspondent."""
    import json

    donnees = json.loads(_get("https://commons.wikimedia.org/w/api.php", {
        "action": "query", "format": "json", "generator": "search", "gsrsearch": f"filetype:bitmap {requete}",
        "gsrnamespace": 6, "gsrlimit": limite, "prop": "imageinfo",
        "iiprop": "url|size|extmetadata", "iiextmetadatalanguage": "en", "iiurlwidth": 2400,
    }))
    sortie = []
    for page in (donnees.get("query", {}).get("pages", {}) or {}).values():
        info = (page.get("imageinfo") or [{}])[0]
        meta = {k: _sans_html(str(v.get("value", ""))) for k, v in (info.get("extmetadata") or {}).items()}
        conditions = " ".join(x for x in (meta.get("UsageTerms"), meta.get("Restrictions"),
                                          meta.get("Credit") and f"Credit: {meta['Credit']}") if x)
        # TIFF ou très grand original : la vignette JPEG de Commons (2 400 px), lisible par Chromium.
        url, largeur, hauteur = info.get("url", ""), int(info.get("width") or 0), int(info.get("height") or 0)
        if info.get("thumburl") and (url.lower().endswith((".tif", ".tiff")) or largeur > 2400):
            url, largeur, hauteur = info["thumburl"], int(info.get("thumbwidth") or 0), int(info.get("thumbheight") or 0)
        sortie.append(Candidate(
            titre=page.get("title", ""), auteur=meta.get("Artist") or meta.get("Credit") or "inconnu",
            date=meta.get("DateTimeOriginal") or meta.get("DateTime") or "inconnue",
            page_source=info.get("descriptionurl", ""), url_fichier=url, source="Wikimedia Commons",
            licence=meta.get("LicenseShortName") or meta.get("License") or "", conditions=conditions,
            lien_licence=meta.get("LicenseUrl") or None, description=meta.get("ImageDescription", ""),
            largeur=largeur, hauteur=hauteur,
        ))
    return sortie


def chercher_openverse(requete: str, limite: int = 10) -> list[Candidate]:
    """Openverse (API publique, sans clé) : images sous licence libre agrégées de nombreuses sources."""
    import json

    donnees = json.loads(_get("https://api.openverse.org/v1/images/", {"q": requete, "page_size": limite}))
    sortie = []
    for r in donnees.get("results", []):
        code = (r.get("license") or "").lower()
        licence = {"pdm": "Domaine public", "cc0": "CC0"}.get(code, f"CC {code.upper()} {r.get('license_version') or ''}".strip())
        sortie.append(Candidate(
            titre=r.get("title") or "", auteur=r.get("creator") or "inconnu", date="inconnue",
            page_source=r.get("foreign_landing_url") or "", url_fichier=r.get("url") or "",
            source=r.get("source") or r.get("provider") or "Openverse", licence=licence,
            conditions=f"Licence indiquée par Openverse : {licence} {r.get('license_url') or ''}".strip(),
            lien_licence=r.get("license_url"), description=r.get("title") or "",
            largeur=int(r.get("width") or 0), hauteur=int(r.get("height") or 0),
        ))
    return sortie


def _nom_fichier(c: Candidate) -> str:
    from serie.depot import slug

    extension = Path(c.url_fichier.split("?")[0]).suffix.lower() or ".jpg"
    if extension in (".tif", ".tiff"):
        extension = ".jpg"
    return f"{slug(c.source)[:20]}-{slug(Path(c.titre).stem or c.titre)[:50]}{extension}"


def ecrire_atomique(chemin: Path, octets: bytes) -> None:
    """Écrit sous un nom provisoire puis renomme : une coupure ne laisse jamais un fichier à moitié écrit."""
    import os

    chemin.parent.mkdir(parents=True, exist_ok=True)
    provisoire = chemin.with_name(chemin.name + ".partiel")
    provisoire.write_bytes(octets)
    os.replace(provisoire, chemin)


def ecrire_fiche(chemin: Path, fiche: FicheImage) -> None:
    import yaml

    texte = yaml.safe_dump(fiche.model_dump(mode="json"), allow_unicode=True, sort_keys=False, width=110)
    ecrire_atomique(chemin, texte.encode("utf-8"))


def enregistrer(c: Candidate, octets: bytes, dossier: Path, genre: str = "photo") -> Path:
    """Écrit l'image et sa fiche (classe calculée à partir de la licence et des conditions recopiées)."""
    import hashlib

    largeur, hauteur = taille_image(octets)
    if max(largeur, hauteur) < TAILLE_MINIMALE:
        raise ValueError(f"image trop petite : {largeur} × {hauteur} (au moins {TAILLE_MINIMALE} px sur le plus grand côté)")
    classe, raison = classer(c.licence, c.conditions)
    if classe == "exclue":
        raise ValueError(f"image exclue : {raison}")
    chemin = dossier / _nom_fichier(c)
    ecrire_atomique(chemin, octets)
    ecrire_fiche(fiche_de(chemin), FicheImage(
        titre=c.titre, auteur=c.auteur, date=c.date, page_source=c.page_source, url_fichier=c.url_fichier,
        source=c.source, genre=genre, classe=classe, licence=c.licence or "non indiquée",
        conditions=c.conditions or "aucune condition écrite sur la page source", lien_licence=c.lien_licence,
        description_source=c.description, sha256=hashlib.sha256(octets).hexdigest(), largeur=largeur,
        hauteur=hauteur, telecharge_le=dt.date.today(), verification=f"classe : {raison}",
    ))
    return chemin


def chercher_et_telecharger(requetes: list[str], dossier: Path, genre: str = "photo",
                            maximum: int = CANDIDATES_MAX) -> list[Path]:
    """Interroge les API publiques avec chaque requête et télécharge jusqu'à `maximum` candidates.

    Les « libre » passent avant les « à confirmer » ; les « exclues » et les images de moins de 1 200 px
    ne sont jamais téléchargées ; robots.txt est respecté.
    """
    vues, candidates = set(), []
    for requete in requetes:
        for chercheur in (chercher_commons, chercher_openverse):
            try:
                trouvees = chercheur(requete)
            except Exception:  # une API indisponible n'arrête pas la recherche
                continue
            for c in trouvees:
                if c.url_fichier and c.url_fichier not in vues:
                    vues.add(c.url_fichier)
                    candidates.append(c)
    ordre = {"libre": 0, "a_confirmer": 1, "exclue": 2}
    candidates = [c for c in candidates if max(c.largeur, c.hauteur) >= TAILLE_MINIMALE]
    candidates.sort(key=lambda c: ordre[classer(c.licence, c.conditions)[0]])
    telechargees = []
    for c in candidates:
        if len(telechargees) >= maximum:
            break
        if classer(c.licence, c.conditions)[0] == "exclue" or not robots_permet(c.url_fichier):
            continue
        try:
            telechargees.append(enregistrer(c, _get(c.url_fichier), dossier, genre))
        except Exception:
            continue
    return telechargees


def ajouter_candidate(dossier: Path, c: Candidate, genre: str = "photo") -> Path:
    """Candidate trouvée par une recherche à la main (site d'une institution, salle de presse, archive)."""
    if not robots_permet(c.url_fichier):
        raise ValueError(f"robots.txt interdit {c.url_fichier}")
    return enregistrer(c, _get(c.url_fichier), dossier, genre)


def taille_image(octets: bytes) -> tuple[int, int]:
    """Largeur et hauteur d'une image PNG, JPEG ou GIF, lues dans son en-tête."""
    import struct

    if octets[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", octets[16:24])
    if octets[:6] in (b"GIF87a", b"GIF89a"):
        return struct.unpack("<HH", octets[6:10])
    if octets[:2] == b"\xff\xd8":
        i = 2
        while i + 9 < len(octets):
            if octets[i] != 0xFF:
                i += 1
                continue
            marqueur = octets[i + 1]
            if marqueur in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                hauteur, largeur = struct.unpack(">HH", octets[i + 5:i + 9])
                return largeur, hauteur
            if marqueur in (0xD8, 0x01) or 0xD0 <= marqueur <= 0xD7:
                i += 2
                continue
            i += 2 + struct.unpack(">H", octets[i + 2:i + 4])[0]
    raise ValueError("format d'image non reconnu (PNG, JPEG ou GIF attendu)")


# --- serie images NN ----------------------------------------------------------------------------------------

def dossier_candidats(racine: Path, numero: int) -> Path:
    return racine / "assets" / "images" / "candidats" / f"{numero:02d}"


def lister_candidates(dossier: Path) -> list[tuple[Path, FicheImage]]:
    sortie = []
    for f in sorted(dossier.glob("*.yaml")):
        images = [p for p in dossier.glob(f.stem + ".*") if p.suffix != ".yaml"]
        if images:
            sortie.append((images[0], FicheImage.model_validate(lire_yaml(f))))
    return sortie


def images_episode(racine: Path, contenu, numero: int) -> list[str]:
    """Pour chaque page qui demande une image réelle sans image retenue : recherche et téléchargement.

    Les captures personnelles ne se cherchent pas (règle D6) : la page montre son schéma Flux.
    Renvoie un compte rendu, ligne par ligne.
    """
    lignes = []
    dossier = dossier_candidats(racine, numero)
    for k, p in enumerate(contenu.pages, start=1):
        if p.type not in ("contexte", "capture"):
            continue
        if p.type == "capture":
            lignes.append(f"page {k} : capture personnelle, rien à chercher ; schéma Flux « Schéma » (règle D6)")
            continue
        if p.image.fichier and charger_image(racine / "assets" / "images", p.image.fichier):
            lignes.append(f"page {k} : image retenue {p.image.fichier}")
            continue
        requetes = p.image.recherche or [p.image.attendu]
        trouvees = chercher_et_telecharger(requetes, dossier)
        lignes.append(f"page {k} : {len(trouvees)} candidate(s) pour « {p.image.attendu} » dans {dossier.as_posix()}")
    for chemin, f in lister_candidates(dossier):
        lignes.append(f"  {chemin.name} : {LIBELLES_CLASSES[f.classe]} · {f.licence} · {f.largeur} × {f.hauteur} · {f.page_source}")
    return lignes
