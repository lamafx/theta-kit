"""Publication automatique sur LinkedIn : garde-fous, ordre des appels à l'API, tournée planifiée, connexion.

Aucun appel réseau : le transport HTTP et le gestionnaire d'identifiants sont remplacés.
"""

import datetime as dt
import json
import shutil
import threading
import time
import urllib.error
import urllib.request
from pathlib import Path

import pytest
import yaml

from serie import linkedin as li
from serie.depot import Depot
from serie.linkedin import Client, ErreurLinkedIn, Reponse

from aide_comprehension import noter

RACINE = Path(__file__).resolve().parents[1]
UTC = dt.timezone.utc
PREVU = dt.datetime(2026, 11, 10, 8, 30, tzinfo=UTC)  # Nº 01 : mardi 10 novembre 2026, 8 h 30 à Abidjan (GMT)


@pytest.fixture
def depot(tmp_path, monkeypatch) -> Depot:
    for nom in ("etat.yaml", "calendrier.yaml"):
        shutil.copy(RACINE / nom, tmp_path / nom)
    shutil.copytree(RACINE / "publier" / "01", tmp_path / "publier" / "01")
    monkeypatch.setattr(li, "etapes_a_refaire", lambda depot, numero: [])
    copie = Depot(tmp_path)
    noter(copie, 1)  # compréhension au-dessus du seuil ; test_comprehension.py couvre le refus
    statut(copie, "01", "genere")  # indépendant du vrai état : chaque test pose lui-même « relu »
    return copie


def statut(depot: Depot, cle: str, valeur: str) -> None:
    brut = yaml.safe_load(depot.etat.read_text(encoding="utf-8"))
    brut["episodes"][cle]["statut"] = valeur
    depot.etat.write_text(yaml.safe_dump(brut, allow_unicode=True, sort_keys=False), encoding="utf-8")


class FausseAPI:
    """Répond comme LinkedIn (Documents, Posts, Comments) et garde la liste des appels."""

    def __init__(self, commentaire_refuse=False):
        self.appels: list[tuple[str, str, dict]] = []
        self.commentaire_refuse = commentaire_refuse
        self.lectures = 0

    def __call__(self, methode, url, entetes, corps):
        donnees = json.loads(corps) if corps and entetes.get("Content-Type") == "application/json" else None
        self.appels.append((methode, url, donnees))
        if url.endswith("/rest/documents?action=initializeUpload"):
            return Reponse(200, {}, json.dumps({"value": {"uploadUrl": "https://televersement.test/doc",
                                                          "document": "urn:li:document:D1"}}).encode())
        if url == "https://televersement.test/doc":
            # Sans type explicite, urllib annonce un formulaire et LinkedIn répond 400.
            assert entetes["Content-Type"] == "application/pdf"
            return Reponse(201, {}, b"")
        if "/rest/documents/" in url:
            self.lectures += 1
            return Reponse(200, {}, json.dumps({"status": "AVAILABLE" if self.lectures > 1 else "PROCESSING"}).encode())
        if url.endswith("/rest/posts"):
            return Reponse(201, {"x-restli-id": "urn:li:share:42"}, b"")
        if "/comments" in url:
            assert url.startswith(li.API + "/v2/") and "Linkedin-Version" not in entetes
            if self.commentaire_refuse:
                return Reponse(403, {}, b'{"message":"forbidden"}')
            return Reponse(201, {"x-restli-id": "7"}, b"{}")
        return Reponse(404, {}, b"")


def client(api) -> Client:
    return Client("jeton", "urn:li:person:abc", transport=api, attente=lambda s: None)


def test_texte_au_format_little():
    texte = "Samuel (1959) : 99,9 %\n\n#MachineLearning #ThetaML"
    assert li.en_little(texte) == "Samuel \\(1959\\) : 99,9 %\n\n{hashtag|\\#|MachineLearning} {hashtag|\\#|ThetaML}"
    assert li.en_little("a_b *c* [d] {e} <f> @g |h ~i \\j") == "a\\_b \\*c\\* \\[d\\] \\{e\\} \\<f\\> \\@g \\|h \\~i \\\\j"


