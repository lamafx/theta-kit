"""Jalon 4 : hooks de .claude/settings.json (protection, vérification après écriture, mise à jour de l'état)."""

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest
import yaml

from serie.depot import lire_yaml
from rendus import CONTENU_08

HOOKS = Path(__file__).resolve().parents[1] / ".claude" / "hooks"


def lancer(hook: str, entree: dict, racine: Path) -> subprocess.CompletedProcess:
    env = {**os.environ, "SERIE_RACINE": str(racine)}
    return subprocess.run([sys.executable, str(HOOKS / hook)], input=json.dumps(entree), capture_output=True,
                          text=True, encoding="utf-8", env=env, cwd=racine)


def test_settings_declare_les_trois_hooks(depot):
    reglages = json.loads((depot.racine / ".claude" / "settings.json").read_text(encoding="utf-8"))["hooks"]
    commandes = {evt: " ".join(h["command"] for bloc in blocs for h in bloc["hooks"]) for evt, blocs in reglages.items()}
    assert "proteger.py" in commandes["PreToolUse"] and "verifier_contenu.py" in commandes["PostToolUse"]
    assert "maj_etat.py" in commandes["Stop"] and "rappel_session.py" in commandes["SessionStart"]
    assert all((HOOKS / n).exists() for n in ("proteger.py", "verifier_contenu.py", "maj_etat.py", "rappel_session.py"))


# --- Protection --------------------------------------------------------------------------------------------

@pytest.fixture
def hors_session(tmp_path) -> Path:
    """Une racine sans .session-design : la protection ne dépend pas d'une session ouverte dans le dépôt."""
    return tmp_path


@pytest.mark.parametrize("chemin", ["gabarits/fin.html.j2", "bibliotheque/nuage.py", "charte/charte.yaml",
                                    "design/canevas-gabarits/08-Fin.dc.html", "tests/reference/08-Fin.png"])
def test_ecriture_refusee_dans_les_dossiers_verrouilles(hors_session, chemin):
    for outil in ("Write", "Edit"):
        r = lancer("proteger.py", {"tool_name": outil, "tool_input": {"file_path": str(hors_session / chemin)}},
                   hors_session)
        assert r.returncode == 2 and "session de design" in r.stderr and "AMBIGUITES.md" in r.stderr


@pytest.mark.parametrize("chemin", ["contenu/08.yaml", "sources/08/extraits.yaml", "AMBIGUITES.md",
                                    "tests/test_hooks.py", "charte-bis.md"])
def test_ecriture_permise_ailleurs(depot, chemin):
    r = lancer("proteger.py", {"tool_name": "Write", "tool_input": {"file_path": chemin}, "cwd": str(depot.racine)},
               depot.racine)
    assert r.returncode == 0, r.stderr


@pytest.mark.parametrize("commande, refusee", [
    ("sed -i 's/a/b/' charte/charte.yaml", True),
    ("cp /tmp/x.png tests/reference/08-Fin.png", True),
    ("echo x > gabarits/style.css.j2", True),
    ("Set-Content -Path bibliotheque\\nuage.py -Value x", True),
    ("git checkout -- design/canevas-gabarits", True),
    ("cat charte/charte.yaml", False),
    ("grep -n accent gabarits/style.css.j2 2>/dev/null", False),
    ("git commit -m 'maj de charte.yaml'", False),
    ("python -m pytest tests/test_rendu.py > sortie.txt", False),
])
def test_commandes_shell(hors_session, commande, refusee):
    for outil in ("Bash", "PowerShell"):
        r = lancer("proteger.py", {"tool_name": outil, "tool_input": {"command": commande}}, hors_session)
        assert (r.returncode == 2) is refusee, (outil, commande, r.stderr)


def test_session_de_design_deverrouille(tmp_path):
    (tmp_path / "gabarits").mkdir()
    entree = {"tool_name": "Write", "tool_input": {"file_path": str(tmp_path / "gabarits" / "fin.html.j2")}}
    assert lancer("proteger.py", entree, tmp_path).returncode == 2
    (tmp_path / ".session-design").write_text("", encoding="utf-8")
    assert lancer("proteger.py", entree, tmp_path).returncode == 0


# --- Vérification après écriture d'un contenu ----------------------------------------------------------------

