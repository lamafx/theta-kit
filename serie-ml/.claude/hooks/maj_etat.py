"""Stop : à la fin de chaque réponse, `serie etat --maj` (11.6) : un épisode relu dont une entrée a changé
repasse à « généré », pour qu'une interruption ne fasse rien perdre. Ne bloque jamais la réponse."""

from __future__ import annotations

import subprocess
import sys

from _commun import RACINE, lire_entree


def main() -> None:
    lire_entree()
    try:
        subprocess.run([sys.executable, "-m", "serie", "--racine", str(RACINE), "etat", "--maj"], cwd=RACINE,
                       capture_output=True, timeout=60)
    except (OSError, subprocess.SubprocessError):
        pass


if __name__ == "__main__":
    main()
    sys.exit(0)
