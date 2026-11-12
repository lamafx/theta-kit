"""Contrôle du post du jour, lancé par le réveil (.github/workflows/linkedin-reveil.yml). Ne publie rien.

    python outils/controle-post.py avant 2026-11-12T08:30:00Z   # le post de cette heure passera-t-il les garde-fous ?
    python outils/controle-post.py apres 2026-11-12T08:30:00Z   # est-il publié ?

Chaque problème est une ligne sur la sortie standard (et dans THETA_ALERTES s'il est défini) : le workflow en fait
une issue GitHub (e-mail) et une notification de l'admin. Le 2026-11-12, le Nº 02, réécrit dans la nuit et resté
« généré », n'est pas parti, sans autre alerte qu'une issue au moment du refus (décision de l'auteur : être prévenu
avant l'heure, et après si le post n'est pas fait).
"""

from __future__ import annotations

import datetime as dt
import os
import sys
from pathlib import Path
from zoneinfo import ZoneInfo

RACINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RACINE))

from serie.calendrier import dates_prevues  # noqa: E402
from serie.depot import Depot  # noqa: E402
from serie.etat import charger_calendrier  # noqa: E402
from serie.reprise import lire_etat  # noqa: E402
from serie.linkedin import preparer_post  # noqa: E402


def heure(q: dt.datetime) -> str:
    return f"{q:%d/%m} à {q.hour} h {q:%M}"


def posts_a(depot: Depot, a: dt.datetime) -> list[tuple[str, str, dt.datetime]]:
    """(clé, nom, heure prévue) des posts prévus à cette heure, à une minute près."""
    calendrier = charger_calendrier(depot)
    zone = ZoneInfo(calendrier.fuseau)
    trouves = []
    for (genre, n), quand in dates_prevues(calendrier).items():
        quand = quand.replace(tzinfo=zone)
        if abs(quand - a) <= dt.timedelta(minutes=1):
            cle, nom = (f"{n:02d}", f"Nº {n:02d}") if genre == "episode" else (f"bilan-{n}", f"Bilan {n}")
            trouves.append((cle, nom, quand))
    return trouves


def statut(depot: Depot, cle: str) -> str:
    brut = lire_etat(depot)
    e = brut["bilans"][int(cle.removeprefix("bilan-"))] if cle.startswith("bilan-") else brut["episodes"][cle]
    return e["statut"]


def controler(moment: str, a: dt.datetime) -> list[str]:
    depot = Depot(RACINE)
    alertes = []
    for cle, nom, quand in posts_a(depot, a):
        s = statut(depot, cle)
        if s in ("publie", "mesure"):
            continue
        refus = preparer_post(depot, cle, quand + dt.timedelta(minutes=1)).refus
        if moment == "avant":
            if refus:
                alertes.append(f"{nom} ne partira pas le {heure(quand)} : " + " ; ".join(refus))
        else:
            cause = " ; ".join(refus) if refus else "la tournée n'a pas publié (lancez « Tourner maintenant » dans l'admin)"
            alertes.append(f"{nom} prévu le {heure(quand)} n'est pas publié : {cause}. "
                           "Il peut encore partir tout seul pendant 2 heures, ensuite « Publier ce post maintenant » dans l'admin")
    return alertes


def main() -> int:
    if len(sys.argv) != 3 or sys.argv[1] not in ("avant", "apres"):
        print(__doc__)
        return 2
    a = dt.datetime.fromisoformat(sys.argv[2].replace("Z", "+00:00"))
    alertes = controler(sys.argv[1], a)
    for m in alertes:
        print(m)
    if alertes and os.environ.get("THETA_ALERTES"):
        with open(os.environ["THETA_ALERTES"], "a", encoding="utf-8") as f:
            f.write("".join(m + "\n" for m in alertes))
    if not alertes:
        print("rien à signaler")
    return 0


if __name__ == "__main__":
    sys.exit(main())
