"""Écrit une note de compréhension (sortie/NN/comprehension.yaml) pour les tests qui vont jusqu'à la publication."""

from __future__ import annotations

import yaml

from serie.comprehension import CRITERES, chemin
from serie.depot import Depot


def noter(depot: Depot, numero: int, note: float = 9.0, **notes_par_partie: float) -> None:
    brut = {"episode": numero, "lecteur": "débutant (test)"}
    for partie, criteres in CRITERES.items():
        n = notes_par_partie.get(partie, note)
        brut[partie] = {"criteres": {c: {"note": n, "raison": "test"} for c in criteres}, "blocages": []}
    f = chemin(depot, numero)
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(yaml.safe_dump(brut, allow_unicode=True, sort_keys=False), encoding="utf-8")
