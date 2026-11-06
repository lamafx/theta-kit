"""Construit les notebooks de la série θ Théta depuis notebooks/sources/*.py, puis les exécute.

Une source est un fichier Python découpé en cellules : `# %%` ouvre une cellule de code, `# %% [markdown]` une
cellule de texte, dont chaque ligne commence par `# `. Chaque notebook vérifie ses chiffres par des `assert` :
si un calcul s'écarte de l'épisode, l'exécution échoue et le notebook n'est pas écrit.

    python notebooks/construire.py           # tous les notebooks
    python notebooks/construire.py 08 11     # seulement ceux-là

Il faut numpy, pandas, matplotlib, scikit-learn, nbformat, nbclient et ipykernel.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ICI = Path(__file__).resolve().parent


def decouper(source: str) -> list[tuple[str, str]]:
    """[(« markdown » ou « code », contenu de la cellule), …]."""
    cellules: list[tuple[str, list[str]]] = []
    for ligne in source.splitlines():
        if ligne.startswith("# %% [markdown]"):
            cellules.append(("markdown", []))
        elif ligne.startswith("# %%"):
            cellules.append(("code", []))
        elif not cellules:
            continue  # en-tête du fichier source, avant la première cellule
        elif cellules[-1][0] == "markdown":
            cellules[-1][1].append("" if ligne == "#" else ligne.removeprefix("# "))
        else:
            cellules[-1][1].append(ligne)
    return [(genre, "\n".join(lignes).strip()) for genre, lignes in cellules if "".join(lignes).strip()]


def construire(chemin: Path) -> Path:
    import nbformat
    from nbclient import NotebookClient

    nb = nbformat.v4.new_notebook()
    nb.metadata["kernelspec"] = {"name": "python3", "display_name": "Python 3", "language": "python"}
    nb.metadata["language_info"] = {"name": "python"}
    fabrique = {"markdown": nbformat.v4.new_markdown_cell, "code": nbformat.v4.new_code_cell}
    nb.cells = [fabrique[genre](texte) for genre, texte in decouper(chemin.read_text(encoding="utf-8"))]
    NotebookClient(nb, timeout=180, kernel_name="python3", resources={"metadata": {"path": str(ICI)}}).execute()
    sortie = ICI / f"{chemin.stem}.ipynb"
    nbformat.write(nb, sortie)
    return sortie


def main(numeros: list[str]) -> None:
    """Plusieurs notebooks : un processus par notebook, car le noyau ne se relance pas sûrement sous Windows."""
    sources = sorted((ICI / "sources").glob("*.py"))
    choisies = [c for c in sources if not numeros or c.stem[:2] in numeros]
    if len(choisies) == 1:
        print(construire(choisies[0]).name)
        return
    for chemin in choisies:
        subprocess.run([sys.executable, "-W", "ignore", __file__, chemin.stem[:2]], check=True)


if __name__ == "__main__":
    main(sys.argv[1:])
