"""Typographie française (charte/decisions-automatisation.md, 9.4), appliquée par le générateur.

L'agent écrit un texte ordinaire ; tout texte affiché passe ici avant le rendu. Les fonctions sont
idempotentes : un texte déjà composé ne change pas.

- `texte` : phrases (titres, paragraphes, légendes, étiquettes) ;
- `math` : notations mathématiques (formules, symboles entre `$`), où l'apostrophe est un prime.
"""

from __future__ import annotations

import re

INSECABLE = " "  # espace insécable : avant « : », dans les guillemets, Nº, unités
FINE = " "  # espace fine insécable : avant ; ! ?, entre milliers, avant %
ESPACES = "    "

# Majuscules accentuées : mots courants dont la capitale perd souvent son accent.
MAJUSCULES = {
    "Ecart": "Écart", "Ecole": "École", "Egalement": "Également", "Element": "Élément", "Elément": "Élément",
    "Episode": "Épisode", "Episodes": "Épisodes", "Equation": "Équation", "Etape": "Étape", "Etapes": "Étapes",
    "Etat": "État", "Etats": "États", "Etiquette": "Étiquette", "Etiquettes": "Étiquettes", "Etre": "Être",
    "Etude": "Étude", "Evaluation": "Évaluation", "Evaluer": "Évaluer", "Eviter": "Éviter",
}

UNITES = r"(?:%|‰|px|mm|cm|km|kg|g|ms|s|min|h|Mo|Go|Ko|To|€|heures?|minutes?|secondes?|jours?|semaines?|mois|ans)"


def _milliers(m: re.Match) -> str:
    chiffres = m.group(0)
    groupes = []
    while len(chiffres) > 3:
        groupes.insert(0, chiffres[-3:])
        chiffres = chiffres[:-3]
    return FINE.join([chiffres] + groupes)


def texte(s: str) -> str:
    # Apostrophe typographique ; points de suspension.
    s = s.replace("'", "’").replace("...", "…")
    # Guillemets français, espace insécable à l'intérieur.
    s = re.sub(r'«[    ]*', "«" + INSECABLE, s)
    s = re.sub(r'[    ]*»', INSECABLE + "»", s)
    # Espace fine insécable avant ; ! ? (une seule, avant le premier signe d'une suite « ?! »).
    s = re.sub(r"(?<=[^\s;!?:«])[    ]*([;!?])", FINE + r"\1", s)
    # Espace insécable avant « : » suivi d'une espace ou en fin de texte (08:30 et https:// restent intacts).
    s = re.sub(r"(?<=[^\s:;!?«])[    ]*:(?=\s|$)", INSECABLE + ":", s)
    # Nº et le numéro ne se séparent pas.
    s = re.sub(r"N[º°][    ]*(?=\d)", "Nº" + INSECABLE, s)
    # Signe moins devant un nombre (pas dans « mini-lots »).
    s = re.sub(r"(?:^|(?<=[\s(\[=/]))-(?=\d)", "−", s)
    # Virgule décimale.
    s = re.sub(r"(?<=\d)\.(?=\d)", ",", s)
    # Milliers : 10000 → 10 000, « 10 000 » → espace fine insécable. Les années (4 chiffres) restent intactes.
    s = re.sub(r"(?<![\d,])\d{5,}(?![\d,])", _milliers, s)
    s = re.sub(r"(?<![\d,])(\d{1,3})[  ](?=\d{3}(?!\d))", r"\1" + FINE, s)
    # Signe de multiplication.
    s = re.sub(r"(?<=\s)\*(?=\s)", "×", s)
    s = re.sub(r"(?<=\d) ?x ?(?=\d)", " × ", s)
    # Un nombre et son unité ne se séparent pas.
    s = re.sub(r"(?<=\d)[   ](?=%|‰)", FINE, s)
    s = re.sub(rf"(?<=\d) (?={UNITES}\b)", INSECABLE, s)
    # Majuscules accentuées : « A retenir » → « À retenir ».
    s = re.sub(r"(?:^|(?<=[.!?…]\s)|(?<=\n))A(?= )", "À", s)
    s = re.sub(r"\b(" + "|".join(MAJUSCULES) + r")\b", lambda m: MAJUSCULES[m.group(1)], s)
    return s


def math(s: str) -> str:
    """Notation mathématique : prime, signe moins, virgule décimale, signe de multiplication."""
    s = s.replace("'", "′")
    s = re.sub(r"(?<=\d)\.(?=\d)", ",", s)
    s = s.replace("-", "−").replace("*", "×")
    return s
