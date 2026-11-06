"""Accès aux fichiers du dépôt : racine, lecture YAML, chemins connus."""

from __future__ import annotations

import os
import re
import unicodedata
from pathlib import Path
from typing import Any

import yaml

RACINE_PAR_DEFAUT = Path(__file__).resolve().parents[1]


class Depot:
    """Chemins du dépôt, à partir d'une racine (le dossier qui contient etat.yaml)."""

    def __init__(self, racine: Path | str | None = None) -> None:
        if racine is None:
            racine = os.environ.get("SERIE_RACINE") or RACINE_PAR_DEFAUT
        self.racine = Path(racine).resolve()

    @property
    def episodes(self) -> Path:
        return self.racine / "banque" / "episodes"

    @property
    def charte(self) -> Path:
        return self.racine / "charte"

    @property
    def etat(self) -> Path:
        return self.racine / "etat.yaml"

    @property
    def calendrier(self) -> Path:
        return self.racine / "calendrier.yaml"

    @property
    def provenance(self) -> Path:
        return self.racine / "provenance.yaml"

    @property
    def glossaire(self) -> Path:
        return self.charte / "glossaire.yaml"

    @property
    def references_png(self) -> Path:
        return self.racine / "tests" / "reference"

    def fichiers_fiches(self) -> list[Path]:
        return sorted(self.episodes.glob("*.yaml"))


def lire_yaml(chemin: Path) -> Any:
    with open(chemin, encoding="utf-8") as f:
        return yaml.safe_load(f)


def cle_episode(cle: int | str) -> str:
    """Normalise un numéro d'épisode en clé à deux chiffres : 8, '8', '08' → '08'."""
    return f"{int(cle):02d}"


def slug(texte: str) -> str:
    """Nom de fichier sans caractère spécial : « Qu'est-ce que le ML ? » → qu-est-ce-que-le-ml."""
    ascii_ = unicodedata.normalize("NFKD", texte).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", ascii_.lower()).strip("-")
