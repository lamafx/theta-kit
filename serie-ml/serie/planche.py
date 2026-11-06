"""Planche d'un épisode : toutes les pages côte à côte, dans une seule image (sortie/NN/planche.png).

Sert à la vérification à l'œil : un coup d'œil montre l'enchaînement des pages et les écarts de style.
"""

from __future__ import annotations

import html
from pathlib import Path

LARGEUR_PAGE = 1080
HAUTEUR_PAGE = 1350


def planche(pngs: list[Path], cible: Path, colonnes: int | None = None, largeur_vignette: int = 432) -> Path:
    """Assemble les pages en grille (une ligne si `colonnes` est omis) ; renvoie le chemin de l'image."""
    from playwright.sync_api import sync_playwright

    colonnes = colonnes or len(pngs)
    lignes = -(-len(pngs) // colonnes)
    hauteur_vignette = round(largeur_vignette * HAUTEUR_PAGE / LARGEUR_PAGE)
    marge, legende = 24, 28
    largeur = marge + colonnes * (largeur_vignette + marge)
    hauteur = marge + lignes * (hauteur_vignette + legende + marge)
    cases = "".join(
        f'<figure><img src="{p.resolve().as_uri()}" width="{largeur_vignette}" height="{hauteur_vignette}">'
        f"<figcaption>{html.escape(p.stem)}</figcaption></figure>"
        for p in pngs
    )
    page = (
        "<!doctype html><meta charset=utf-8><style>"
        f"body{{margin:0;background:#D5DCE6;font:14px monospace;color:#3E4450}}"
        f".g{{display:grid;grid-template-columns:repeat({colonnes},{largeur_vignette}px);gap:{marge}px;padding:{marge}px}}"
        "figure{margin:0}img{display:block;box-shadow:0 0 0 1px #A7B3C2}figcaption{height:"
        f"{legende}px;line-height:{legende}px}}</style><div class=g>{cases}</div>"
    )
    cible.parent.mkdir(parents=True, exist_ok=True)
    source = cible.with_suffix(".html")
    source.write_text(page, encoding="utf-8")
    with sync_playwright() as pw:
        navigateur = pw.chromium.launch()
        try:
            onglet = navigateur.new_page(viewport={"width": largeur, "height": hauteur})
            onglet.goto(source.as_uri())
            onglet.wait_for_load_state("load")
            onglet.screenshot(path=str(cible), full_page=True)
        finally:
            navigateur.close()
    source.unlink()
    return cible
