"""Publication automatique sur LinkedIn par l'API officielle (OAuth 2.0), décision de l'utilisateur du 2026-10-30.

- `connecter` : l'utilisateur autorise l'application dans son navigateur ; identifiants et jeton (60 jours) vont
  dans le gestionnaire d'identifiants de Windows (keyring), jamais dans le dépôt.
- `publier_episode` : le PDF de publier/NN/ (Documents API), le post (Posts API, texte au format little), puis
  le premier commentaire (Comments API) ; trace dans publier/linkedin/NN.yaml (lien du post, pour /stats). Garde-fous : statut « relu », étapes à jour (`serie reprendre`), dossier
  publier/NN/ complet, heure prévue passée depuis moins de RETARD_MAX, jamais deux fois le même épisode.
- `tourner` : lancé toutes les 5 minutes par GitHub Actions (.github/workflows/linkedin.yml du dépôt theta-kit,
  décision du 2026-11-08) ou par le Planificateur de tâches ; publie le post dû, s'il y en a un.
  Sur GitHub, le jeton vient des secrets du dépôt (THETA_LINKEDIN_JETON) et les alertes deviennent des issues.

Réponses de l'API d'après la documentation LinkedIn (Microsoft Learn, versions li-lms-2026-10) : Documents API,
Posts API, Comments API, little Text Format.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import json
import os
import re
import secrets
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable
from zoneinfo import ZoneInfo

import yaml

from serie.depot import Depot, cle_episode
from serie.reprise import changer_statut, ecrire_atomique, etapes_a_refaire, lire_etat
from serie.schemas import Statut

AUTORISATION = "https://www.linkedin.com/oauth/v2/authorization"
JETON = "https://www.linkedin.com/oauth/v2/accessToken"
API = "https://api.linkedin.com"
VERSION = "202610"  # en-tête Linkedin-Version (AAAAMM)
PORTEES = "openid profile w_member_social"
PORT = 8765
REDIRECTION = f"http://localhost:{PORT}/rappel"
SERVICE = "theta-linkedin"  # nom des entrées du gestionnaire d'identifiants
RETARD_MAX = dt.timedelta(hours=2)  # au-delà, un post manqué n'est plus publié seul : l'utilisateur décide
ALERTES_JETON = (14, 3)  # jours avant l'expiration du jeton où la tournée prévient
RESERVES = set("\\|{}@[]()<>#*_~")  # little Text Format : caractères à échapper
VERROU_PERIME = dt.timedelta(minutes=30)


class ErreurLinkedIn(Exception):
    pass


# --- Secrets -----------------------------------------------------------------------------------------------

def sur_github() -> bool:
    return os.environ.get("GITHUB_ACTIONS") == "true"


class Coffre:
    """Identifiants de l'application et jeton : variable THETA_LINKEDIN_<NOM> si elle existe (secrets GitHub),
    sinon le gestionnaire d'identifiants de Windows."""

    def lire(self, nom: str) -> str | None:
        valeur = os.environ.get(f"THETA_LINKEDIN_{nom.upper()}")
        if valeur:
            return valeur
        if sur_github():
            return None
        import keyring

        return keyring.get_password(SERVICE, nom)

    def ecrire(self, nom: str, valeur: str) -> None:
        import keyring

        keyring.set_password(SERVICE, nom, valeur)


def jeton_valide(coffre: Coffre, maintenant: dt.datetime) -> dict:
    brut = coffre.lire("jeton")
    if not brut:
        raise ErreurLinkedIn("pas de connexion : lancez « serie linkedin connecter »")
    jeton = json.loads(brut)
    if dt.datetime.fromisoformat(jeton["expire_le"]) <= maintenant:
        raise ErreurLinkedIn(f"jeton expiré le {jeton['expire_le']} : relancez « serie linkedin connecter »")
    return jeton


# --- HTTP --------------------------------------------------------------------------------------------------

@dataclass
class Reponse:
    statut: int
    entetes: dict[str, str]
    corps: bytes

    def json(self) -> dict:
        return json.loads(self.corps or b"{}")


