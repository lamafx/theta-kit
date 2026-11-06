"""Lecture de etat.yaml et affichage de l'avancement de la série."""

from __future__ import annotations

import datetime as dt
from collections import Counter
from dataclasses import dataclass

from serie.depot import Depot, cle_episode, lire_yaml
from serie.schemas import Calendrier, Etat, Statut


@dataclass
class Ligne:
    numero: int
    titre: str
    statut: Statut
    publie_le: str | None


def titres_des_fiches(depot: Depot) -> dict[int, str]:
    """Titre de chaque épisode, lu dans la fiche sans la valider (l'état reste lisible si une fiche casse)."""
    titres = {}
    for chemin in depot.fichiers_fiches():
        try:
            donnees = lire_yaml(chemin)
            titres[int(donnees["numero"])] = str(donnees["titre"])
        except Exception:
            titres[int(chemin.name[:2])] = f"(fiche illisible : {chemin.name})"
    return titres


def charger_etat(depot: Depot) -> Etat:
    return Etat.model_validate(lire_yaml(depot.etat))


def charger_calendrier(depot: Depot) -> Calendrier:
    return Calendrier.model_validate(lire_yaml(depot.calendrier))


def avance(etat: Etat) -> int:
    """Épisodes relus et pas encore publiés : l'avance de sécurité (decisions-automatisation, 9.7)."""
    return sum(1 for e in etat.episodes.values() if e.statut is Statut.RELU)


def compter(etats) -> str:
    compte = Counter(e.statut for e in etats)
    return " · ".join(f"{compte.get(s, 0)} {s.libelle}" for s in Statut)


def prochaine_publication(etat: Etat, calendrier, maintenant: dt.datetime | None = None) -> list[str]:
    """Le premier post pas encore publié, avec sa date prévue (9.7), quand date_lancement est fixée."""
    from serie.calendrier import date_en_clair, dates_prevues

    dates = dates_prevues(calendrier)
    for (genre, n), quand in sorted(dates.items(), key=lambda kv: kv[1]):
        e = etat.episodes[cle_episode(n)] if genre == "episode" else etat.bilans[n]
        if e.statut in (Statut.PUBLIE, Statut.MESURE):
            continue
        nom = f"Nº {n:02d}" if genre == "episode" else f"bilan de la saison {n}"
        retard = " (en retard)" if maintenant and quand < maintenant else ""
        return [f"Prochaine publication : {nom}, {date_en_clair(quand, calendrier.fuseau)}{retard} ; "
                f"statut {e.statut.libelle}"]
    return []


def afficher_etat(depot: Depot) -> str:
    etat = charger_etat(depot)
    calendrier = charger_calendrier(depot)
    titres = titres_des_fiches(depot)

    lignes = [f"θ Théta · état de la série ({len(etat.episodes)} épisodes)", ""]
    largeur = max(len(t) for t in titres.values()) if titres else 20
    for s in sorted(calendrier.saisons):
        debut, fin = calendrier.saisons[s].episodes
        bilan = ", puis bilan" if calendrier.saisons[s].bilan else ""
        lignes.append(f"Saison {s} · épisodes {debut:02d} à {fin:02d}{bilan}")
        for n in range(debut, fin + 1):
            e = etat.episodes[cle_episode(n)]
            titre = titres.get(n, "(fiche absente)")
            date = f"  le {e.publie_le.isoformat()}" if e.publie_le else ""
            lignes.append(f"  Nº {n:02d}  {titre:<{largeur}}  {e.statut.libelle}{date}")
        if calendrier.saisons[s].bilan:
            b = etat.bilans[s]
            date = f"  le {b.publie_le.isoformat()}" if b.publie_le else ""
            lignes.append(f"         {'Bilan de la saison ' + str(s):<{largeur}}  {b.statut.libelle}{date}")
        lignes.append("")

    lignes.append(f"Total : {compter(etat.episodes.values())}")
    lignes.append(f"Bilans : {compter(etat.bilans.values())}")

    mini = calendrier.avance_minimum_episodes_relus
    n_avance = avance(etat)
    alerte = "" if n_avance >= mini else " : sous le seuil"
    pluriel = "s" if n_avance > 1 else ""
    lignes.append(f"Avance : {n_avance} épisode{pluriel} relu{pluriel} d'avance (minimum {mini}){alerte}")
    lignes += prochaine_publication(etat, calendrier, dt.datetime.now())

    if calendrier.date_lancement is None:
        lignes.append("Lancement : date non fixée dans calendrier.yaml")
    else:
        lignes.append(f"Lancement : {calendrier.date_lancement.isoformat()} ({calendrier.fuseau})")
    return "\n".join(lignes)
