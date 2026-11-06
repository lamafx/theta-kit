"""Notebooks : découpage des sources, et notebooks exécutés sans erreur (la construction demande numpy et nbclient,
absents de cet environnement : ces tests lisent les fichiers produits)."""

import importlib.util
import json
from pathlib import Path

import pytest

ICI = Path(__file__).resolve().parents[1] / "notebooks"
SOURCES = sorted((ICI / "sources").glob("*.py"))

spec = importlib.util.spec_from_file_location("construire", ICI / "construire.py")
construire = importlib.util.module_from_spec(spec)
spec.loader.exec_module(construire)


def test_decoupage():
    source = "# en-tête ignoré\n\n# %% [markdown]\n# # Titre\n#\n# Texte\n\n# %%\nx = 1\n\n# %%\n\n"
    assert construire.decouper(source) == [("markdown", "# Titre\n\nTexte"), ("code", "x = 1")]


@pytest.mark.parametrize("source", SOURCES, ids=lambda p: p.stem)
def test_notebook_execute_et_a_jour(source):
    cible = source.with_name(source.stem + ".ipynb").parent.parent / (source.stem + ".ipynb")
    assert cible.is_file(), "notebook à construire : python notebooks/construire.py"
    cellules = json.loads(cible.read_text(encoding="utf-8"))["cells"]
    attendues = construire.decouper(source.read_text(encoding="utf-8"))
    assert [("".join(c["source"])) for c in cellules] == [texte for _, texte in attendues], "source modifiée après construction"
    code = [c for c in cellules if c["cell_type"] == "code"]
    assert code and all(c["execution_count"] for c in code)
    assert not [s for c in code for s in c["outputs"] if s["output_type"] == "error"]


@pytest.mark.parametrize("source", SOURCES, ids=lambda p: p.stem)
def test_regles_de_redaction(source):
    texte = source.read_text(encoding="utf-8")
    assert "—" not in texte and "assert" in texte
    assert "# %% [markdown]" in texte and "**Sources**" in texte
