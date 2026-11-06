"""Outils communs aux hooks de .claude/settings.json (conception/plan-automatisation.md, 11.6)."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

# Racine du dépôt : SERIE_RACINE (tests), sinon le dossier qui contient .claude/.
RACINE = Path(os.environ.get("SERIE_RACINE") or Path(__file__).resolve().parents[2]).resolve()


def lire_entree() -> dict:
    """L'événement envoyé par Claude Code sur l'entrée standard (JSON)."""
    sys.stdin.reconfigure(encoding="utf-8")
    try:
        return json.load(sys.stdin)
    except json.JSONDecodeError:
        return {}


def chemin_absolu(entree: dict, chemin: str) -> Path:
    p = Path(chemin)
    if not p.is_absolute():
        p = Path(entree.get("cwd") or os.getcwd()) / p
    return p.resolve()


def relatif(p: Path) -> str | None:
    """Chemin relatif à la racine du dépôt, en notation POSIX ; None hors du dépôt."""
    try:
        return p.relative_to(RACINE).as_posix()
    except ValueError:
        return None


def refuser(message: str) -> None:
    """Code 2 : l'outil n'est pas exécuté (PreToolUse) et le message est renvoyé à l'agent."""
    sys.stderr.reconfigure(encoding="utf-8")
    print(message, file=sys.stderr)
    sys.exit(2)
