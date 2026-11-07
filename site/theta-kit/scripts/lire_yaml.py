"""Lit les YAML de serie-ml avec PyYAML, le lecteur de la série, et les rend en JSON sur la sortie standard."""
import datetime as dt
import glob
import json
import os
import sys

import yaml

racine = sys.argv[1]
fichiers = (
    sorted(glob.glob(os.path.join(racine, "banque", "episodes", "*.yaml")))
    + sorted(glob.glob(os.path.join(racine, "contenu", "[0-9][0-9].yaml")))
    + [os.path.join(racine, "etat.yaml"), os.path.join(racine, "calendrier.yaml")]
)


def texte(valeur):
    if isinstance(valeur, (dt.date, dt.datetime)):
        return valeur.isoformat()
    raise TypeError(type(valeur))


donnees = {}
for f in fichiers:
    with open(f, encoding="utf-8") as h:
        donnees[os.path.relpath(f, racine).replace(os.sep, "/")] = yaml.safe_load(h)
sys.path.insert(0, racine)
from calculs import ames  # noqa: E402

pts = ames.points_surface_prix()
n = len(pts)
droite = ames.droite_prix_surface()
donnees["__labos"] = {
    "echantillon": ames.echantillon(60, 11),
    "ames": {
        "n": n, "a": droite["a"], "b": droite["b"],
        "sx": sum(x for x, _ in pts) / n, "sy": sum(y for _, y in pts) / n,
        "sxx": sum(x * x for x, _ in pts) / n, "sxy": sum(x * y for x, y in pts) / n, "syy": sum(y * y for _, y in pts) / n,
    },
    "ventes": [
        {"surface": v["surface"], "chambres": v["chambres"], "quartier": v["quartier"], "prix": round(v["prix"] / 1e6)}
        for v in ames.maisons([2, 267, 171])
    ],
}
sys.stdout.reconfigure(encoding="utf-8")
json.dump(donnees, sys.stdout, ensure_ascii=False, default=texte)
