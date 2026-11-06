"""SessionStart : si .session-design est resté à la racine, les dossiers de design sont déverrouillés.

Avertit l'utilisateur (systemMessage) et l'agent (additionalContext) : dans une session normale, le fichier
doit être supprimé ; dans une session de design, l'agent le supprime lui-même à la fin, une fois la suite de
tests verte et le commit fait (BRIEF-SESSION-DESIGN.md, section 0). Ne bloque jamais le démarrage.
"""

from __future__ import annotations

import json
import sys

from _commun import RACINE, lire_entree

MESSAGE = (".session-design est présent à la racine du dépôt : gabarits/, bibliotheque/, charte/, design/ et "
           "tests/reference/ sont déverrouillés. Si cette session n'est pas une session de design, supprimez-le.")
CONSIGNE = (MESSAGE + " Agent : demande à l'utilisateur si c'est une session de design avant toute écriture dans "
            "ces dossiers ; si oui, supprime .session-design toi-même à la fin, après la suite verte et le commit.")


def main() -> None:
    lire_entree()
    if not (RACINE / ".session-design").exists():
        return
    sys.stdout.reconfigure(encoding="utf-8")
    print(json.dumps({"systemMessage": MESSAGE,
                      "hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": CONSIGNE}},
                     ensure_ascii=False))


if __name__ == "__main__":
    main()
    sys.exit(0)
