"""serie decisions : les décisions D des rapports de relecture, sur une seule page."""

from serie.decisions import lire_decisions

RAPPORT = """# Relecture

## Mises en conformité

### C1 · Une mise en conformité, ignorée

- **Constat** : déjà appliquée

## Décisions de l'utilisateur

### D1 · Page 3 : une fourchette

- **Constat** : une seule source
- **Option recommandée** : A, garder la phrase
- **Décision** : oui / non

### D2 · Page 4 : un mot

- **Constat** : ambigu

## Contrôles automatiques
"""


def test_lire_decisions(tmp_path):
    rapport = tmp_path / "relecture.md"
    rapport.write_text(RAPPORT, encoding="utf-8")
    d1, d2 = lire_decisions(rapport, "09")
    assert (d1.episode, d1.code, d1.titre) == ("09", "D1", "Page 3 : une fourchette")
    assert d1.constat == "une seule source" and d1.recommandation == "A, garder la phrase"
    assert d2.constat == "ambigu" and d2.recommandation == ""