def test_rien_ne_part_sans_relecture(depot):
    envoi = li.preparer(depot, 1, PREVU + dt.timedelta(minutes=3))
    assert any("relu" in r for r in envoi.refus)


@pytest.mark.parametrize("decalage, motif", [(-dt.timedelta(minutes=1), "trop tôt"), (li.RETARD_MAX + dt.timedelta(minutes=1), "trop tard")])
def test_heure_prevue(depot, decalage, motif):
    statut(depot, "01", "relu")
    envoi = li.preparer(depot, 1, PREVU + decalage)
    assert [r for r in envoi.refus if motif in r]


def test_publication_complete(depot):
    statut(depot, "01", "relu")
    api = FausseAPI()
    trace = li.publier_episode(depot, 1, client(api), PREVU + dt.timedelta(minutes=2))
    chemins = [(m, u.removeprefix(li.API)) for m, u, _ in api.appels]
    assert chemins[:2] == [("POST", "/rest/documents?action=initializeUpload"), ("PUT", "https://televersement.test/doc")]
    assert chemins[-2:] == [("POST", "/rest/posts"), ("POST", "/v2/socialActions/urn%3Ali%3Ashare%3A42/comments")]
    post = next(d for m, u, d in api.appels if u.endswith("/rest/posts"))
    assert post["author"] == "urn:li:person:abc" and post["content"]["media"]["id"] == "urn:li:document:D1"
    assert post["content"]["media"]["title"] == (depot.racine / "publier" / "01" / "titre.txt").read_text(encoding="utf-8").strip()
    assert post["commentary"].endswith("{hashtag|\\#|ThetaML}")
    assert trace["post"] == "urn:li:share:42" and trace["premier_commentaire"] == "7"
    etat = yaml.safe_load(depot.etat.read_text(encoding="utf-8"))["episodes"]["01"]
    assert etat["statut"] == "publie" and str(etat["publie_le"]) == "2026-11-10"
    assert (depot.racine / "publier" / "linkedin" / "01.yaml").is_file()
    with pytest.raises(ErreurLinkedIn):  # jamais deux posts pour un épisode
        li.publier_episode(depot, 1, client(FausseAPI()), PREVU + dt.timedelta(minutes=7))


def test_commentaire_refuse_ne_bloque_pas_le_post(depot):
    statut(depot, "01", "relu")
    trace = li.publier_episode(depot, 1, client(FausseAPI(commentaire_refuse=True)), PREVU)
    assert trace["premier_commentaire"].startswith("échec") and "à la main" in trace["premier_commentaire"]
    assert yaml.safe_load(depot.etat.read_text(encoding="utf-8"))["episodes"]["01"]["statut"] == "publie"


def test_tournee(depot):
    alertes = []
    fabriquer = lambda: client(FausseAPI())
    assert li.tourner(depot, fabriquer, PREVU - dt.timedelta(hours=1), alertes.append) == "rien à publier"
    for minutes in (0, 5):  # pas relu : une seule alerte pour deux tournées
        li.tourner(depot, fabriquer, PREVU + dt.timedelta(minutes=minutes), alertes.append)
    assert len(alertes) == 1 and "relu" in alertes[0]
    statut(depot, "01", "relu")
    assert li.tourner(depot, fabriquer, PREVU + dt.timedelta(minutes=10), alertes.append).startswith("Nº 01 publié")