Transport = Callable[[str, str, dict[str, str], bytes | None], Reponse]


def transport_urllib(methode: str, url: str, entetes: dict[str, str], corps: bytes | None) -> Reponse:
    requete = urllib.request.Request(url, data=corps, headers=entetes, method=methode)
    try:
        with urllib.request.urlopen(requete, timeout=120) as r:
            return Reponse(r.status, {k.lower(): v for k, v in r.headers.items()}, r.read())
    except urllib.error.HTTPError as e:
        return Reponse(e.code, {k.lower(): v for k, v in e.headers.items()}, e.read())


@dataclass
class Client:
    """Appels à l'API au nom du membre connecté ; `transport` est remplacé dans les tests."""

    jeton: str
    personne: str  # urn:li:person:…
    transport: Transport = transport_urllib
    attente: Callable[[float], None] = time.sleep

    def appeler(self, methode: str, chemin: str, donnees: dict | None = None, attendu=(200, 201, 204),
                entetes: dict[str, str] | None = None) -> Reponse:
        h = {"Authorization": f"Bearer {self.jeton}", "X-Restli-Protocol-Version": "2.0.0", **(entetes or {})}
        if chemin.startswith("/rest/"):  # l'en-tête de version ne vaut que pour les adresses versionnées
            h["Linkedin-Version"] = VERSION
        corps = None
        if donnees is not None:
            h["Content-Type"] = "application/json"
            corps = json.dumps(donnees, ensure_ascii=False).encode("utf-8")
        r = self.transport(methode, API + chemin, h, corps)
        if r.statut not in attendu:
            raise ErreurLinkedIn(f"{methode} {chemin} : HTTP {r.statut} {r.corps[:300].decode('utf-8', 'replace')}")
        return r

    def envoyer_document(self, pdf: Path, delai: float = 300) -> str:
        """Documents API : déclarer, téléverser, puis attendre que LinkedIn ait traité le PDF."""
        r = self.appeler("POST", "/rest/documents?action=initializeUpload",
                         {"initializeUploadRequest": {"owner": self.personne}})
        valeur = r.json()["value"]
        # Type explicite : sinon urllib annonce un formulaire et LinkedIn répond 400.
        envoi = self.transport("PUT", valeur["uploadUrl"],
                               {"Authorization": f"Bearer {self.jeton}", "Content-Type": "application/pdf"},
                               pdf.read_bytes())
        if envoi.statut not in (200, 201):
            raise ErreurLinkedIn(f"téléversement du PDF : HTTP {envoi.statut}")
        urn = valeur["document"]
        debut = time.monotonic()
        while True:
            statut = self.appeler("GET", "/rest/documents/" + urllib.parse.quote(urn, safe="")).json().get("status")
            if statut == "AVAILABLE":
                return urn
            if statut == "PROCESSING_FAILED":
                raise ErreurLinkedIn(f"LinkedIn n'a pas pu traiter le PDF {pdf.name}")
            if time.monotonic() - debut > delai:
                raise ErreurLinkedIn(f"PDF {pdf.name} toujours « {statut} » après {delai:.0f} s")
            self.attente(5)

    def creer_post(self, texte: str, document: str, titre: str, visibilite: str = "PUBLIC") -> str:
        r = self.appeler("POST", "/rest/posts", {
            "author": self.personne,
            "commentary": en_little(texte),
            "visibility": visibilite,
            "distribution": {"feedDistribution": "MAIN_FEED", "targetEntities": [], "thirdPartyDistributionChannels": []},
            "content": {"media": {"title": titre, "id": document}},
            "lifecycleState": "PUBLISHED",
            "isReshareDisabledByAuthor": False,
        })
        urn = r.entetes.get("x-restli-id")
        if not urn:
            raise ErreurLinkedIn("post créé sans identifiant (en-tête x-restli-id absent)")
        return urn

    def commenter(self, post: str, texte: str) -> str:
        # /v2 et non /rest : essai réel du 2026-11-06, /rest répond 403 (réservé aux partenaires) à cette application.
        r = self.appeler("POST", f"/v2/socialActions/{urllib.parse.quote(post, safe='')}/comments",
                         {"actor": self.personne, "object": post, "message": {"text": texte}})
        return r.entetes.get("x-restli-id", "")

    def supprimer_post(self, post: str) -> None:
        self.appeler("DELETE", "/rest/posts/" + urllib.parse.quote(post, safe=""),
                     entetes={"X-RestLi-Method": "DELETE"})


