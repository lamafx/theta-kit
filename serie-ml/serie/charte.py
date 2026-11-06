"""Lecture de charte/charte.yaml et polices locales de design/fonts/."""

from __future__ import annotations

import re
from dataclasses import dataclass
from functools import cached_property
from pathlib import Path
from typing import Any

from serie.depot import Depot, lire_yaml

FAMILLES_POLICES = {"geist-sans": "Geist", "geist-mono": "Geist Mono", "stix-two-text": "STIX Two Text"}


@dataclass
class Charte:
    donnees: dict[str, Any]
    dossier_polices: Path

    @classmethod
    def charger(cls, depot: Depot) -> "Charte":
        return cls(lire_yaml(depot.charte / "charte.yaml"), depot.racine / "design" / "fonts")

    @property
    def claire(self) -> dict[str, str]:
        return self.donnees["couleurs"]["claire"]

    @property
    def couverture(self) -> dict[str, str]:
        return self.donnees["couleurs"]["couverture"]

    @property
    def fin(self) -> dict[str, str]:
        return self.donnees["couleurs"]["fin"]

    @property
    def complements(self) -> dict[str, str]:
        return self.donnees["couleurs"]["complements"]

    @property
    def alerte(self) -> str:
        return self.donnees["couleurs"]["alerte"]

    @property
    def tailles(self) -> dict[str, int]:
        return self.donnees["tailles_px"]

    @property
    def format(self) -> dict[str, Any]:
        return self.donnees["format"]

    @property
    def signature(self) -> str:
        return self.donnees["signature"]

    @cached_property
    def polices_css(self) -> str:
        """@font-face des fichiers locaux, jamais chargés depuis Internet.

        Les sous-ensembles d'une même police partagent les mêmes descripteurs : Chromium les essaie
        du dernier déclaré au premier et passe au suivant si un glyphe manque. Le sous-ensemble
        latin, le plus employé, est donc déclaré en dernier.
        """
        regles = []
        declarees: list[tuple[str, str, str]] = []
        fichiers = sorted(self.dossier_polices.glob("*.woff2"), key=lambda f: ("-latin-" in f.name, f.name))
        for f in fichiers:
            m = re.fullmatch(r"(geist-sans|geist-mono|stix-two-text)-.+-(\d00)-(normal|italic)", f.stem)
            if m is None:
                continue
            famille = FAMILLES_POLICES[m[1]]
            regles.append(
                f"@font-face{{font-family:'{famille}';src:url('{f.as_uri()}') format('woff2');"
                f"font-weight:{m[2]};font-style:{m[3]};font-display:block}}"
            )
            if (famille, m[2], m[3]) not in declarees:
                declarees.append((famille, m[2], m[3]))
        if not regles:
            raise FileNotFoundError(f"aucune police dans {self.dossier_polices}")
        return "\n".join(regles + self._complements(declarees))

    def _complements(self, declarees: list[tuple[str, str, str]]) -> list[str]:
        """Police de complément (charte.yaml, polices.complement) : une règle par famille, poids et style.

        Même famille, même poids, même style que la règle complétée, jamais une plage de poids (les
        métriques changeraient). Déclarée après les autres : Chromium essaie d'abord la dernière règle
        dont la plage couvre le caractère.
        """
        regles = []
        for cle in ("complement", "grecques"):  # grecques : lettres grecques de Geist et Geist Mono (A29)
            complement = self.donnees["polices"].get(cle)
            if not complement:
                continue
            fichier = self.dossier_polices / complement["fichier"]
            if not fichier.exists():
                raise FileNotFoundError(f"police de complément absente : {fichier}")
            familles = complement.get("familles")
            regles += [
                f"@font-face{{font-family:'{famille}';src:url('{fichier.as_uri()}') format('woff2');"
                f"font-weight:{poids};font-style:{style};unicode-range:{complement['unicode_range']};font-display:block}}"
                for famille, poids, style in declarees if familles is None or famille in familles
            ]
        return regles