@pytest.fixture
def depot_leger(depot, tmp_path) -> Path:
    """Copie du dépôt sans tests ni sorties : de quoi lancer `serie verifier` sur un contenu écrit."""
    for d in ("banque", "charte", "gabarits", "bibliotheque", "design/fonts", "calculs"):
        shutil.copytree(depot.racine / d, tmp_path / d, ignore=shutil.ignore_patterns("__pycache__"))
    for f in ("calendrier.yaml", "etat.yaml", "provenance.yaml"):
        shutil.copy(depot.racine / f, tmp_path / f)
    (tmp_path / "contenu").mkdir()
    return tmp_path


def test_contenu_fautif_renvoye_a_l_agent(depot_leger):
    brut = lire_yaml(CONTENU_08)
    brut["pages"][2]["texte"] = "Tu vas voir, c'est incroyable : " + brut["pages"][2]["texte"]
    chemin = depot_leger / "contenu" / "08.yaml"
    chemin.write_text(yaml.safe_dump(brut, allow_unicode=True, sort_keys=False), encoding="utf-8")
    r = lancer("verifier_contenu.py", {"tool_name": "Write", "tool_input": {"file_path": str(chemin)}}, depot_leger)
    assert r.returncode == 2
    assert "tutoiement" in r.stderr and "superlatif" in r.stderr and "Résultat" in r.stderr
    assert (depot_leger / "sortie" / "08" / "verification.md").exists()


def test_fichiers_hors_contenu_ignores(depot_leger):
    for chemin in ("AMBIGUITES.md", "contenu/notes.txt", "sources/08/extraits.yaml"):
        r = lancer("verifier_contenu.py", {"tool_name": "Write", "tool_input": {"file_path": chemin},
                                           "cwd": str(depot_leger)}, depot_leger)
        assert r.returncode == 0 and r.stderr == ""


def test_bilan_controle_par_son_schema(depot_leger):
    chemin = depot_leger / "contenu" / "bilan-1.yaml"
    chemin.write_text("saison: 1\ncouverture: {titre: x}\n", encoding="utf-8")
    r = lancer("verifier_contenu.py", {"tool_name": "Edit", "tool_input": {"file_path": str(chemin)}}, depot_leger)
    assert r.returncode == 2 and "accroche" in r.stderr


# --- Fin de réponse ---------------------------------------------------------------------------------------------

def test_fin_de_reponse_ne_bloque_jamais(depot_leger, tmp_path_factory):
    assert lancer("maj_etat.py", {"hook_event_name": "Stop"}, depot_leger).returncode == 0
    vide = tmp_path_factory.mktemp("vide")  # dépôt illisible : le hook ne bloque pas non plus
    assert lancer("maj_etat.py", {}, vide).returncode == 0


# --- Démarrage de session ------------------------------------------------------------------------------------

def test_rappel_si_session_design_oubliee(tmp_path):
    assert lancer("rappel_session.py", {"hook_event_name": "SessionStart"}, tmp_path).stdout == ""
    (tmp_path / ".session-design").write_text("", encoding="utf-8")
    r = lancer("rappel_session.py", {"hook_event_name": "SessionStart", "source": "startup"}, tmp_path)
    sortie = json.loads(r.stdout)
    assert r.returncode == 0
    assert ".session-design est présent" in sortie["systemMessage"] and "supprimez-le" in sortie["systemMessage"]
    contexte = sortie["hookSpecificOutput"]["additionalContext"]
    assert sortie["hookSpecificOutput"]["hookEventName"] == "SessionStart" and "après la suite verte et le commit" in contexte


def test_meme_liste_de_dossiers_verrouilles_partout(depot):
    """Hook, CLAUDE.md, brief de design et rappel de démarrage nomment les mêmes dossiers."""
    sys.path.insert(0, str(HOOKS))
    try:
        from proteger import VERROUILLES
        from rappel_session import MESSAGE
    finally:
        sys.path.remove(str(HOOKS))
    assert set(VERROUILLES) == {"gabarits", "bibliotheque", "charte", "design", "tests/reference"}
    claude = (depot.racine / "CLAUDE.md").read_text(encoding="utf-8")
    regle = next(l for l in claude.splitlines() if l.startswith("- Tu ne modifies jamais"))
    brief = (depot.racine / "BRIEF-SESSION-DESIGN.md").read_text(encoding="utf-8").split("## 1.")[0]
    for d in VERROUILLES:
        assert f"`{d}/`" in regle and f"`{d}/`" in brief and f"{d}/" in MESSAGE, d