def en_little(texte: str) -> str:
    """Texte du post au format little : caractères réservés échappés, hashtags en modèle {hashtag|\\#|…}."""
    morceaux = []
    for mot in re.split(r"(\s+)", texte):  # les blancs (espaces, retours à la ligne) restent tels quels
        if re.fullmatch(r"#[A-Za-z][A-Za-z0-9]+", mot):
            morceaux.append("{hashtag|\\#|" + mot[1:] + "}")
        else:
            morceaux.append("".join("\\" + c if c in RESERVES else c for c in mot))
    return "".join(morceaux)


# --- Connexion ---------------------------------------------------------------------------------------------

def connecter(coffre: Coffre, demander: Callable[[str, bool], str], ouvrir: Callable[[str], object],
              recevoir: Callable[[str], dict[str, str]], transport: Transport = transport_urllib,
              maintenant: dt.datetime | None = None) -> dict:
    """OAuth 2.0 (code d'autorisation) : identifiants demandés une fois, puis jeton et URN du membre rangés."""
    client_id = coffre.lire("client_id") or demander("Client ID de l'application LinkedIn : ", False)
    secret = coffre.lire("client_secret") or demander("Client Secret (non affiché) : ", True)
    coffre.ecrire("client_id", client_id)
    coffre.ecrire("client_secret", secret)
    etat = secrets.token_urlsafe(24)
    ouvrir(AUTORISATION + "?" + urllib.parse.urlencode({
        "response_type": "code", "client_id": client_id, "redirect_uri": REDIRECTION, "state": etat, "scope": PORTEES}))
    retour = recevoir(etat)
    if retour.get("state") != etat:
        raise ErreurLinkedIn("réponse d'autorisation refusée : paramètre state différent")
    if "code" not in retour:
        raise ErreurLinkedIn(f"autorisation refusée : {retour.get('error_description') or retour.get('error')}")
    r = transport("POST", JETON, {"Content-Type": "application/x-www-form-urlencoded"}, urllib.parse.urlencode({
        "grant_type": "authorization_code", "code": retour["code"], "redirect_uri": REDIRECTION,
        "client_id": client_id, "client_secret": secret}).encode())
    if r.statut != 200:
        raise ErreurLinkedIn(f"échange du code : HTTP {r.statut} {r.corps[:300].decode('utf-8', 'replace')}")
    donnees = r.json()
    u = transport("GET", API + "/v2/userinfo", {"Authorization": f"Bearer {donnees['access_token']}"}, None)
    if u.statut != 200:
        raise ErreurLinkedIn(f"lecture du profil : HTTP {u.statut}")
    profil = u.json()
    maintenant = maintenant or dt.datetime.now(dt.timezone.utc)
    jeton = {"access_token": donnees["access_token"], "personne": f"urn:li:person:{profil['sub']}",
             "nom": profil.get("name", ""),
             "expire_le": (maintenant + dt.timedelta(seconds=int(donnees.get("expires_in", 0)))).isoformat()}
    coffre.ecrire("jeton", json.dumps(jeton))
    return jeton


