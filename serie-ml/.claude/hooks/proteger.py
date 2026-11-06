"""PreToolUse : refuse toute écriture dans le rendu et ses références, hors session de design (11.4, 11.6).

Dossiers verrouillés : gabarits/, bibliotheque/, charte/, design/, tests/reference/. Une session de design,
lancée exprès par l'utilisateur, les déverrouille : fichier .session-design à la racine du dépôt.

Outils Write, Edit, MultiEdit, NotebookEdit : le chemin du fichier est contrôlé. Bash et PowerShell : la
commande est refusée si elle nomme un dossier verrouillé avec une opération d'écriture courante (redirection,
cp, mv, rm, sed -i, tee, Set-Content, Copy-Item…). Un script qui écrit lui-même un fichier n'est pas détecté
(A36) : la règle de CLAUDE.md reste la première protection.
"""

from __future__ import annotations

import re
import sys

from _commun import RACINE, chemin_absolu, lire_entree, refuser, relatif

VERROUILLES = ("gabarits", "bibliotheque", "charte", "design", "tests/reference")
ECRITURE = re.compile(
    r"(?<![<2&])>{1,2}(?!&)|\b(cp|mv|rm|rmdir|touch|mkdir|tee|truncate|install|dd)\b|\bsed\s+(-\w+\s+)*-i|"
    r"\b(Set-Content|Add-Content|Out-File|Copy-Item|Move-Item|Remove-Item|Rename-Item|New-Item|Clear-Content)\b|"
    r"\bgit\s+(checkout|restore|rm|mv|clean|reset)\b",
    re.IGNORECASE,
)
MOTIF_DOSSIERS = re.compile(
    r"(?<![\w.-])(" + "|".join(re.escape(d).replace("/", r"[/\\]") for d in VERROUILLES) + r")(?=[/\\]|\s|['\"]|$)"
)


def verrouille(rel: str | None) -> str | None:
    if rel is None:
        return None
    return next((d for d in VERROUILLES if rel == d or rel.startswith(d + "/")), None)


def main() -> None:
    entree = lire_entree()
    if (RACINE / ".session-design").exists():
        return
    outil = entree.get("tool_name", "")
    params = entree.get("tool_input") or {}
    if outil in ("Write", "Edit", "MultiEdit", "NotebookEdit"):
        chemin = params.get("file_path") or params.get("notebook_path")
        dossier = verrouille(relatif(chemin_absolu(entree, chemin))) if chemin else None
        if dossier:
            refuser(f"Écriture refusée dans {dossier}/ : ce dossier ne change que pendant une session de design "
                    "lancée par l'utilisateur (CLAUDE.md, « Principe absolu »). Si le travail en cours en a "
                    "besoin, note-le dans AMBIGUITES.md au lieu de contourner ce refus.")
    elif outil in ("Bash", "PowerShell"):
        commande = params.get("command") or ""
        m = MOTIF_DOSSIERS.search(commande)
        if m and ECRITURE.search(commande):
            refuser(f"Commande refusée : elle semble écrire dans {m.group(1)}/, verrouillé hors session de design. "
                    "Si le travail en cours en a besoin, note-le dans AMBIGUITES.md.")


if __name__ == "__main__":
    main()
    sys.exit(0)