def test_post_manque_ne_bloque_pas_les_suivants(depot):
    """Nº 01 manqué : une alerte, jamais d'envoi seul ; le Nº 02 part quand même à son heure (A65)."""
    shutil.copytree(RACINE / "publier" / "02", depot.racine / "publier" / "02")
    noter(depot, 2)
    statut(depot, "01", "relu")
    statut(depot, "02", "relu")
    alertes = []
    fabriquer = lambda: client(FausseAPI())
    tard = PREVU + li.RETARD_MAX + dt.timedelta(minutes=1)
    for minutes in (0, 5):
        assert li.tourner(depot, fabriquer, tard + dt.timedelta(minutes=minutes), alertes.append) == "rien à publier"
    assert len(alertes) == 1 and "Nº 01 manqué" in alertes[0] and "--hors-calendrier" in alertes[0]
    deuxieme = li.heure_prevue(depot, 2) + dt.timedelta(minutes=2)
    assert li.tourner(depot, fabriquer, deuxieme, alertes.append).startswith("Nº 02 publié")
    brut = yaml.safe_load(depot.etat.read_text(encoding="utf-8"))
    assert brut["episodes"]["01"]["statut"] == "relu" and brut["episodes"]["02"]["statut"] == "publie"
    assert len(alertes) == 1


def test_bilan_publie_par_la_tournee(depot):
    dossier = depot.racine / "publier" / "bilan-1"
    dossier.mkdir(parents=True)
    pdf = next((depot.racine / "publier" / "01").glob("*.pdf"))
    shutil.copy(pdf, dossier / "bilan-saison-1.pdf")
    (dossier / "titre.txt").write_text("Saison 1 · bilan\n", encoding="utf-8")
    (dossier / "texte.txt").write_text("Texte du bilan.\n\n#ThetaML\n", encoding="utf-8")
    quand = li.heure_prevue(depot, 1, "bilan") + dt.timedelta(minutes=3)
    alertes = []
    assert "statut" in li.preparer_post(depot, "bilan-1", quand).refus[0]
    brut = yaml.safe_load(depot.etat.read_text(encoding="utf-8"))
    brut["bilans"][1]["statut"] = "relu"
    depot.etat.write_text(yaml.safe_dump(brut, allow_unicode=True, sort_keys=False), encoding="utf-8")
    api = FausseAPI()
    assert li.tourner(depot, lambda: client(api), quand, alertes.append).startswith("Bilan 1 publié")
    assert not [u for _, u, _ in api.appels if "/comments" in u]  # pas de premier commentaire sur un bilan
    assert yaml.safe_load(depot.etat.read_text(encoding="utf-8"))["bilans"][1]["statut"] == "publie"
    assert li.journal_post(depot, "bilan-1").is_file()
    assert "déjà envoyé" in " ".join(li.preparer_post(depot, "bilan-1", quand).refus)


def test_alerte_avant_expiration_du_jeton(depot):
    expire = PREVU + dt.timedelta(days=60)
    alertes = []
    alerter = lambda jours: li.alerter_jeton(depot, expire, expire - dt.timedelta(days=jours), alertes.append)
    alerter(20)
    assert alertes == []
    for jours in (14, 13):  # une seule alerte par palier
        alerter(jours)
    assert len(alertes) == 1 and "serie linkedin connecter" in alertes[0]
    alerter(2)
    assert len(alertes) == 2
    li.tourner(depot, lambda: client(FausseAPI()), PREVU - dt.timedelta(hours=1), alertes.append, PREVU)
    assert len(alertes) == 3 and PREVU.date().isoformat() in alertes[2]  # la tournée appelle bien l'alerte


def test_verrou(depot):
    with li.Verrou(depot, PREVU):
        with pytest.raises(ErreurLinkedIn):
            li.Verrou(depot, PREVU + dt.timedelta(minutes=5)).__enter__()
    with li.Verrou(depot, PREVU + dt.timedelta(minutes=6)):
        pass


class FauxCoffre(li.Coffre):
    def __init__(self):
        self.valeurs = {}

    def lire(self, nom):
        return self.valeurs.get(nom)

    def ecrire(self, nom, valeur):
        self.valeurs[nom] = valeur


