"""serie decisions : rassemble dans sortie/decisions.md les décisions D des rapports de relecture.

Les décisions dorment dans sortie/NN/relecture.md : ce fichier les met sur une seule page, épisode par épisode, avec
le constat et l'option recommandée du relecteur. Le rapport reste la référence (sources, corrections rédigées).
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from serie.depot import Depot
from serie.reprise import ecrire_atomique, lire_etat

TITRE = re.compile(r"^### (D\d+) · (.+)$", re.M)


@dataclass(frozen=True)
class Decision:
    episode: str
    code: str
    titre: str
    constat: str
    recommandation: str


def _champ(bloc: str, nom: str) -> str:
    m = re.search(rf"^- \*\*{nom}\*\* : (.+)$", bloc, re.M)
    return m.group(1).strip() if m else ""


def lire_decisions(rapport: Path, episode: str) -> list[Decision]:
    texte = rapport.read_text(encoding="utf-8")
    titres = list(TITRE.finditer(texte))
    decisions = []
    for i, t in enumerate(titres):
        fin = titres[i + 1].start() if i + 1 < len(titres) else len(texte)
        bloc = texte[t.end():fin]
        decisions.append(Decision(episode, t.group(1), t.group(2).strip(), _champ(bloc, "Constat"),
                                  _champ(bloc, "Option recommandée")))
    return decisions


def rassembler(depot: Depot) -> tuple[Path, list[Decision]]:
    """Écrit sortie/decisions.md et renvoie son chemin et les décisions trouvées."""
    sortie = depot.racine / "sortie"
    statuts = lire_etat(depot)["episodes"]
    decisions = [d for rapport in sorted(sortie.glob("[0-9][0-9]/relecture.md"))
                 for d in lire_decisions(rapport, rapport.parent.name)]
    lignes = ["# Décisions à trancher", "",
              "Rassemblées par `serie decisions` depuis les rapports de relecture ; la source et les corrections "
              "rédigées sont dans `sortie/NN/relecture.md`. Une décision peut déjà être caduque si le texte a changé "
              "depuis le rapport.", "", f"{len(decisions)} décisions."]
    for episode in sorted({d.episode for d in decisions}):
        lignes += ["", f"## Nº {episode} ({statuts.get(episode, {}).get('statut', '?')})"]
        for d in (x for x in decisions if x.episode == episode):
            lignes += ["", f"### {d.code} · {d.titre}", ""]
            if d.constat:
                lignes.append(f"- Constat : {d.constat}")
            if d.recommandation:
                lignes.append(f"- Option recommandée : {d.recommandation}")
    chemin = sortie / "decisions.md"
    ecrire_atomique(chemin, "\n".join(lignes) + "\n")
    return chemin, decisions
