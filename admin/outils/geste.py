"""Gestes de l'admin, exécutés par le workflow .github/workflows/admin.yml depuis la racine theta-kit.

serie-ml fait foi : ce script écrit seulement dans serie-ml, et passe par la CLI `serie` pour tout ce qui touche
aux statuts et au calendrier (ses contrôles restent la règle). Il note chaque geste dans
serie-ml/publier/linkedin/journal-admin.yaml et laisse ses messages en annotations GitHub, que l'admin affiche.

    python admin/outils/geste.py --geste valider --cible 11
    python admin/outils/geste.py --geste journal --cible 05 --resultat "ok" (gestes LinkedIn, depuis linkedin.yml)
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from zoneinfo import ZoneInfo

import yaml

RACINE = Path(__file__).resolve().parents[2]
SERIE = Path(os.environ.get("THETA_SERIE", RACINE / "serie-ml"))  # THETA_SERIE : copie de test
ABIDJAN = ZoneInfo("Africa/Abidjan")


class Refus(Exception):
    pass


def maintenant() -> dt.datetime:
    return dt.datetime.now(ABIDJAN).replace(microsecond=0)


def annoter(niveau: str, titre: str, message: str) -> None:
    propre = message.replace("%", "%25").replace("\r", "").replace("\n", "%0A")
    print(f"::{niveau} title={titre}::{propre}")


def serie(*args: str) -> str:
    r = subprocess.run([sys.executable, "-m", "serie", "--racine", str(SERIE), *args], capture_output=True, text=True,
                       encoding="utf-8", cwd=SERIE)
    sortie = (r.stdout + r.stderr).strip()
    if r.returncode != 0:
        raise Refus(sortie.replace("Erreur bloquante : ", "") or f"serie {' '.join(args)} a échoué")
    return sortie


def lire_yaml(chemin: Path, defaut):
    if not chemin.is_file():
        return defaut
    return yaml.safe_load(chemin.read_text(encoding="utf-8")) or defaut


def ecrire_yaml(chemin: Path, donnees, entete: str = "") -> None:
    chemin.parent.mkdir(parents=True, exist_ok=True)
    chemin.write_text(entete + yaml.safe_dump(donnees, allow_unicode=True, sort_keys=False, width=120), encoding="utf-8",
                      newline="\n")


def etat() -> dict:
    return lire_yaml(SERIE / "etat.yaml", {"episodes": {}})


def cle_episode(cible: str) -> str:
    if not re.fullmatch(r"\d{1,2}", cible):
        raise Refus(f"épisode « {cible} » invalide")
    return f"{int(cible):02d}"


# --- Gestes --------------------------------------------------------------------------------------------------

def valider(cible: str, _valeur: str) -> str:
    if cible.startswith("bilan-"):
        return serie("statut", cible, "relu")
    n = cle_episode(cible)
    statut = etat()["episodes"].get(n, {}).get("statut")
    if statut != "genere":
        raise Refus(f"Nº {n} est « {statut} » : seul un épisode généré (relu par le relecteur) se valide")
    reste = serie("reprendre", str(int(n)))
    if "toutes les étapes sont faites et à jour" not in reste:
        raise Refus(f"Nº {n} : étapes à refaire avant validation : {reste}")
    return serie("statut", n, "relu")


def corriger(cible: str, valeur: str) -> str:
    n = cle_episode(cible)
    v = json.loads(valeur or "{}")
    note = str(v.get("note", "")).strip()
    if len(note) < 3:
        raise Refus("note vide")
    fichier = SERIE / "sortie" / n / "corrections.md"
    if not fichier.parent.is_dir():
        raise Refus(f"Nº {n} pas encore produit (pas de sortie/{n}/)")
    texte = fichier.read_text(encoding="utf-8") if fichier.is_file() else f"# Corrections · épisode {n}\n"
    titre = "## Notes de relecture (admin)"
    if titre not in texte:
        texte = texte.rstrip("\n") + f"\n\n{titre}\n"
    lignes = note.splitlines()
    texte = texte.rstrip("\n") + f"\n\n- {maintenant():%Y-%m-%d %H:%M} : {lignes[0]}" + "".join(f"\n  {l}" for l in lignes[1:]) + "\n"
    fichier.write_text(texte, encoding="utf-8", newline="\n")
    message = f"note ajoutée à sortie/{n}/corrections.md"
    if v.get("bloquer") and etat()["episodes"].get(n, {}).get("statut") == "relu":
        serie("statut", n, "genere")
        message += " ; publication retenue (repassé à « généré »)"
    return message


def recette(cible: str, valeur: str) -> str:
    if not re.fullmatch(r"[a-z0-9]{2,30}", cible):
        raise Refus(f"labo « {cible} » invalide")
    v = json.loads(valeur or "{}")
    fichier = SERIE / "labos" / "recette.yaml"
    donnees = lire_yaml(fichier, {"labos": {}})
    donnees.setdefault("labos", {})
    avant = donnees["labos"].get(cible, {})
    cases = {str(k): bool(x) for k, x in (v.get("cases") or {}).items()}
    toutes = all(cases.values()) and len(cases) > 0
    validee = maintenant().date().isoformat() if v.get("valider") else (avant.get("validee_le") if toutes else None)
    donnees["labos"][cible] = {"cases": cases, "note": str(v.get("note", "")).strip() or None, "validee_le": validee,
                               "maj_le": maintenant().isoformat()}
    ecrire_yaml(fichier, donnees, "# Recette des labos 3D (conception/labos-saison-1.txt, section 8), cochée depuis l'admin.\n")
    return f"recette du labo {cible} {'validée' if v.get('valider') else 'enregistrée'} ({sum(cases.values())} cases cochées)"


def trancher(cible: str, valeur: str) -> str:
    if not re.fullmatch(r"[A-Za-z0-9-]{2,40}", cible):
        raise Refus(f"décision « {cible} » invalide")
    v = json.loads(valeur or "{}")
    if v.get("statut") not in ("tranchee", "plus_tard"):
        raise Refus("statut de décision invalide")
    fichier = SERIE / "decisions.yaml"
    donnees = lire_yaml(fichier, {"decisions": {}})
    donnees.setdefault("decisions", {})
    donnees["decisions"][cible] = {"statut": v["statut"], "choix": v.get("choix") or None, "note": v.get("note") or None,
                                   "le": maintenant().date().isoformat()}
    ecrire_yaml(fichier, donnees, "# Décisions tranchées depuis l'admin (A8). AMBIGUITES.md reste le journal ; les corrections\n"
                                  "# se font ensuite avec /corriger. Format : identifiant → statut, choix, note, date.\n")
    return f"décision {cible} : {v['statut']}" + (f" ({v.get('choix')})" if v.get("choix") else "")


def mesurer(cible: str, valeur: str) -> str:
    n = cle_episode(cible)
    v = json.loads(valeur or "{}")
    e = etat()["episodes"].get(n, {})
    if e.get("statut") not in ("publie", "mesure"):
        raise Refus(f"Nº {n} n'est pas publié")
    fichier = SERIE / "mesures" / f"{n}.yaml"
    donnees = lire_yaml(fichier, {})
    donnees["episode"] = n
    donnees["publie_le"] = str(e.get("publie_le"))
    for periode in ("h48", "j7"):
        chiffres = {k: int(x) for k, x in (v.get(periode) or {}).items() if str(x).isdigit()}
        if chiffres:
            donnees[periode] = {**(donnees.get(periode) or {}), **chiffres}
    donnees["saisi_le"] = maintenant().date().isoformat()
    ecrire_yaml(fichier, donnees)
    message = f"chiffres du Nº {n} enregistrés dans mesures/{n}.yaml"
    complet = all(k in (donnees.get("j7") or {}) for k in ("impressions", "reactions", "enregistrements", "partages"))
    if complet and e.get("statut") == "publie":
        serie("statut", n, "mesure")
        message += " ; passé à « mesuré »"
    return message


def pilote(_cible: str, valeur: str) -> str:
    if valeur not in ("github", "windows"):
        raise Refus("pilote : github ou windows")
    fichier = SERIE / "publier" / "linkedin" / "pilote.txt"
    fichier.write_text(valeur + "\n", encoding="utf-8", newline="\n")
    return f"pilote de la tournée : {valeur}"


def reporter(cible: str, valeur: str) -> str:
    cle = cible if cible.startswith("bilan-") else cle_episode(cible)
    m = re.fullmatch(r"\s*(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})\s*", valeur)
    if not m:
        raise Refus(f"date « {valeur} » : AAAA-MM-JJ HH:MM attendu")
    quand = dt.datetime(*map(int, m.groups()))
    pilote_actuel = (SERIE / "publier" / "linkedin" / "pilote.txt").read_text(encoding="utf-8").strip()
    # La tournée GitHub ne passe que du mardi au vendredi, de 8 h à 10 h 55 (linkedin.yml) : un post placé ailleurs
    # ne partirait jamais seul.
    if pilote_actuel == "github" and not (1 <= quand.weekday() <= 4 and (8, 0) <= (quand.hour, quand.minute) <= (10, 55)):
        raise Refus("la tournée GitHub passe du mardi au vendredi, de 8 h à 10 h 55 : choisissez un créneau dans ces jours et ces heures")
    return serie("reporter", cle, valeur)


GESTES = {"valider": valider, "corriger": corriger, "recette": recette, "trancher": trancher, "mesurer": mesurer,
          "pilote": pilote, "reporter": reporter}


def journaliser(geste: str, cible: str, valeur: str, resultat: str, tournee: str) -> None:
    fichier = SERIE / "publier" / "linkedin" / "journal-admin.yaml"
    donnees = lire_yaml(fichier, {"gestes": []})
    court = valeur if len(valeur) <= 80 else valeur[:77] + "…"
    if geste in ("corriger", "recette", "trancher", "mesurer"):
        court = ""  # le détail est dans le fichier écrit
    donnees.setdefault("gestes", []).append({k: x for k, x in {
        "le": maintenant().isoformat(), "geste": geste, "cible": cible or None, "valeur": court or None,
        "resultat": resultat[:200], "tournee": tournee or None}.items() if x})
    donnees["gestes"] = donnees["gestes"][-300:]
    ecrire_yaml(fichier, donnees, "# Journal des gestes lancés depuis l'admin (salle de publication comprise).\n")


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser()
    p.add_argument("--geste", required=True)
    p.add_argument("--cible", default="")
    p.add_argument("--valeur", default="")
    p.add_argument("--resultat", default="")
    p.add_argument("--tournee", default="")
    a = p.parse_args()
    if a.geste == "journal":
        geste, _, cible = a.cible.partition(":")
        journaliser(geste, cible, a.valeur, a.resultat, a.tournee)
        return 0
    if a.geste not in GESTES:
        annoter("error", "Refus", f"geste inconnu : {a.geste}")
        return 1
    try:
        message = GESTES[a.geste](a.cible, a.valeur)
    except Refus as exc:
        annoter("error", "Refus", str(exc))
        journaliser(a.geste, a.cible, a.valeur, f"refus : {exc}", a.tournee)
        return 1
    except (json.JSONDecodeError, ValueError) as exc:
        annoter("error", "Refus", f"valeur illisible : {exc}")
        return 1
    annoter("notice", "Fait", message)
    journaliser(a.geste, a.cible, a.valeur, f"ok : {message}", a.tournee)
    return 0


if __name__ == "__main__":
    sys.exit(main())