def recevoir_redirection(etat: str, delai: float = 300) -> dict[str, str]:
    """Attend, sur localhost, la redirection de LinkedIn qui porte ce `state`.

    Le navigateur peut envoyer autre chose d'abord (icône de l'onglet, ancien onglet rechargé d'un essai précédent) :
    ces requêtes sont ignorées et l'attente continue.
    """
    from http.server import BaseHTTPRequestHandler, HTTPServer

    recu: dict[str, str] = {}

    class Rappel(BaseHTTPRequestHandler):
        timeout = 10  # une connexion ouverte d'avance par le navigateur ne bloque pas l'attente

        def do_GET(self):  # noqa: N802
            url = urllib.parse.urlparse(self.path)
            valeurs = {k: v[0] for k, v in urllib.parse.parse_qs(url.query).items()}
            attendue = url.path == "/rappel" and valeurs.get("state") == etat
            if attendue:
                recu.update(valeurs)
            self.send_response(200 if attendue else 404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            message = "Connexion reçue. Vous pouvez fermer cet onglet." if attendue else "Requête ignorée."
            self.wfile.write(message.encode("utf-8"))

        def log_message(self, *args):
            pass

    serveur = HTTPServer(("localhost", PORT), Rappel)
    fin = time.monotonic() + delai
    try:
        while not recu:
            reste = fin - time.monotonic()
            if reste <= 0:
                raise ErreurLinkedIn(f"aucune réponse de LinkedIn après {delai:.0f} s : relancez la connexion")
            serveur.timeout = reste
            serveur.handle_request()
    finally:
        serveur.server_close()
    return recu


# --- Publication -------------------------------------------------------------------------------------------

@dataclass
class Envoi:
    numero: int
    pdf: Path
    titre: str
    texte: str
    commentaire: str
    prevu: dt.datetime | None
    refus: list[str] = field(default_factory=list)
    cle: str = ""  # « 01 » ou « bilan-1 » : nom de la trace et clé pour `serie statut`


def heure_prevue(depot: Depot, numero: int, genre: str = "episode") -> dt.datetime | None:
    from serie.calendrier import dates_prevues
    from serie.etat import charger_calendrier

    calendrier = charger_calendrier(depot)
    quand = dates_prevues(calendrier).get((genre, numero))
    return quand.replace(tzinfo=ZoneInfo(calendrier.fuseau)) if quand else None


def _preparer(depot: Depot, numero: int, cle: str, statut: Statut, prevu: dt.datetime | None,
              maintenant: dt.datetime, hors_calendrier: bool) -> Envoi:
    """Les contrôles communs à un épisode et à un bilan."""
    dossier = depot.racine / "publier" / cle
    pdfs = sorted(dossier.glob("*.pdf"))
    lire = lambda nom: (dossier / nom).read_text(encoding="utf-8").strip() if (dossier / nom).is_file() else ""
    envoi = Envoi(numero, pdfs[0] if pdfs else dossier / "absent.pdf", lire("titre.txt"), lire("texte.txt"),
                  lire("premier-commentaire.txt"), prevu, cle=cle)
    if statut is not Statut.RELU:
        envoi.refus.append(f"statut « {statut.libelle} » : seul un post relu est publié")
    if journal_post(depot, cle).is_file():
        envoi.refus.append(f"déjà envoyé (voir {journal_post(depot, cle).relative_to(depot.racine).as_posix()})")
    if not pdfs or not envoi.titre or not envoi.texte:
        envoi.refus.append(f"dossier publier/{cle}/ incomplet (PDF, titre.txt, texte.txt)")
    if not hors_calendrier:
        if envoi.prevu is None:
            envoi.refus.append("pas de date prévue (calendrier.yaml)")
        elif maintenant < envoi.prevu:
            envoi.refus.append(f"trop tôt : prévu le {envoi.prevu.isoformat()}")
        elif maintenant > envoi.prevu + RETARD_MAX:
            envoi.refus.append(f"trop tard : prévu le {envoi.prevu.isoformat()}, retard au-delà de {RETARD_MAX}")
    return envoi


def preparer(depot: Depot, numero: int, maintenant: dt.datetime, hors_calendrier: bool = False) -> Envoi:
    """Ce qui partirait pour un épisode, et toutes les raisons de ne pas l'envoyer."""
    statut = Statut(lire_etat(depot)["episodes"][cle_episode(numero)]["statut"])
    envoi = _preparer(depot, numero, f"{numero:02d}", statut, heure_prevue(depot, numero), maintenant, hors_calendrier)
    a_refaire = etapes_a_refaire(depot, numero)
    if a_refaire:
        envoi.refus.append("étapes à refaire : " + ", ".join(e for e, _ in a_refaire))
    return envoi


def preparer_bilan(depot: Depot, saison: int, maintenant: dt.datetime, hors_calendrier: bool = False) -> Envoi:
    """Ce qui partirait pour un post bilan ; il n'a pas d'étapes, seulement un statut."""
    statut = Statut(lire_etat(depot)["bilans"][saison]["statut"])
    return _preparer(depot, saison, f"bilan-{saison}", statut, heure_prevue(depot, saison, "bilan"), maintenant,
                     hors_calendrier)


def preparer_post(depot: Depot, cle: str, maintenant: dt.datetime, hors_calendrier: bool = False) -> Envoi:
    """`cle` : « 8 », « 08 » ou « bilan-1 »."""
    if cle.startswith("bilan-"):
        return preparer_bilan(depot, int(cle.removeprefix("bilan-")), maintenant, hors_calendrier)
    return preparer(depot, int(cle), maintenant, hors_calendrier)


def journal_post(depot: Depot, cle: str) -> Path:
    """Trace du post, hors de publier/NN/ que `serie publier` efface et refait."""
    return depot.racine / "publier" / "linkedin" / f"{cle}.yaml"


def journal_episode(depot: Depot, numero: int) -> Path:
    return journal_post(depot, f"{numero:02d}")


def envoyer(depot: Depot, envoi: Envoi, client: Client, maintenant: dt.datetime) -> dict:
    """Envoie un post prêt, note sa trace, puis le passe à « publié »."""
    if envoi.refus:
        raise ErreurLinkedIn(f"{envoi.cle} non publié : " + " ; ".join(envoi.refus))
    document = client.envoyer_document(envoi.pdf)
    post = client.creer_post(envoi.texte, document, envoi.titre)
    trace = {"post": post, "lien": f"https://www.linkedin.com/feed/update/{post}/", "document": document,
             "publie_a": maintenant.isoformat(timespec="seconds"),
             "prevu": envoi.prevu.isoformat() if envoi.prevu else None,
             "pdf_sha256": hashlib.sha256(envoi.pdf.read_bytes()).hexdigest()}
    _ecrire_trace(depot, envoi.cle, trace)  # écrit avant toute autre étape : jamais deux posts pour un épisode
    if envoi.commentaire:
        try:
            trace["premier_commentaire"] = client.commenter(post, envoi.commentaire)
        except ErreurLinkedIn as exc:
            trace["premier_commentaire"] = f"échec : {exc} ; à poster à la main"
        _ecrire_trace(depot, envoi.cle, trace)
    changer_statut(depot, envoi.cle, Statut.PUBLIE.value, maintenant.astimezone(ZoneInfo("Africa/Abidjan")).date())
    return trace


def publier_episode(depot: Depot, numero: int, client: Client, maintenant: dt.datetime,
                    hors_calendrier: bool = False) -> dict:
    """Envoie l'épisode, note le post dans publier/linkedin/NN.yaml, puis le passe à « publié »."""
    return envoyer(depot, preparer(depot, numero, maintenant, hors_calendrier), client, maintenant)


def _ecrire_trace(depot: Depot, cle: str, trace: dict) -> None:
    journal_post(depot, cle).parent.mkdir(parents=True, exist_ok=True)
    ecrire_atomique(journal_post(depot, cle), yaml.safe_dump(trace, allow_unicode=True, sort_keys=False))


# --- Tournée planifiée -------------------------------------------------------------------------------------

def posts_dus(depot: Depot, maintenant: dt.datetime) -> list[tuple[str, int, dt.datetime]]:
    """Les posts dont l'heure est passée et qui ne sont ni publiés ni mesurés, du plus ancien au plus récent."""
    from serie.calendrier import dates_prevues
    from serie.etat import charger_calendrier

    calendrier = charger_calendrier(depot)
    zone = ZoneInfo(calendrier.fuseau)
    brut = lire_etat(depot)
    dus = []
    for (genre, n), quand in sorted(dates_prevues(calendrier).items(), key=lambda kv: kv[1]):
        quand = quand.replace(tzinfo=zone)
        if quand > maintenant:
            break
        e = brut["episodes"][cle_episode(n)] if genre == "episode" else brut["bilans"][n]
        if Statut(e["statut"]) not in (Statut.PUBLIE, Statut.MESURE):
            dus.append((genre, n, quand))
    return dus


def post_du(depot: Depot, maintenant: dt.datetime) -> tuple[str, int, dt.datetime] | None:
    """Le plus ancien post dû."""
    dus = posts_dus(depot, maintenant)
    return dus[0] if dus else None


def alerter_jeton(depot: Depot, expire_le: dt.datetime, maintenant: dt.datetime,
                  prevenir: Callable[[str], None]) -> None:
    """Le jeton dure 60 jours et se renouvelle à la main : la tournée prévient avant la panne, une fois par palier."""
    reste = expire_le - maintenant
    for jours in sorted(ALERTES_JETON):
        if reste <= dt.timedelta(days=jours):
            _prevenir_une_fois(depot, f"jeton-{jours}", f"jeton LinkedIn valable jusqu'au {expire_le.date().isoformat()} : "
                                                        "relancez « serie linkedin connecter »", prevenir)
            return


def tourner(depot: Depot, fabriquer_client: Callable[[], Client], maintenant: dt.datetime,
            prevenir: Callable[[str], None], expire_le: dt.datetime | None = None) -> str:
    """Une tournée : publie au plus un post, le plus ancien encore dans ses 2 heures, s'il passe les garde-fous.

    Un post manqué depuis plus de 2 heures ne part jamais seul : la tournée prévient une fois, puis s'occupe des
    suivants, pour qu'un oubli n'arrête pas la série (A65).
    """
    if expire_le is not None:
        alerter_jeton(depot, expire_le, maintenant, prevenir)
    for genre, n, quand in posts_dus(depot, maintenant):
        cle, nom = (f"{n:02d}", f"Nº {n:02d}") if genre == "episode" else (f"bilan-{n}", f"Bilan {n}")
        if maintenant > quand + RETARD_MAX:
            _prevenir_une_fois(depot, cle, f"{nom} manqué (prévu le {quand.isoformat()}) : « serie linkedin publier {cle} "
                                           "--hors-calendrier --oui » pour le publier à la main", prevenir)
            continue
        envoi = preparer_post(depot, cle, maintenant)
        if envoi.refus:
            return _prevenir_une_fois(depot, cle, f"{nom} non publié : " + " ; ".join(envoi.refus), prevenir)
        trace = envoyer(depot, envoi, fabriquer_client(), maintenant)
        message = f"{nom} publié : {trace['lien']}"
        if str(trace.get("premier_commentaire", "")).startswith("échec"):
            message += f" ; premier commentaire à poster à la main ({trace['premier_commentaire']})"
            prevenir(message)
        return message
    return "rien à publier"


def _prevenir_une_fois(depot: Depot, cle: str, message: str, prevenir: Callable[[str], None]) -> str:
    """Un même problème ne déclenche qu'une alerte (la tournée repasse toutes les 5 minutes)."""
    marque = dossier_journal(depot) / f"alerte-{cle}.txt"
    if not marque.is_file() or marque.read_text(encoding="utf-8") != message:
        marque.parent.mkdir(parents=True, exist_ok=True)
        marque.write_text(message, encoding="utf-8")
        prevenir(message)
    return message


def pilote(depot: Depot) -> str:
    """Qui fait la tournée : « github » (GitHub Actions) ou « windows » (Planificateur de tâches), d'après
    publier/linkedin/pilote.txt, commité. L'autre côté ne fait rien : jamais deux tournées concurrentes, donc
    jamais deux posts, même si la tâche Windows reste active (décision du 2026-11-08)."""
    fichier = depot.racine / "publier" / "linkedin" / "pilote.txt"
    return fichier.read_text(encoding="utf-8").strip().lower() if fichier.is_file() else "windows"


def tournee_ici(depot: Depot) -> bool:
    return (pilote(depot) == "github") == sur_github()


def dossier_journal(depot: Depot) -> Path:
    return depot.racine / "sortie" / "linkedin"


def noter(depot: Depot, message: str, maintenant: dt.datetime) -> None:
    dossier_journal(depot).mkdir(parents=True, exist_ok=True)
    with (dossier_journal(depot) / "journal.log").open("a", encoding="utf-8") as f:
        f.write(f"{maintenant.isoformat(timespec='seconds')} {message}\n")


class Verrou:
    """Une seule tournée à la fois ; un verrou de plus de 30 minutes est considéré comme abandonné."""

    def __init__(self, depot: Depot, maintenant: dt.datetime):
        self.chemin = dossier_journal(depot) / "verrou"
        self.maintenant = maintenant

    def __enter__(self) -> "Verrou":
        self.chemin.parent.mkdir(parents=True, exist_ok=True)
        if self.chemin.is_file():
            pose = dt.datetime.fromisoformat(self.chemin.read_text(encoding="utf-8").strip())
            if self.maintenant - pose < VERROU_PERIME:
                raise ErreurLinkedIn("une tournée est déjà en cours")
        self.chemin.write_text(self.maintenant.isoformat(), encoding="utf-8")
        return self

    def __exit__(self, *exc) -> None:
        self.chemin.unlink(missing_ok=True)


def prevenir_github(message: str) -> None:
    """Sur GitHub Actions : une ligne par alerte dans le fichier THETA_ALERTES ; le workflow en fait des issues."""
    chemin = os.environ.get("THETA_ALERTES")
    if chemin:
        with open(chemin, "a", encoding="utf-8") as f:
            f.write(" ".join(message.split()) + "\n")
    print(f"::warning::{message}")


def prevenir(message: str) -> None:
    (prevenir_github if sur_github() else prevenir_windows)(message)


def prevenir_windows(message: str) -> None:
    """Message à la session Windows ouverte (msg.exe) ; sans effet s'il n'est pas disponible."""
    try:
        subprocess.run(["msg", os.environ.get("USERNAME", "*"), f"θ Théta · LinkedIn : {message}"],
                       check=False, timeout=10, capture_output=True)
    except (OSError, subprocess.SubprocessError):
        pass


# --- Planificateur de tâches -------------------------------------------------------------------------------

NOM_TACHE = "Theta LinkedIn"


def script_planification(depot: Depot, pythonw: Path) -> str:
    """PowerShell : une tâche toutes les 5 minutes, sans fenêtre, rattrapée au réveil du PC."""
    def ps(s: str) -> str:
        return "'" + s.replace("'", "''") + "'"

    return "\n".join([
        f"$action = New-ScheduledTaskAction -Execute {ps(str(pythonw))} "
        f"-Argument {ps('-m serie --racine \"' + str(depot.racine) + '\" linkedin tourner')} "
        f"-WorkingDirectory {ps(str(depot.racine))}",
        "$declencheur = New-ScheduledTaskTrigger -Daily -At 00:00",
        "$declencheur.Repetition = (New-ScheduledTaskTrigger -Once -At 00:00 "
        "-RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration (New-TimeSpan -Hours 23 -Minutes 55)).Repetition",
        "$reglages = New-ScheduledTaskSettingsSet -StartWhenAvailable -WakeToRun -MultipleInstances IgnoreNew "
        "-ExecutionTimeLimit (New-TimeSpan -Minutes 20) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries",
        f"Register-ScheduledTask -TaskName {ps(NOM_TACHE)} -Action $action -Trigger $declencheur -Settings $reglages "
        "-Description 'Série Théta : publie sur LinkedIn le post dû (serie linkedin tourner).' -Force | Out-Null",
        f"Get-ScheduledTask -TaskName {ps(NOM_TACHE)} | Select-Object TaskName, State",
    ])


# --- Ligne de commande (serie linkedin …) -------------------------------------------------------------------

def _maintenant() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def expiration(coffre: Coffre) -> dt.datetime | None:
    brut = coffre.lire("jeton")
    return dt.datetime.fromisoformat(json.loads(brut)["expire_le"]) if brut else None


def _client(coffre: Coffre) -> Client:
    jeton = jeton_valide(coffre, _maintenant())
    return Client(jeton["access_token"], jeton["personne"])


def executer(args, depot: Depot) -> int:
    import getpass
    import webbrowser

    coffre = Coffre()
    action = args.action
    try:
        if action == "connecter":
            jeton = connecter(coffre, lambda q, cache: getpass.getpass(q) if cache else input(q), webbrowser.open,
                              recevoir_redirection)
            print(f"Connecté : {jeton['nom']} ({jeton['personne']}), jeton valable jusqu'au {jeton['expire_le'][:10]}")
            return 0
        if action == "etat":
            jeton = jeton_valide(coffre, _maintenant())
            reste = dt.datetime.fromisoformat(jeton["expire_le"]) - _maintenant()
            print(f"Connecté : {jeton['nom']} ({jeton['personne']}) ; jeton valable encore {reste.days} jours "
                  f"(jusqu'au {jeton['expire_le'][:10]})")
            du = post_du(depot, _maintenant())
            print("Post dû maintenant : " + (f"{du[0]} {du[1]}, prévu le {du[2].isoformat()}" if du else "aucun"))
            return 0
        if action in ("apercu", "publier"):
            envoi = preparer_post(depot, args.numero, _maintenant(), args.hors_calendrier)
            print(f"{envoi.cle} · prévu : {envoi.prevu.isoformat() if envoi.prevu else 'aucune date'}")
            print(f"Document : {envoi.pdf.name} · titre : {envoi.titre}\n\n{envoi.texte}\n\nPremier commentaire :\n{envoi.commentaire}\n")
            for r in envoi.refus:
                print(f"Refus : {r}")
            if action == "apercu" or envoi.refus:
                return 1 if envoi.refus else 0
            if not args.oui:
                print("Rien n'est envoyé sans --oui.")
                return 1
            trace = envoyer(depot, envoi, _client(coffre), _maintenant())
            noter(depot, f"{envoi.cle} publié à la main : {trace['lien']}", _maintenant())
            print(f"Publié : {trace['lien']} ; premier commentaire : {trace.get('premier_commentaire', '—')}")
            return 0
        if action == "essai":
            client = _client(coffre)
            pdf = sorted((depot.racine / "publier" / f"{args.numero:02d}").glob("*.pdf"))[0]
            document = client.envoyer_document(pdf)
            print(f"PDF accepté par LinkedIn : {document} (aucun post créé)")
            if args.poster:
                post = client.creer_post("Test technique de publication automatique, supprimé aussitôt.", document,
                                         "Test", visibilite="CONNECTIONS")
                print(f"Post de test créé (relations seulement) : https://www.linkedin.com/feed/update/{post}/")
                try:
                    print(f"Commentaire de test : {client.commenter(post, 'Test du premier commentaire.')}")
                except ErreurLinkedIn as exc:
                    print(f"Commentaire refusé : {exc}")
                client.supprimer_post(post)
                print("Post de test supprimé.")
            return 0
        if action == "tourner":
            if not tournee_ici(depot):
                print(f"Tournée confiée à « {pilote(depot)} » (publier/linkedin/pilote.txt) : rien n'est fait ici.")
                return 0
            maintenant = _maintenant()
            with Verrou(depot, maintenant):
                message = tourner(depot, lambda: _client(coffre), maintenant, prevenir, expiration(coffre))
            if message != "rien à publier":
                noter(depot, message, maintenant)
            print(message)
            return 0
        if action == "planifier":
            if args.retirer:
                script = f"Unregister-ScheduledTask -TaskName '{NOM_TACHE}' -Confirm:$false"
            else:
                script = script_planification(depot, depot.racine / ".venv" / "Scripts" / "pythonw.exe")
            r = subprocess.run(["powershell", "-NoProfile", "-Command", script], capture_output=True, text=True)
            print(r.stdout.strip() or r.stderr.strip())
            return r.returncode
    except ErreurLinkedIn as exc:
        if action == "tourner":
            noter(depot, f"erreur : {exc}", _maintenant())
            prevenir(str(exc))
        print(f"Erreur : {exc}")
        return 1
    return 2
