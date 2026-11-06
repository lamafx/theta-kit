"""Jalon 4 : skills (.claude/skills/) et sous-agent relecteur (.claude/agents/)."""

import re

import pytest
import yaml

from serie.reprise import ETAPES

SKILLS = ("episode", "saison", "bilan", "etat", "corriger", "stats")


def entete(chemin):
    texte = chemin.read_text(encoding="utf-8")
    _, tete, corps = texte.split("---", 2)
    return yaml.safe_load(tete), corps


def commandes_serie(depot) -> set[str]:
    import argparse

    from serie import cli

    sous = set()
    origine = argparse.ArgumentParser.parse_args

    def espion(self, args=None, namespace=None):
        for action in self._actions:
            if isinstance(action, argparse._SubParsersAction):
                sous.update(action.choices)
        raise SystemExit(0)

    argparse.ArgumentParser.parse_args = espion
    try:
        cli.main(["etat"])
    except SystemExit:
        pass
    finally:
        argparse.ArgumentParser.parse_args = origine
    return sous


@pytest.mark.parametrize("nom", SKILLS)
def test_skill_declare(depot, nom):
    tete, corps = entete(depot.racine / ".claude" / "skills" / nom / "SKILL.md")
    assert tete["name"] == nom and len(tete["description"]) > 40
    assert corps.strip()


def test_skills_n_appellent_que_des_commandes_existantes(depot):
    existantes = commandes_serie(depot)
    assert {"etape", "reprendre", "statut", "rendre", "verifier", "publier", "images", "bilan", "etat"} <= existantes
    for nom in SKILLS:
        corps = (depot.racine / ".claude" / "skills" / nom / "SKILL.md").read_text(encoding="utf-8")
        for cmd in re.findall(r"serie (\w+)", corps):
            assert cmd in existantes or cmd == "NN", (nom, cmd)


def test_episode_enregistre_chaque_etape(depot):
    corps = (depot.racine / ".claude" / "skills" / "episode" / "SKILL.md").read_text(encoding="utf-8")
    for etape in ETAPES:
        assert f"serie etape NN {etape}" in corps, etape


def test_relecteur_sans_shell_ni_edition(depot):
    """Lecture, recherche web (règles éditoriales du 2026-10-26) et écriture de son seul rapport."""
    tete, corps = entete(depot.racine / ".claude" / "agents" / "relecteur.md")
    outils = {o.strip() for o in tete["tools"].split(",")}
    assert outils == {"Read", "Grep", "Glob", "Write", "WebSearch", "WebFetch"}
    assert "sortie/NN/relecture.md" in corps


def test_relecteur_reprend_la_grille_du_code(depot):
    """Le relecteur recopie `serie verifier` et n'applique pas de grille à part."""
    _, corps = entete(depot.racine / ".claude" / "agents" / "relecteur.md")
    assert "sortie/NN/verification.md" in corps and "Recopie le résultat" in corps
    assert "ne refais pas ces contrôles" in corps
    for regle in ("glossaire", "années", "polices", "texte du post", "Règles éditoriales Théta"):
        assert regle in corps, regle
    for forme in ("Source vérifiée", "Correction proposée", "Option recommandée", "oui / non / autre",
                  "Mises en conformité"):
        assert forme in corps, forme
