"""Famille Flux : boîtes, flèches, boucle de retour (pages intérieures seulement).

Formes :
- `vignette` : la planche Bib-Visuels (264 × 112) ;
- `page` : la même grammaire à la largeur d'une page (920 px par défaut), sur une ou plusieurs lignes.
  Mêmes traits que la vignette, agrandis : boîtes blanches arrondies, flèches pleines, boucle de retour
  en accent. Code couleur de la bibliothèque : noir pour l'objet étudié, accent pour ce qu'on montre,
  gris pour le contexte (charte/bibliotheque-visuelle.md).

Paramètres de la forme `page` :
- `lignes` : liste de lignes, chacune `{etiquette, etapes, ton}` ;
  - `etapes` : textes des boîtes, de gauche à droite ; une étape peut être une liste de textes, dessinés
    en boîtes empilées (une sortie à plusieurs branches) ; un texte qui commence par « ! » est en accent ;
  - `ton` : `objet` (par défaut) ou `contexte` (gris) ;
- `retour` : texte d'une boucle de retour de la dernière boîte vers la première (une seule ligne) ;
- `largeur` : largeur du dessin en pixels ;
- `description` : texte lu par les lecteurs d'écran.

Marge haute de 36 px, comme les formes de page de la Courbe : sans elle, l'étiquette de la première ligne
touche le texte de la page (A66, épisodes 03 et 11). L'ouverture, qui a déjà la sienne, la remet à zéro
(`--marge-flux`, gabarits/style.css.j2).
"""

from __future__ import annotations

from bibliotheque._svg import GEIST, MONO, balise, esc, ligne, svg

ETAPES = ["Données", "Modèle", "Prédiction"]

# Mesures de la forme page : la vignette (boîte 104 × 46, texte 16 px, flèche 26 px) agrandie.
HAUTEUR_BOITE = 76
RAYON = 14
FLECHE = 64
ECART_PILE = 18
ETIQUETTE = 22  # session de design n° 2 : aucun texte sous 22 px (15 avant)
ESPACE_ETIQUETTE = 22
ENTRE_LIGNES = 52
TAILLE_TEXTE = 24
CHASSE = 0.52  # largeur moyenne d’un caractère de Geist 500, en fraction de la taille (mesurée, A25)


def _marqueur(ident: str, couleur: str, taille: float = 7) -> str:
    return (f'<marker id="{ident}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="{taille}" markerHeight="{taille}" '
            f'orient="auto"><path d="M0 0L10 5L0 10z" fill="{couleur}"></path></marker>')


def _vignette(p, th) -> str:
    ob, ac = th["objet"], th["accent"]
    etapes = p.get("etapes", ETAPES)
    retour = p.get("retour", "erreur")
    c = [
        f'<defs>{_marqueur("bv-arrow", ob)}{_marqueur("bv-back", ac)}</defs>',
        f'<g fill="#FFFFFF" stroke="{ob}" stroke-width="2">'
        + "".join(balise("rect", x=14 + 134 * k, y=44, width=104, height=46, rx=10) for k in range(3)) + "</g>",
        f'<g font-family="{GEIST}" font-size="16" font-weight="500" fill="{ob}" text-anchor="middle">'
        + "".join(f'<text x="{66 + 134 * k}" y="72">{esc(e)}</text>' for k, e in enumerate(etapes)) + "</g>",
        ligne(118, 67, 144, 67, stroke=ob, stroke_width=2, marker_end="url(#bv-arrow)"),
        ligne(252, 67, 278, 67, stroke=ob, stroke_width=2, marker_end="url(#bv-arrow)"),
        balise("path", d="M334 92 L334 128 L200 128 L200 96", fill="none", stroke=ac, stroke_width=2.5,
               marker_end="url(#bv-back)"),
        f'<text x="267" y="150" text-anchor="middle" font-family="{MONO}" font-size="14" fill="{ac}">{esc(retour)}</text>',
    ]
    return svg(264, 112, c, p.get("description"), vue=(400, 170))


# --- Forme page ----------------------------------------------------------------------------

def _couper(texte: str, largeur: float) -> list[str]:
    """Coupe un texte en lignes qui tiennent dans la boîte (au plus 2), aux espaces."""
    par_ligne = max(4, int((largeur - 24) / (TAILLE_TEXTE * CHASSE)))
    if len(texte) <= par_ligne:
        return [texte]
    mots, lignes = texte.split(" "), [""]
    for mot in mots:
        essai = f"{lignes[-1]} {mot}".strip()
        if len(essai) <= par_ligne or not lignes[-1]:
            lignes[-1] = essai
        else:
            lignes.append(mot)
    if len(lignes) > 2:
        raise ValueError(f"flux : « {texte} » ne tient pas dans une boîte de {largeur:.0f} px")
    return lignes