def test_connexion():
    coffre, ouvert = FauxCoffre(), []

    def transport(methode, url, entetes, corps):
        if url == li.JETON:
            assert b"grant_type=authorization_code" in corps and b"code=abc" in corps
            return Reponse(200, {}, b'{"access_token": "T", "expires_in": 5184000}')
        assert entetes["Authorization"] == "Bearer T"
        return Reponse(200, {}, b'{"sub": "xyz", "name": "Ladji Lama Kamagate"}')

    def recevoir(etat):
        assert f"state={etat}" in ouvert[0]
        return {"code": "abc", "state": etat}

    jeton = li.connecter(coffre, lambda q, cache: "ID" if not cache else "SECRET", ouvert.append, recevoir, transport,
                         maintenant=PREVU)
    assert jeton["personne"] == "urn:li:person:xyz" and jeton["expire_le"].startswith("2027-01-09")
    assert "scope=openid+profile+w_member_social" in ouvert[0]
    assert json.loads(coffre.valeurs["jeton"])["access_token"] == "T"
    with pytest.raises(ErreurLinkedIn):  # réponse d'autorisation falsifiée
        li.connecter(coffre, lambda q, c: "", ouvert.append, lambda e: {"code": "abc", "state": "autre"}, transport)


def test_redirection_ignore_les_requetes_parasites(monkeypatch):
    """Sur localhost seulement : icône et ancien onglet ne terminent pas l'attente, seul le bon `state` le fait."""
    monkeypatch.setattr(li, "PORT", 18765)
    resultat = {}
    attente = threading.Thread(target=lambda: resultat.update(li.recevoir_redirection("bon", delai=20)))
    attente.start()

    def lire(chemin):
        for _ in range(100):
            try:
                with urllib.request.urlopen(f"http://localhost:18765{chemin}", timeout=5) as r:
                    return r.status
            except urllib.error.HTTPError as exc:
                return exc.code
            except urllib.error.URLError:
                time.sleep(0.05)
        raise AssertionError("serveur local injoignable")

    assert lire("/favicon.ico") == 404
    assert lire("/rappel?code=vieux&state=ancien") == 404
    assert lire("/rappel?code=abc&state=bon") == 200
    attente.join(timeout=5)
    assert not attente.is_alive() and resultat == {"code": "abc", "state": "bon"}


def test_redirection_sans_reponse(monkeypatch):
    monkeypatch.setattr(li, "PORT", 18766)
    with pytest.raises(ErreurLinkedIn, match="aucune réponse"):
        li.recevoir_redirection("bon", delai=0.2)


def test_tache_planifiee_sans_fenetre(depot):
    script = li.script_planification(depot, Path("C:/venv/Scripts/pythonw.exe"))
    assert "pythonw.exe" in script and "linkedin tourner" in script and "-Minutes 5" in script
    assert "-StartWhenAvailable" in script and "-WakeToRun" in script


# --- GitHub Actions (2026-11-08) ---------------------------------------------------------------------------

def test_coffre_lit_les_secrets_github(monkeypatch):
    monkeypatch.setenv("THETA_LINKEDIN_JETON", '{"access_token": "x"}')
    assert li.Coffre().lire("jeton") == '{"access_token": "x"}'


def test_coffre_sans_secret_sur_github_ne_touche_pas_au_keyring(monkeypatch):
    monkeypatch.delenv("THETA_LINKEDIN_JETON", raising=False)
    monkeypatch.setenv("GITHUB_ACTIONS", "true")
    assert li.Coffre().lire("jeton") is None


def test_alerte_github_ecrite_dans_le_fichier(monkeypatch, tmp_path):
    fichier = tmp_path / "alertes.txt"
    monkeypatch.setenv("GITHUB_ACTIONS", "true")
    monkeypatch.setenv("THETA_ALERTES", str(fichier))
    li.prevenir("Nº 01 manqué\n(prévu le 10)")
    assert fichier.read_text(encoding="utf-8") == "Nº 01 manqué (prévu le 10)\n"


