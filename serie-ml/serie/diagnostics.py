"""Résultats des contrôles, classés selon charte/regles-redaction.md."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class Niveau(str, Enum):
    ERREUR = "erreur bloquante"
    AVERTISSEMENT = "avertissement"
    DESACCORD = "désaccord scientifique"


@dataclass(frozen=True)
class Diagnostic:
    niveau: Niveau
    lieu: str
    message: str

    def __str__(self) -> str:
        return f"[{self.niveau.value}] {self.lieu} : {self.message}"


def erreur(lieu: str, message: str) -> Diagnostic:
    return Diagnostic(Niveau.ERREUR, lieu, message)


def avertissement(lieu: str, message: str) -> Diagnostic:
    return Diagnostic(Niveau.AVERTISSEMENT, lieu, message)


def bloquants(diagnostics: list[Diagnostic]) -> list[Diagnostic]:
    return [d for d in diagnostics if d.niveau is Niveau.ERREUR]
