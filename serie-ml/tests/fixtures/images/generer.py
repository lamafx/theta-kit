"""Produit les images d'essai de tests/fixtures/images/ (A24) : des mires marquées « essai », jamais publiées.

Elles ont du relief (dégradés, formes, texte) pour qu'une zone image vide ou uniforme se voie et soit refusée.
Ce ne sont ni des photos ni des captures : les pages Contexte et Capture des épisodes montrent des images
réelles choisies à la relecture, ou leur variante sans image (charte, 9.5).

    .venv/Scripts/python tests/fixtures/images/generer.py
puis recopier l'empreinte sha256 affichée dans la fiche .yaml de chaque image.
"""

from __future__ import annotations

import hashlib
from pathlib import Path

ICI = Path(__file__).resolve().parent

PHOTO = """<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="678" viewBox="0 0 1200 678">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2B2F36"/>
<stop offset="1" stop-color="#C9CED6"/></linearGradient></defs>
<rect width="1200" height="678" fill="url(#g)"/>
<g fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="2">
{grille}</g>
<circle cx="360" cy="330" r="170" fill="#E9ECF1"/><circle cx="360" cy="330" r="110" fill="#5A606B"/>
<rect x="640" y="170" width="380" height="320" rx="24" fill="#1C1F24"/>
<rect x="680" y="210" width="300" height="60" rx="10" fill="#8C939E"/>
<rect x="680" y="300" width="220" height="40" rx="10" fill="#B9BFC8"/>
<rect x="680" y="370" width="260" height="40" rx="10" fill="#B9BFC8"/>
<text x="600" y="610" text-anchor="middle" font-family="monospace" font-size="44" fill="#FFFFFF">IMAGE D'ESSAI · 1200 × 678</text>
</svg>"""

CAPTURE = """<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="840" viewBox="0 0 1200 840">
<rect width="1200" height="840" fill="#FFFFFF"/>
{lignes}
<text x="1160" y="52" text-anchor="end" font-family="monospace" font-size="28" fill="#6B7280">CAPTURE D'ESSAI</text>
</svg>"""


def _grille() -> str:
    return "".join(f'<line x1="{x}" y1="0" x2="{x}" y2="678"/>' for x in range(0, 1201, 100)) + "".join(
        f'<line x1="0" y1="{y}" x2="1200" y2="{y}"/>' for y in range(0, 679, 100))


def _lignes() -> str:
    """Des rangées de 83,5 px (64 px une fois l'image ramenée à 920 px de large), chacune avec des barres."""
    sortie = []
    for k in range(9):
        y = k * 83.5
        fond = "#F3F4F6" if k % 2 else "#FFFFFF"
        sortie.append(f'<rect x="0" y="{y}" width="1200" height="83.5" fill="{fond}"/>'
                      f'<circle cx="60" cy="{y + 42}" r="22" fill="#9CA3AF"/>'
                      f'<rect x="110" y="{y + 22}" width="{260 + 40 * (k % 3)}" height="16" rx="8" fill="#374151"/>'
                      f'<rect x="110" y="{y + 50}" width="{620 - 50 * (k % 4)}" height="12" rx="6" fill="#9CA3AF"/>'
                      + (f'<rect x="1040" y="{y + 30}" width="100" height="16" rx="8" fill="#D1D5DB"/>' if k else "")
                      + f'<line x1="0" y1="{y + 83.5}" x2="1200" y2="{y + 83.5}" stroke="#E5E7EB" stroke-width="2"/>')
    return "".join(sortie)


def produire() -> dict[str, str]:
    from playwright.sync_api import sync_playwright

    empreintes = {}
    with sync_playwright() as pw:
        navigateur = pw.chromium.launch()
        try:
            for nom, svg, (l, h) in (("essai-photo", PHOTO.format(grille=_grille()), (1200, 678)),
                                     ("essai-capture", CAPTURE.format(lignes=_lignes()), (1200, 840))):
                onglet = navigateur.new_page(viewport={"width": l, "height": h}, device_scale_factor=1)
                onglet.set_content(f'<body style="margin:0">{svg}</body>')
                cible = ICI / f"{nom}.png"
                onglet.screenshot(path=str(cible), clip={"x": 0, "y": 0, "width": l, "height": h})
                empreintes[nom] = hashlib.sha256(cible.read_bytes()).hexdigest()
        finally:
            navigateur.close()
    return empreintes


if __name__ == "__main__":
    for nom, empreinte in produire().items():
        print(nom, empreinte)