def _boite(x: float, y: float, largeur: float, texte: str, couleurs: dict) -> list[str]:
    accent = texte.startswith("!")
    texte = texte[1:] if accent else texte
    trait = couleurs["accent"] if accent else couleurs["trait"]
    encre = couleurs["accent"] if accent else couleurs["encre"]
    c = [balise("rect", x=float(x), y=float(y), width=float(largeur), height=float(HAUTEUR_BOITE), rx=RAYON,
                fill=couleurs["fond"], stroke=trait, stroke_width=2.5 if accent else 2)]
    lignes = _couper(texte, largeur)
    interligne = TAILLE_TEXTE * 1.2
    y0 = y + HAUTEUR_BOITE / 2 + 8 - interligne * (len(lignes) - 1) / 2
    for k, t in enumerate(lignes):
        c.append(f'<text x="{x + largeur / 2:.1f}" y="{y0 + k * interligne:.1f}" text-anchor="middle" '
                 f'font-family="{GEIST}" font-size="{TAILLE_TEXTE}" font-weight="500" fill="{encre}">{esc(t)}</text>')
    return c


def _page(p, th) -> str:
    largeur = float(p.get("largeur", 920))
    lignes = p.get("lignes") or [{"etapes": p.get("etapes", ETAPES)}]
    retour = p.get("retour")
    if retour and len(lignes) > 1:
        raise ValueError("flux : une boucle de retour ne se dessine que sur une seule ligne")
    tons = {
        "objet": {"trait": th["objet"], "encre": th["objet"], "etiquette": th["secondaire"]},
        "contexte": {"trait": th["contexte"], "encre": th["secondaire"], "etiquette": th["secondaire"]},
    }
    defs = [_marqueur("fx-objet", th["objet"]), _marqueur("fx-contexte", th["contexte"]),
            _marqueur("fx-accent", th["accent"])]
    c: list[str] = []
    y = 0.0
    for li in lignes:
        ton = li.get("ton", "objet")
        if ton not in tons:
            raise ValueError(f"flux : ton « {ton} » inconnu (objet, contexte)")
        couleurs = {**tons[ton], "accent": th["accent"], "fond": th["fond"]}
        if li.get("etiquette"):
            c.append(f'<text x="0" y="{y + ETIQUETTE:.1f}" font-family="{MONO}" font-size="{ETIQUETTE}" '
                     f'font-weight="500" letter-spacing="2.1" fill="{couleurs["etiquette"]}">'
                     f'{esc(li["etiquette"].upper())}</text>')
            y += ETIQUETTE + ESPACE_ETIQUETTE
        etapes = li["etapes"]
        n = len(etapes)
        if n < 1:
            raise ValueError("flux : une ligne a au moins une étape")
        lb = (largeur - FLECHE * (n - 1)) / n
        piles = [e if isinstance(e, list) else [e] for e in etapes]
        hauteur = max(len(pl) * HAUTEUR_BOITE + (len(pl) - 1) * ECART_PILE for pl in piles)
        milieux_precedents: list[float] = []
        for k, pile in enumerate(piles):
            x = k * (lb + FLECHE)
            h_pile = len(pile) * HAUTEUR_BOITE + (len(pile) - 1) * ECART_PILE
            y_pile = y + (hauteur - h_pile) / 2
            milieux = []
            for j, texte in enumerate(pile):
                yb = y_pile + j * (HAUTEUR_BOITE + ECART_PILE)
                c += _boite(x, yb, lb, texte, couleurs)
                milieux.append(yb + HAUTEUR_BOITE / 2)
            for ya in milieux_precedents:
                for yb in milieux:
                    c.append(ligne(x - FLECHE + 8, ya, x - 10, yb, stroke=couleurs["trait"], stroke_width=2.5,
                                   marker_end=f"url(#fx-{ton})"))
            milieux_precedents = milieux
        y += hauteur
        if retour:
            xd, xa = (n - 1) * (lb + FLECHE) + lb / 2, lb / 2
            yb = y + 44
            c.append(balise("path", d=f"M{xd:.1f} {y + 4:.1f} L{xd:.1f} {yb:.1f} L{xa:.1f} {yb:.1f} L{xa:.1f} {y + 10:.1f}",
                            fill="none", stroke=th["accent"], stroke_width=3, marker_end="url(#fx-accent)"))
            c.append(f'<text x="{(xd + xa) / 2:.1f}" y="{yb + 32:.1f}" text-anchor="middle" font-family="{MONO}" '
                     f'font-size="22" fill="{th["accent"]}">{esc(retour)}</text>')
            y = yb + 40
        y += ENTRE_LIGNES
    hauteur_totale = y - ENTRE_LIGNES + 4
    return svg(largeur, hauteur_totale, [f"<defs>{''.join(defs)}</defs>"] + c, p.get("description"),
               style="display: block; overflow: visible; margin-top: var(--marge-flux, 36px)")


PARAMETRES = {"vignette": {"etapes", "retour"}, "page": {"lignes", "etapes", "retour", "largeur"}}

def rendre(params: dict, theme: dict) -> str:
    forme = params.get("forme", "vignette")
    if forme == "vignette":
        return _vignette(params, theme)
    if forme == "page":
        return _page(params, theme)
    raise ValueError(f"flux : forme « {forme} » inconnue (vignette, page)")
