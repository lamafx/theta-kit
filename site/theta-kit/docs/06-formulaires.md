# 06 · Formulaires et e-mails

Deux formulaires dans le prototype (`reference/Main.dc.html`, méthodes `subscribe`, `requestPdf`, `sendRec`). Les deux appellent `POST /api/inscription`.

## Charge utile (identique au prototype)

```jsonc
// Inscription (section #inscription)
{ "type": "inscription", "email": "x@y.com", "prenom": "Awa", "interets": ["pdf", "newsletter"],
  "consentement": true, "source": "site-theta", "locale": "fr", "date": "2026-11-06T10:00:00Z" }

// Demande d'un PDF précis (modale « Recevoir par e-mail » d'une carte)
{ "type": "pdf", "email": "x@y.com", "episode": "03", "titre": "Les trois familles d’apprentissage",
  "newsletter": true, "consentement": true, "source": "site-theta", "locale": "fr", "date": "..." }
```

## Côté client (garder le comportement du prototype)

- Validation e-mail `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`, au moins un intérêt, case de consentement obligatoire.
- Champ piège invisible (`name="website"`) : s'il est rempli, afficher « merci » sans rien envoyer.
- États : `idle`, `sending`, `done`, `bad` ; messages FR/EN depuis `messages/*.json`.

## Côté serveur `app/api/inscription/route.ts`

1. Valider avec zod, refuser si `consentement !== true`.
2. Limiter : 5 requêtes / 10 min / IP (Vercel KV, Upstash ou en mémoire pour commencer).
3. Envoyer au fournisseur choisi par `INSCRIPTION_PROVIDER` :
   - `brevo` (proposé) : `POST https://api.brevo.com/v3/contacts` avec `updateEnabled: true`, attributs `PRENOM`, `LANGUE`, `SOURCE`, et listes `BREVO_LIST_PDF` / `BREVO_LIST_NEWSLETTER` selon les intérêts. Pour `type: "pdf"` : e-mail transactionnel (modèle `BREVO_TEMPLATE_PDF`) avec le lien absolu du PDF de l'épisode, dans la langue du visiteur.
   - `automatisation` : si l'automatisation Théta a déjà une liste d'abonnés ou un service d'envoi, transmettre la charge utile à `AUTOMATION_WEBHOOK_URL` signée par `AUTOMATION_SECRET` (HMAC SHA-256 dans l'en-tête `x-theta-signature`).
   - `webhook` : n'importe quelle URL (`FORM_ENDPOINT`), comme la prop `formEndpoint` du prototype.
4. Répondre `{ ok: true }` ou `{ ok: false, error }` avec le bon code HTTP.

**Double opt-in recommandé** (Brevo le gère) : l'abonné confirme son adresse avant de recevoir la newsletter.

## Confidentialité

Le texte des modales Confidentialité et Mentions légales du prototype est la base. À compléter :
- hébergeur : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (à vérifier sur vercel.com/legal au moment de la mise en ligne) ;
- sous-traitant e-mail (Brevo ou autre) ;
- durée de conservation, droit de désinscription (lien dans chaque e-mail + `mailto` de désinscription déjà présent).
- Aucun cookie publicitaire. Vercel Analytics n'utilise pas de cookie.

## Variables d'environnement

```
INSCRIPTION_PROVIDER=brevo        # brevo | automatisation | webhook
BREVO_API_KEY=
BREVO_LIST_PDF=
BREVO_LIST_NEWSLETTER=
BREVO_TEMPLATE_PDF=
BREVO_SENDER_EMAIL=
FORM_ENDPOINT=
AUTOMATION_WEBHOOK_URL=
AUTOMATION_SECRET=
NEXT_PUBLIC_SITE_URL=https://theta-ml.vercel.app
```
