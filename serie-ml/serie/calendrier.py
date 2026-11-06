"""Dates de publication (charte/decisions-automatisation.md, 9.7) calculées à partir de calendrier.yaml.

Chaque saison publie ses épisodes dans l'ordre, puis son bilan, sur les créneaux des semaines impaires
(3 posts) et paires (2 posts), en commençant par une semaine impaire (A32). La saison 1 commence au premier
créneau à partir de `date_lancement` ; chaque saison suivante, après `pause_entre_saisons_semaines` semaines
sans post. Heures d'Abidjan (GMT), sans changement d'heure.
"""

from __future__ import annotations

import datetime as dt

from serie.schemas import Calendrier

JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre",
        "novembre", "décembre"]

Post = tuple[str, int]  # ("episode", 8) ou ("bilan", 1)


def posts(calendrier: Calendrier) -> list[list[Post]]:
    """Les posts de chaque saison, dans l'ordre de publication."""
    sortie = []
    for s in sorted(calendrier.saisons):
        debut, fin = calendrier.saisons[s].episodes
        saison: list[Post] = [("episode", n) for n in range(debut, fin + 1)]
        if calendrier.saisons[s].bilan:
            saison.append(("bilan", s))
        sortie.append(saison)
    return sortie


def _creneaux(calendrier: Calendrier, lundi: dt.date, impaire: bool) -> list[dt.datetime]:
    sortie = []
    for jour, heure in calendrier.creneaux["semaine_impaire" if impaire else "semaine_paire"]:
        h, m = (int(x) for x in heure.split(":"))
        sortie.append(dt.datetime.combine(lundi + dt.timedelta(days=JOURS.index(jour)), dt.time(h, m)))
    return sorted(sortie)


def dates_prevues(calendrier: Calendrier) -> dict[Post, dt.datetime]:
    """Date et heure de chaque post ; vide tant que `date_lancement` n'est pas fixée."""
    if calendrier.date_lancement is None:
        return {}
    dates: dict[Post, dt.datetime] = {}
    lancement = calendrier.date_lancement
    lundi = lancement - dt.timedelta(days=lancement.weekday())
    for saison in posts(calendrier):
        a_placer = list(saison)
        semaine = 0
        while a_placer:
            for creneau in _creneaux(calendrier, lundi, impaire=semaine % 2 == 0):
                if a_placer and creneau.date() >= lancement:
                    dates[a_placer.pop(0)] = creneau
            lundi += dt.timedelta(weeks=1)
            semaine += 1
        lundi += dt.timedelta(weeks=calendrier.pause_entre_saisons_semaines)
    return dates


def jour_en_clair(d: dt.datetime) -> str:
    """« mardi 3 novembre », « jeudi 1er octobre » : le jour d'une reprise, sur une page."""
    return f"{JOURS[d.weekday()]} {'1er' if d.day == 1 else d.day} {MOIS[d.month - 1]}"


def date_en_clair(d: dt.datetime, fuseau: str) -> str:
    """« mardi 3 novembre 2026, 8 h 30 (Africa/Abidjan) »."""
    minutes = f" {d.minute:02d}" if d.minute else ""
    return f"{JOURS[d.weekday()]} {d.day} {MOIS[d.month - 1]} {d.year}, {d.hour} h{minutes} ({fuseau})"
