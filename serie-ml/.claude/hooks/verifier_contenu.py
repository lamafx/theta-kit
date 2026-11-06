"""PostToolUse : après chaque écriture d'un fichier contenu/NN.yaml, `serie verifier NN --sans-mesures` (11.6).

Une erreur bloquante est renvoyée à l'agent (code 2), qui corrige avant de continuer. Les mesures dans
Chromium (débordements, glyphes, remplissage) restent à l'étape de vérification complète de /episode.
contenu/bilan-N.yaml : seul le schéma est contrôlé.
"""

from __future__ import annotations

import re
import subprocess
import sys

from _commun import RACINE, chemin_absolu, lire_entree, refuser, relatif

SCHEMA_BILAN = ("import sys, yaml; from serie.schemas import ContenuBilan; "
                "ContenuBilan.model_validate(yaml.safe_load(open(sys.argv[1], encoding='utf-8')))")


def commande(rel: str | None) -> list[str] | None:
    """La commande à lancer pour un fichier écrit, ou None s'il n'est pas un contenu."""
    if rel is None:
        return None
    if m := re.fullmatch(r"contenu/(\d{2})\.yaml", rel):
        return [sys.executable, "-m", "serie", "--racine", str(RACINE), "verifier", str(int(m[1])), "--sans-mesures"]
    if re.fullmatch(r"contenu/bilan-\d\.yaml", rel):
        return [sys.executable, "-c", SCHEMA_BILAN, str(RACINE / rel)]
    return None


def main() -> None:
    entree = lire_entree()
    if entree.get("tool_name") not in ("Write", "Edit", "MultiEdit"):
        return
    chemin = (entree.get("tool_input") or {}).get("file_path")
    cmd = commande(relatif(chemin_absolu(entree, chemin))) if chemin else None
    if cmd is None:
        return
    r = subprocess.run(cmd, cwd=RACINE, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        sortie = (r.stdout + r.stderr).splitlines()
        utiles = [l for l in sortie if "erreur bloquante" in l or l.startswith(("Résultat", "Erreur"))]
        refuser("serie verifier a trouvé des erreurs bloquantes ; corrige le contenu avant de continuer.\n"
                + "\n".join((utiles or sortie)[-40:]))


if __name__ == "__main__":
    main()
    sys.exit(0)