def test_pilote_une_seule_tournee(monkeypatch, tmp_path):
    from serie.depot import Depot
    depot = Depot(tmp_path)
    monkeypatch.delenv("GITHUB_ACTIONS", raising=False)
    assert li.pilote(depot) == "windows" and li.tournee_ici(depot)
    (tmp_path / "publier" / "linkedin").mkdir(parents=True)
    (tmp_path / "publier" / "linkedin" / "pilote.txt").write_text("github\n", encoding="utf-8")
    assert not li.tournee_ici(depot)  # la tâche Windows ne publie plus
    monkeypatch.setenv("GITHUB_ACTIONS", "true")
    assert li.tournee_ici(depot)


class FausseAPIStats:
    """memberCreatorPostAnalytics : un nombre par type de chiffre ; 403 si la portée manque."""

    def __init__(self, refuse=False):
        self.refuse = refuse
        self.urls: list[str] = []

    def __call__(self, methode, url, entetes, corps):
        self.urls.append(url)
        if self.refuse:
            return Reponse(403, {}, b'{"message":"Not enough permissions"}')
        valeurs = {"IMPRESSION": 900, "MEMBERS_REACHED": 500, "REACTION": 40, "COMMENT": 6, "RESHARE": 2}
        type_ = url.split("queryType=")[1].split("&")[0]
        return Reponse(200, {}, json.dumps({"elements": [{"count": valeurs[type_], "metricType": {}}]}).encode())


def poser_trace(depot: Depot, publie_a: str) -> None:
    (depot.racine / "publier" / "linkedin").mkdir(parents=True, exist_ok=True)
    (depot.racine / "publier" / "linkedin" / "01.yaml").write_text(
        f"post: urn:li:ugcPost:7525841858154053633\nlien: https://www.linkedin.com/feed/update/x/\npublie_a: '{publie_a}'\n",
        encoding="utf-8")


def test_releve_des_statistiques(depot):
    statut(depot, "01", "relu")
    statut(depot, "01", "publie")
    poser_trace(depot, "2026-11-10T08:30:00+00:00")
    api = FausseAPIStats()
    messages = li.relever_stats(depot, client(api), dt.datetime(2026, 11, 12, 7, 0, tzinfo=UTC))
    assert messages == ["01 : 900 impressions à 2 jour(s) ; h48 enregistré"]
    assert "entity=(ugcPost:urn%3Ali%3AugcPost%3A7525841858154053633)" in api.urls[0] and "aggregation=TOTAL" in api.urls[0]
    releve = yaml.safe_load((depot.racine / "mesures" / "linkedin" / "7525841858154053633.yaml").read_text(encoding="utf-8"))
    assert releve["episode"] == "01" and releve["releves"][0]["chiffres"]["membres_atteints"] == 500
    mesures = yaml.safe_load((depot.racine / "mesures" / "01.yaml").read_text(encoding="utf-8"))
    assert mesures["h48"] == {"impressions": 900, "reactions": 40}
    # Sept jours après : j7, et l'épisode passe à « mesuré » ; le relevé du jour remplace celui du même jour.
    li.relever_stats(depot, client(FausseAPIStats()), dt.datetime(2026, 11, 17, 7, 0, tzinfo=UTC))
    li.relever_stats(depot, client(FausseAPIStats()), dt.datetime(2026, 11, 17, 9, 0, tzinfo=UTC))
    releve = yaml.safe_load((depot.racine / "mesures" / "linkedin" / "7525841858154053633.yaml").read_text(encoding="utf-8"))
    assert [r["releve_le"] for r in releve["releves"]] == ["2026-11-12", "2026-11-17"]
    assert yaml.safe_load(depot.etat.read_text(encoding="utf-8"))["episodes"]["01"]["statut"] == "mesure"


def test_statistiques_sans_permission(depot):
    poser_trace(depot, "2026-11-10T08:30:00+00:00")
    with pytest.raises(ErreurLinkedIn, match="r_member_postAnalytics"):
        li.relever_stats(depot, client(FausseAPIStats(refuse=True)), dt.datetime(2026, 11, 12, 7, 0, tzinfo=UTC))
