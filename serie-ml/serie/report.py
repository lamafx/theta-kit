"""serie reporter : déplacer la date d'un seul post (épisode ou bilan), décidé par l'auteur (admin, A10).

Le post garde sa place dans l'ordre de la série : la nouvelle date doit tomber entre celle du post précédent et
celle du suivant, jamais avant une notion qu'il suppose connue. Les autres dates ne bougent pas. Le report est
noté dans calendrier.yaml (`reports`), et publier/NN/date.txt est réécrit ; si l'étape « publication » était à
jour, elle est réenregistrée (seule la date a changé).
"""

from __future__ import annotations

import datetime as dt
import re
from zoneinfo import ZoneInfo

from serie.calendrier import Post, date_en_clair, dates_prevues, posts
from serie.depot import Depot, cle_episode
from serie.etat import charger_calendrier
from serie.reprise import ecrire_atomique, enregistrer_etape, etapes_a_refaire, lire_etat

DELAI_MIN = dt.timedelta(minutes=10)
COMMENTAIRE = "# Reports décidés par l'auteur (serie reporter, admin) : ils remplacent la date calculée."


def _post(cle: str) -> tuple[Post, str]:
    if cle.startswith("bilan-"):
        return ("bilan", int(cle.removeprefix("bilan-"))), cle
    return ("episode", int(cle)), cle_episode(cle)


def _ecrire_reports(chemin, reports: dict[str, str]) -> None:
    """Réécrit le seul bloc `reports` de calendrier.yaml, sans toucher aux commentaires du reste du fichier."""
    lignes = chemin.read_text(encoding="utf-8").splitlines()
    sortie: list[str] = []
    i = 0
    while i < len(lignes):
        if lignes[i].startswith("reports:"):
            if sortie and sortie[-1] == COMMENTAIRE:
                sortie.pop()
            i += 1
            while i < len(lignes) and lignes[i].startswith((" ", "\t")):
                i += 1
            continue
        sortie.append(lignes[i])
        i += 1
    while sortie and not sortie[-1].strip():
        sortie.pop()
    if reports:
        sortie += [COMMENTAIRE, "reports:"] + [f"  '{k}': '{reports[k]}'" for k in sorted(reports)]
    ecrire_atomique(chemin, "\n".join(sortie) + "\n")


def reporter(depot: Depot, cle: str, quand: dt.datetime, maintenant: dt.datetime) -> tuple[dt.datetime, dt.datetime]:
    """Déplace un post ; renvoie (ancienne date, nouvelle date), heures d'Abidjan sans fuseau."""
    calendrier = charger_calendrier(depot)
    zone = ZoneInfo(calendrier.fuseau)
    post, cle = _post(cle)
    quand = quand.replace(tzinfo=None, second=0, microsecond=0)
    dates = dates_prevues(calendrier)
    if post not in dates:
        raise ValueError(f"{cle} : pas de date prévue dans le calendrier")
    brut = lire_etat(depot)
    entree = brut["bilans"][post[1]] if post[0] == "bilan" else brut["episodes"][cle]
    if entree["statut"] in ("publie", "mesure"):
        raise ValueError(f"{cle} : déjà publié, sa date ne bouge plus")
    if quand.replace(tzinfo=zone) < maintenant + DELAI_MIN:
        raise ValueError(f"{cle} : la nouvelle date doit être dans le futur (au moins {DELAI_MIN.seconds // 60} minutes)")
    ordre = [p for saison in posts(calendrier) for p in saison]
    i = ordre.index(post)
    avant = dates.get(ordre[i - 1]) if i > 0 else None
    apres = dates.get(ordre[i + 1]) if i + 1 < len(ordre) else None
    if avant and quand <= avant:
        raise ValueError(f"{cle} : la nouvelle date doit suivre le post précédent ({date_en_clair(avant, calendrier.fuseau)})")
    if apres and quand >= apres:
        raise ValueError(f"{cle} : la nouvelle date doit précéder le post suivant ({date_en_clair(apres, calendrier.fuseau)})")
    ancienne = dates[post]

    # Une date ramenée à celle du calendrier efface le report.
    base = dates_prevues(calendrier.model_copy(update={"reports": {}}))
    reports = {k: v.strftime("%Y-%m-%d %H:%M") for k, v in calendrier.reports.items()}
    if base.get(post) == quand:
        reports.pop(cle, None)
    else:
        reports[cle] = quand.strftime("%Y-%m-%d %H:%M")

    numero = None if post[0] == "bilan" else post[1]
    publication_a_jour = numero is not None and "publication" in brut["episodes"][cle].get("etapes", {}) and not any(
        e == "publication" for e, _ in etapes_a_refaire(depot, numero))
    _ecrire_reports(depot.calendrier, reports)
    fichier_date = depot.racine / "publier" / cle / "date.txt"
    if fichier_date.is_file():
        ecrire_atomique(fichier_date, date_en_clair(quand, calendrier.fuseau) + "\n")
        if publication_a_jour:
            enregistrer_etape(depot, numero, "publication")
    return ancienne, quand


def lire_quand(texte: str) -> dt.datetime:
    """« 2026-11-25 08:30 » ou « 2026-11-25T08:30 »."""
    m = re.fullmatch(r"\s*(\d{4}-\d{2}-\d{2})[ T](\d{1,2}):(\d{2})\s*", texte)
    if not m:
        raise ValueError(f"date « {texte} » : AAAA-MM-JJ HH:MM attendu")
    return dt.datetime.fromisoformat(f"{m[1]}T{int(m[2]):02d}:{m[3]}")
