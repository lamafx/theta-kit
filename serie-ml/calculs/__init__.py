"""Fonctions qui produisent chaque chiffre et chaque courbe des épisodes.

Un contenu nomme une fonction (`calcul:`) ; le générateur l'appelle avec les paramètres du visuel.
Aucun chiffre affiché ne vient d'ailleurs.
"""

from calculs import ames, cout, descente_gradient, devises, droite, grille, nuage

CALCULS = {
    "descente_gradient": descente_gradient.iterations,
    "descente_gradient_tableau": descente_gradient.tableau,
    "descente_gradient_2d": descente_gradient.iterations_2d,
    "gradient_2d": descente_gradient.gradient_2d,
    "gradient_tableau": descente_gradient.gradient_tableau,
    "sgd_2d": descente_gradient.sgd_2d,
    "pas_par_epoque": descente_gradient.pas_par_epoque,
    "pas_par_epoque_tableau": descente_gradient.pas_par_epoque_tableau,
    "iterations_f": descente_gradient.iterations_f,
    "creux_f": descente_gradient.creux_f,
    "chiffre_manuscrit": grille.chiffre_manuscrit,
    "dollars_en_fcfa": devises.dollars_en_fcfa,
    "maisons_ames": ames.maisons,
    "droite_prix_surface": ames.droite_prix_surface,
    "echantillon_ames": ames.echantillon,
    "descente_droite": ames.descente_droite,
    "erreurs_maisons": cout.erreurs_maisons,
    "cout_maisons": cout.cout_maisons,
    "cout_ames": cout.cout_ames,
    "cout_selon_a": cout.cout_selon_a,
    "droite": droite.segment,
    "prediction": droite.predire,
    "prediction_surface": ames.prediction_surface,
    "moindres_carres": droite.moindres_carres,
    "nuage_groupes": nuage.groupes,
    "nuage_droite": nuage.autour_d_une_droite,
    "frontiere": nuage.frontiere,
}


def calculer(nom: str, **params):
    if nom not in CALCULS:
        raise KeyError(f"calcul inconnu : {nom} (connus : {', '.join(sorted(CALCULS))})")
    return CALCULS[nom](**params)
