

def test_valeurs_de_la_descente_sont_calculees():
    """Nº 11 : w, b et J écrits dans les cas viennent de `descente_droite`, pas seulement de ses paramètres."""
    from pathlib import Path

    from serie.depot import lire_yaml
    from serie.schemas import Contenu
    from serie.verification import valeurs_calculees

    contenu = Contenu.model_validate(lire_yaml(Path(__file__).resolve().parents[1] / "contenu" / "11.yaml"))
    valeurs = valeurs_calculees(contenu)
    assert {13400, 57.5, 27.9, 1085, 72.2, 6.1, 1030} <= set(valeurs)
