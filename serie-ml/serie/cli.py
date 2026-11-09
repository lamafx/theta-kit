"""Interface en ligne de commande : serie etat, etape, reprendre, valider, rendre, publier, verifier, images, linkedin."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from serie.depot import Depot
from serie.etat import afficher_etat
from serie.validation import Rapport, valider_depot


def _utf8() -> None:
    # La console Windows n'est pas toujours en UTF-8 : θ, « » et → doivent passer.
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass


def formater_rapport(r: Rapport) -> str:
    lignes = [f"Fiches : {r.fichiers_fiches - len(r.fiches_invalides)}/{r.fichiers_fiches} valides"]
    for nom in r.fiches_invalides:
        lignes.append(f"  invalide : {nom}")

    if r.provenance is not None:
        p = r.provenance
        lignes += ["", f"Provenance : {p.document}, version {p.version_document}, exportée le {p.exporte_le}"]
        for c in r.comparaisons:
            etat = "OK" if c.ok else "ÉCART"
            lignes.append(f"  {c.cle:<26} attendu {c.attendu:>4}   trouvé {c.trouve:>4}   {etat}")

    if r.erreurs:
        lignes += ["", f"Erreurs bloquantes ({len(r.erreurs)}) :"]
        lignes += [f"  {d}" for d in r.erreurs]
    if r.avertissements:
        lignes += ["", f"Avertissements ({len(r.avertissements)}) :"]
        lignes += [f"  {d}" for d in r.avertissements]
    if r.informations:
        lignes += ["", "Informations :"]
        lignes += [f"  {i}" for i in r.informations]

    lignes += ["", "Résultat : " + ("import conforme" if r.ok else "import NON conforme")]
    return "\n".join(lignes)


def main(argv: list[str] | None = None) -> int:
    _utf8()
    parser = argparse.ArgumentParser(prog="serie", description="Générateur de la série θ Théta.")
    parser.add_argument("--racine", help="dossier du dépôt (par défaut : celui du générateur)")
    sous = parser.add_subparsers(dest="commande", required=True)
    etat = sous.add_parser("etat", help="où en est chaque épisode")
    etat.add_argument("--maj", action="store_true", help="repasser à « généré » un épisode relu dont une entrée a changé")
    sous.add_parser("decisions", help="rassembler les décisions D des relectures dans sortie/decisions.md")
    etape = sous.add_parser("etape", help="enregistrer une étape faite (date et empreinte de ses entrées)")
    etape.add_argument("numero", type=int)
    etape.add_argument("nom", help="lecture, sources, contenu, images, rendu, verification, relecture, linkedin, publication")
    reprendre = sous.add_parser("reprendre", help="première étape à faire ou à refaire d'un épisode")
    reprendre.add_argument("numero", type=int)
    statut = sous.add_parser("statut", help="passer un épisode (8) ou un bilan (bilan-1) à relu, publie, mesure ou genere")
    statut.add_argument("cle", help="numéro d'épisode, ou bilan-N")
    statut.add_argument("statut", choices=["genere", "relu", "publie", "mesure"])
    statut.add_argument("--le", help="date de publication, AAAA-MM-JJ (obligatoire pour publie)")
    reporter = sous.add_parser("reporter", help="déplacer la date d'un seul post (épisode ou bilan-N), entre le précédent et le suivant")
    reporter.add_argument("cle", help="numéro d'épisode, ou bilan-N")
    reporter.add_argument("quand", help="nouvelle date, heure d'Abidjan : « AAAA-MM-JJ HH:MM »")
    bilan = sous.add_parser("bilan", help="rendre le post bilan d'une saison : sortie/bilan-N/")
    bilan.add_argument("saison", type=int)
    bilan.add_argument("--contenu", help="fichier de contenu (par défaut contenu/bilan-N.yaml)")
    bilan.add_argument("--sortie", help="dossier de sortie (par défaut sortie/bilan-N/)")
    bilan.add_argument("--publier", action="store_true", help="écrire aussi publier/bilan-N/ (PDF, titre, texte, date)")
    sous.add_parser("valider", help="valider les fiches et comparer l'import à provenance.yaml")
    rendre = sous.add_parser("rendre", help="rendre un épisode : sortie/NN/page-XX.png et le carrousel PDF")
    rendre.add_argument("numero", type=int)
    rendre.add_argument("--contenu", help="fichier de contenu à rendre (par défaut contenu/NN.yaml)")
    rendre.add_argument("--sortie", help="dossier de sortie (par défaut sortie/NN/)")
    publier = sous.add_parser("publier", help="dossier publier/NN/ : PDF, titre, texte du post, premier commentaire, date")
    publier.add_argument("numero", type=int)
    publier.add_argument("--contenu", help="fichier de contenu (par défaut contenu/NN.yaml)")
    publier.add_argument("--sortie", help="dossier de publication (par défaut publier/NN/)")
    publier.add_argument("--rendu", help="dossier du rendu (par défaut sortie/NN/)")
    verifier = sous.add_parser("verifier", help="contrôles d'un épisode : sortie/NN/verification.md")
    verifier.add_argument("numero", type=int)
    verifier.add_argument("--contenu", help="fichier de contenu (par défaut contenu/NN.yaml)")
    verifier.add_argument("--sources", help="dossier des extraits (par défaut sources/NN/)")
    verifier.add_argument("--rapport", help="fichier du rapport (par défaut sortie/NN/verification.md)")
    verifier.add_argument("--sans-mesures", action="store_true", help="ne pas mesurer les pages dans Chromium")
    images = sous.add_parser("images", help="images réelles : recherche et téléchargement des candidates")
    images.add_argument("numero", type=int)
    images.add_argument("--contenu", help="fichier de contenu (par défaut contenu/NN.yaml)")
    images.add_argument("--lister", action="store_true", help="lister les candidates déjà téléchargées")
    images.add_argument("--ajouter", metavar="URL_FICHIER", help="ajouter une candidate trouvée à la main")
    for option in ("page-source", "titre", "auteur", "date", "source", "licence", "conditions", "lien-licence",
                   "description"):
        images.add_argument(f"--{option}", default="")
    linkedin = sous.add_parser("linkedin", help="publication automatique sur LinkedIn (API officielle)")
    actions = linkedin.add_subparsers(dest="action", required=True)
    actions.add_parser("connecter", help="autoriser l'application dans le navigateur ; jeton dans le gestionnaire d'identifiants")
    actions.add_parser("etat", help="connexion, validité du jeton, post dû")
    for nom, aide in (("apercu", "ce qui partirait pour un épisode ou un bilan, et les refus"),
                      ("publier", "publier un épisode ou un bilan maintenant")):
        a = actions.add_parser(nom, help=aide)
        a.add_argument("numero", help="numéro d'épisode, ou bilan-N")
        a.add_argument("--hors-calendrier", action="store_true", help="ignorer l'heure prévue (post manqué)")
        a.add_argument("--oui", action="store_true", help="envoyer pour de bon")
    essai = actions.add_parser("essai", help="tester l'envoi du PDF ; avec --poster, un post de test aussitôt supprimé")
    essai.add_argument("numero", type=int, nargs="?", default=1)
    essai.add_argument("--poster", action="store_true")
    actions.add_parser("tourner", help="publier le post dû (lancé toutes les 5 minutes par le Planificateur de tâches)")
    supprimer = actions.add_parser("supprimer", help="supprimer un post publié (l'épisode revient à « relu »)")
    supprimer.add_argument("numero", help="numéro d'épisode, ou bilan-N")
    supprimer.add_argument("--oui", action="store_true", help="supprimer pour de bon")
    planifier = actions.add_parser("planifier", help="créer (ou --retirer) la tâche planifiée Windows")
    planifier.add_argument("--retirer", action="store_true")
    args = parser.parse_args(argv)

    depot = Depot(args.racine)
    if args.commande == "decisions":
        from serie.decisions import rassembler

        chemin, decisions = rassembler(depot)
        print(f"{len(decisions)} décisions : {chemin.relative_to(depot.racine).as_posix()}")
        return 0
    if args.commande == "etat":
        if args.maj:
            from serie.reprise import mettre_a_jour

            for ligne in mettre_a_jour(depot):
                print(ligne)
        print(afficher_etat(depot))
        return 0
    if args.commande == "etape":
        from serie.reprise import enregistrer_etape

        ep = enregistrer_etape(depot, args.numero, args.nom)
        print(f"Nº {args.numero:02d} : étape « {args.nom} » enregistrée ; statut {ep['statut']}")
        return 0
    if args.commande == "reprendre":
        from serie.reprise import etapes_a_refaire

        a_refaire = etapes_a_refaire(depot, args.numero)
        if not a_refaire:
            print(f"Nº {args.numero:02d} : toutes les étapes sont faites et à jour")
        for etape, raison in a_refaire:
            print(f"{etape} : {raison}")
        return 0
    if args.commande == "statut":
        import datetime as dt

        from serie.reprise import changer_statut

        try:
            le = dt.date.fromisoformat(args.le) if args.le else None
            entree = changer_statut(depot, args.cle, args.statut, le)
        except ValueError as exc:
            print(f"Erreur bloquante : {exc}", file=sys.stderr)
            return 1
        print(f"{args.cle} : statut {entree['statut']}" + (f", publié le {entree['publie_le']}" if entree.get("publie_le") else ""))
        return 0
    if args.commande == "reporter":
        import datetime as dt

        from serie.calendrier import date_en_clair
        from serie.report import lire_quand, reporter as deplacer

        try:
            avant, apres = deplacer(depot, args.cle, lire_quand(args.quand), dt.datetime.now(dt.timezone.utc))
        except ValueError as exc:
            print(f"Erreur bloquante : {exc}", file=sys.stderr)
            return 1
        print(f"{args.cle} : {date_en_clair(avant, 'Africa/Abidjan')} → {date_en_clair(apres, 'Africa/Abidjan')}")
        return 0
    if args.commande == "bilan":
        from serie.rendu import ErreurRendu, rendre_bilan

        if args.publier:
            from serie.diagnostics import bloquants
            from serie.publication import ErreurPublication, publier_bilan

            try:
                pub = publier_bilan(depot, args.saison, Path(args.contenu) if args.contenu else None)
            except ErreurPublication as exc:
                print(f"Erreur bloquante : {exc}", file=sys.stderr)
                return 1
            for d in pub.diagnostics:
                print(d)
            if pub.dossier is None or bloquants(pub.diagnostics):
                return 1
            print(pub.dossier.relative_to(depot.racine).as_posix())
            return 0
        try:
            resultat = rendre_bilan(depot, args.saison, Path(args.contenu) if args.contenu else None,
                                    Path(args.sortie) if args.sortie else None)
        except ErreurRendu as exc:
            print(f"Erreur bloquante : {exc}", file=sys.stderr)
            return 1
        for chemin in [*resultat.pngs, resultat.pdf]:
            print(chemin.relative_to(depot.racine).as_posix() if chemin.is_relative_to(depot.racine) else chemin)
        return 0
    if args.commande == "valider":
        rapport = valider_depot(depot)
        print(formater_rapport(rapport))
        return 0 if rapport.ok else 1
    if args.commande == "rendre":
        from serie.rendu import ErreurRendu, rendre_episode

        try:
            resultat = rendre_episode(depot, args.numero, Path(args.sortie) if args.sortie else None,
                                      Path(args.contenu) if args.contenu else None)
        except ErreurRendu as exc:
            print(f"Erreur bloquante : {exc}", file=sys.stderr)
            return 1
        for chemin in [*resultat.pngs, resultat.pdf]:
            print(chemin.relative_to(depot.racine).as_posix() if chemin.is_relative_to(depot.racine) else chemin)
        return 0
    if args.commande == "publier":
        from serie.publication import ErreurPublication, publier_episode
        from serie.rendu import ErreurRendu

        chemins = {k: Path(v) if v else None for k, v in
                   (("contenu", args.contenu), ("sortie", args.sortie), ("rendu", args.rendu))}
        try:
            pub = publier_episode(depot, args.numero, **chemins)
        except (ErreurPublication, ErreurRendu) as exc:
            print(f"Erreur bloquante : {exc}", file=sys.stderr)
            return 1
        for d in pub.diagnostics:
            print(d, file=sys.stderr if d.niveau.name == "ERREUR" else sys.stdout)
        if pub.dossier is None:
            return 1
        for chemin in sorted(pub.dossier.rglob("*")):
            if chemin.is_file():
                print(chemin.relative_to(depot.racine).as_posix() if chemin.is_relative_to(depot.racine) else chemin)
        return 0
    if args.commande == "images":
        from serie import images as im
        from serie.rendu import chemin_contenu
        from serie.schemas import Contenu
        from serie.depot import lire_yaml

        dossier = im.dossier_candidats(depot.racine, args.numero)
        if args.ajouter:
            requis = {"page-source": args.page_source, "auteur": args.auteur, "licence ou conditions": args.licence or args.conditions}
            manquants = [k for k, v in requis.items() if not v]
            if manquants:
                print(f"Erreur : à préciser : {', '.join(manquants)}", file=sys.stderr)
                return 1
            c = im.Candidate(args.titre or Path(args.ajouter).name, args.auteur, args.date or "inconnue", args.page_source,
                             args.ajouter, args.source or args.auteur, args.licence, args.conditions,
                             args.lien_licence or None, args.description, 0, 0)
            chemin = im.ajouter_candidate(dossier, c)
            fiche = im.FicheImage.model_validate(lire_yaml(im.fiche_de(chemin)))
            print(f"{chemin.relative_to(depot.racine).as_posix()} : {im.LIBELLES_CLASSES[fiche.classe]} ({fiche.verification})")
            return 0
        if args.lister:
            for chemin, f in im.lister_candidates(dossier):
                print(f"{chemin.name} : {im.LIBELLES_CLASSES[f.classe]} · {f.licence} · {f.largeur} × {f.hauteur} · {f.page_source}")
            return 0
        chemin = Path(args.contenu) if args.contenu else chemin_contenu(depot, args.numero)
        contenu = Contenu.model_validate(lire_yaml(chemin))
        for ligne in im.images_episode(depot.racine, contenu, args.numero):
            print(ligne)
        return 0
    if args.commande == "linkedin":
        from serie.linkedin import executer

        return executer(args, depot)
    if args.commande == "verifier":
        from serie.verification import verifier_episode

        v = verifier_episode(depot, args.numero, Path(args.contenu) if args.contenu else None,
                             sources=Path(args.sources) if args.sources else None, mesurer=not args.sans_mesures)
        rapport = Path(args.rapport) if args.rapport else depot.racine / "sortie" / f"{args.numero:02d}" / "verification.md"
        rapport.parent.mkdir(parents=True, exist_ok=True)
        rapport.write_text(v.rapport(), encoding="utf-8", newline="\n")
        for d in v.diagnostics:
            print(d)
        print(f"Résultat : {len(v.erreurs)} erreur(s) bloquante(s), {len(v.avertissements)} avertissement(s). "
              f"Rapport : {rapport}")
        return 0 if v.ok else 1
    return 2


if __name__ == "__main__":
    sys.exit(main())
