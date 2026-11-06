"""Les maisons d'Ames, la droite prix-surface et son coût (épisodes 02, 04 et 05) sont ceux que calculent
calculs/ames.py et calculs/cout.py."""

from pathlib import Path

import yaml

from calculs import ames, cout, devises

RACINE = Path(__file__).resolve().parents[1]


def _pages(numero: int) -> list[dict]:
    return yaml.safe_load((RACINE / "contenu" / f"{numero:02d}.yaml").read_text(encoding="utf-8"))["pages"]


def test_conversion_au_cours_bceao():
    assert devises.dollars_en_fcfa([345000, 179000, 392000]) == [203000000, 105000000, 231000000]


def test_maisons_de_l_episode_02():
    attendu = [[m["surface"], m["chambres"], m["quartier"], m["prix"]] for m in ames.maisons([2, 267, 171])]
    pages = _pages(2)
    assert pages[1]["visuel"]["params"]["valeurs"] == attendu[0]
    assert pages[2]["visuel"]["params"]["lignes"] == attendu


def test_droite_de_l_episode_04():
    droite = ames.droite_prix_surface()
    params = _pages(4)[1]["visuel"]["params"]
    assert (params["a"], params["b"]) == (droite["a"], droite["b"])
    assert droite["n"] == 2925  # 2 930 ventes, moins les 5 de plus de 4 000 pieds carrés (De Cock, 2011)
    sortie = ames.prediction_surface(params["x"], params["a"], params["b"])
    assert sortie == {"prediction": 115, "m2": 150}  # « $ŷ$ = 115 » et « $x$ = 1,5, soit 150 m² » sur la page


def test_cout_de_l_episode_05():
    pages = _pages(5)
    lignes = [[e["quartier"], e["prix"], e["prediction"], e["erreur"], e["carre"]]
              for e in cout.erreurs_maisons([2, 267, 171], 74, 4)]
    assert pages[2]["visuel"]["params"]["lignes"] == lignes
    assert [c["texte"].split(" ")[0] for c in pages[4]["cas"]] == ["$J$", "$J$"]
    assert [cout.cout_ames(c["params"]["a"], c["params"]["b"]) for c in pages[4]["cas"]] == [1030, 3433]
    parabole = cout.cout_selon_a(4, 20)
    assert pages[5]["visuel"]["params"]["fonction"] == {"a": parabole["a"], "c": parabole["c"]}
    assert parabole["creux"] == 74
