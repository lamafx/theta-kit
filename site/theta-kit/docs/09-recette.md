# 09 · Recette avant mise en ligne

Faire passer chaque point sur l'URL de prévisualisation Vercel. Captures Playwright à joindre au compte rendu.

## Gabarits à tester (Playwright `devices`)

| Appareil | Viewport | Notes |
|---|---|---|
| iPhone SE | 375 × 667 | petit écran, Safari |
| iPhone 15 Pro | 393 × 852 | encoche, safe-area |
| Pixel 7 | 412 × 915 | Chrome Android |
| Galaxy A (bas de gamme) | 360 × 800 + CPU ×4 plus lent | qualité 3D « low » attendue |
| iPad Mini portrait / paysage | 768 × 1024 / 1024 × 768 | |
| iPad Pro 12,9 | 1024 × 1366 | |
| Portable | 1366 × 768 | |
| Bureau | 1440 × 900 et 1920 × 1080 | |

## Liste de contrôle

**Général**
- [ ] FR et EN sur chaque page, sélecteur de langue garde la page, aucun texte non traduit hors exceptions de `docs/04`
- [ ] Aucun tiret long dans les textes affichés (`grep` sur le HTML généré)
- [ ] Le numéro de téléphone n'apparaît nulle part
- [ ] Couleurs : seulement celles de `docs/01`
- [ ] Lighthouse mobile : Performance ≥ 85, Accessibilité ≥ 95, SEO ≥ 95
- [ ] `prefers-reduced-motion` : aucune animation lourde, 3D remplacée par une image
- [ ] WebGL désactivé (`--disable-webgl`) : toutes les pages restent utilisables

**Accueil**
- [ ] Chargement une seule fois par session
- [ ] Robot : au moins 3 expressions différentes en 20 s, réagit au toucher (mobile) et au survol (bureau), ne se confond pas avec le θ
- [ ] Chaque carte : la couverture télécharge le PDF ; « Télécharger le PDF » fonctionne sur iOS (ouvre le PDF), Android et bureau
- [ ] « Passer la section » saute bien au créateur
- [ ] « Recevoir par e-mail » : contact créé chez le fournisseur, e-mail reçu avec le bon PDF dans la bonne langue
- [ ] Formulaire principal : cas valide, e-mail invalide, aucun intérêt, consentement manquant, champ piège
- [ ] Bureau : défilement continu jusqu'au voyage sans clic ; mobile : bouton

**Voyage et labo**
- [ ] Toutes les portes = épisodes du dossier `contenu/` dans l'ordre, brouillons signalés
- [ ] Portrait et paysage corrects, glisser au doigt
- [ ] Chaque thème du labo se charge depuis son URL et depuis la carte de l'épisode

**Profil**
- [ ] Photo, nom, parallaxe (bureau), 3D
- [ ] Projets filtrables, contenus conformes à `data/projets.json`
- [ ] Preuves : 4 éléments, visionneuse, « Ouvrir le fichier » ouvre le bon JPG ou PDF
- [ ] « Télécharger mon CV » : bon fichier
- [ ] LinkedIn `https://www.linkedin.com/in/kamagate-ladji-lama-02a18429b`, GitHub `https://github.com/lamafx`, e-mail

**Pages épisodes et SEO**
- [ ] `/fr/episodes/01` à `03` complètes ; Open Graph = couverture (tester avec le LinkedIn Post Inspector)
- [ ] `sitemap.xml`, `robots.txt`, `hreflang`
- [ ] Ajouter un faux `contenu/11.yaml` sur une branche : l'épisode apparaît partout après déploiement, puis supprimer
