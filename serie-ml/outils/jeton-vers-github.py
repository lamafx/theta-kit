"""Copie le jeton LinkedIn du gestionnaire d'identifiants Windows vers le secret GitHub THETA_LINKEDIN_JETON.

À lancer après chaque `serie linkedin connecter` (le jeton dure 60 jours), depuis serie-ml/ :

    .venv\\Scripts\\python.exe outils\\jeton-vers-github.py

Le jeton n'est ni affiché ni écrit sur le disque ; seule sa date d'expiration est notée dans
publier/linkedin/jeton.txt (lue par l'admin), à commiter. L'accès à GitHub est celui que Git utilise déjà pour `git push`
(Gestionnaire d'identifiants Git) ; le secret est chiffré avec la clé publique du dépôt, comme l'exige GitHub.
Dépendance : pynacl (pip install pynacl).
"""

from __future__ import annotations

import base64
import json
import subprocess
import sys
import urllib.request

DEPOT = "lamafx/theta-kit"
SECRET = "THETA_LINKEDIN_JETON"


def acces_github() -> str:
    sortie = subprocess.run(["git", "credential", "fill"], input="protocol=https\nhost=github.com\n\n",
                            capture_output=True, text=True, check=True).stdout
    for ligne in sortie.splitlines():
        if ligne.startswith("password="):
            return ligne.removeprefix("password=")
    raise SystemExit("Aucun accès GitHub dans le gestionnaire d'identifiants Git : faites d'abord un git push.")


def appeler(methode: str, chemin: str, jeton: str, donnees: dict | None = None) -> dict:
    requete = urllib.request.Request(
        f"https://api.github.com/repos/{DEPOT}{chemin}", method=methode,
        data=json.dumps(donnees).encode() if donnees is not None else None,
        headers={"Authorization": f"Bearer {jeton}", "Accept": "application/vnd.github+json",
                 "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "theta-serie"})
    with urllib.request.urlopen(requete, timeout=30) as r:
        corps = r.read()
    return json.loads(corps) if corps else {}


def main() -> int:
    import keyring
    from nacl import encoding, public

    valeur = keyring.get_password("theta-linkedin", "jeton")
    if not valeur:
        raise SystemExit("Pas de jeton LinkedIn : lancez d'abord « serie linkedin connecter ».")
    expire = json.loads(valeur).get("expire_le", "?")
    jeton = acces_github()
    cle = appeler("GET", "/actions/secrets/public-key", jeton)
    boite = public.SealedBox(public.PublicKey(cle["key"].encode(), encoding.Base64Encoder()))
    chiffre = base64.b64encode(boite.encrypt(valeur.encode())).decode()
    appeler("PUT", f"/actions/secrets/{SECRET}", jeton, {"encrypted_value": chiffre, "key_id": cle["key_id"]})
    print(f"Secret {SECRET} mis à jour sur {DEPOT} (jeton valable jusqu'au {expire[:10]}).")
    if expire[:4].isdigit():
        from pathlib import Path

        fichier = Path(__file__).resolve().parent.parent / "publier" / "linkedin" / "jeton.txt"
        fichier.write_text(expire[:10] + "
", encoding="utf-8", newline="
")
        print(f"Date d'expiration notée dans {fichier.relative_to(fichier.parents[2]).as_posix()} : à commiter.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
