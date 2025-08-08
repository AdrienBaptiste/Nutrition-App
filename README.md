# 🍽️ Nutrition App

> 🎓 Projet final fullstack pour l’obtention de mon diplôme. Objectif : construire une stack professionnelle en 1 mois.

App web avec un **frontend React (Vite)**, un **backend Symfony**, une **base MySQL**, orchestrée avec **Docker** en développement, et déployée sur des services professionnels.

---

## 🌍 Hébergement en production

### ✅ **Frontend (React)**

- Hébergés et déployée sur [Vercel](https://vercel.com)

| Service                  | Branche | URL                                            |
| ------------------------ | ------- | ---------------------------------------------- |
| Production               | main    | https://nutrition-app-steel.vercel.app/        |
| Préproduction (protégée) | preprod | https://nutrition-app-steel-preprod.vercel.app |

### ✅ **Backend & BDD**

- Hébergés sur [AlwaysData](https://www.alwaysdata.com)
  - Symfony API
  - MySQL

Les clés JWT, la base de données et les environnements `.env` sont configurés pour respecter les contraintes de prod.

---

## 🚦 CI / CD / CD

### Frontend (Vercel)

- Chaque push sur `main` déclenche un build et un déploiement en production de `frontend/` sur Vercel.
- Chaque pull request/commit sur `preprod` déclenche un build et un déploiement de préproduction (protégée) avec URL preview.
- Build rapide grâce au cache Vercel (node_modules, artifacts) et au CDN pour l’invalidation instantanée.
  - Commande de build (Vercel): `npm ci && npm run build` dans `frontend/`.
  - La variable `VITE_API_URL` pointe vers l’API AlwaysData (sans slash final, ex: `https://api.example.com`).

### Backend (AlwaysData)

- Un workflow GitHub Actions pousse automatiquement le code de `backend/` vers un dépôt Git distant chez AlwaysData (git bare sur le serveur).
- Côté serveur, un hook `post-receive` exécute automatiquement les étapes de redéploiement:
  - `composer install --no-dev --optimize-autoloader`
  - migrations (si besoin) `php bin/console doctrine:migrations:migrate --no-interaction`
  - `php bin/console cache:clear --env=prod`
  - reload de PHP-FPM / app selon la config AlwaysData
  - Astuce réseau en cas d’erreurs HTTP/2 Packagist: `COMPOSER_MAX_PARALLEL_HTTP=1 composer install --no-interaction --prefer-dist --no-progress`

### Images Docker (CI)

- Deux workflows GitHub Actions buildent et pushent automatiquement les images vers Docker Hub lorsque des changements touchent:
  - `frontend/**` → image `frontend`
  - `backend/**` → image `backend`
- Déclencheurs: push sur `main` et `preprod` (et tags selon besoin). Les jobs utilisent le cache Buildx pour des builds rapides, puis `docker/login-action` et `docker/build-push-action` pour publier.

---

## 🧹 Qualité du code

- Frontend (`frontend/`)
  - ESLint (Flat Config) avec: `eslint-plugin-react`, `react-hooks`, `import`, `react-refresh`, `@eslint/js`, `typescript-eslint`.
  - Prettier pour le formatage.
  - Commandes: `npm run lint`, `npm run format`.
- Backend (`backend/`)
  - PHPStan (analyse statique) via `phpstan.neon.dist`.
  - Commande: `composer stan`.

### Installation Backend (Composer)

- Utiliser le lock pour des builds stables:
  ```bash
  cd backend
  composer install --no-interaction --prefer-dist --no-progress
  ```
- Si le réseau est capricieux (AlwaysData):
  ```bash
  COMPOSER_MAX_PARALLEL_HTTP=1 composer install --no-interaction --prefer-dist --no-progress
  ```

## 🧪 Tests & automatisation

- Frontend tests
  - Framework: `vitest` + `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, environnement `jsdom`.
  - Commandes: `npm run test`, `npm run test:watch`.
- Backend tests
  - Framework: `PHPUnit` (v11). Config: `backend/phpunit.xml.dist`.
  - Répertoire des tests: `backend/tests/` (ex: `tests/Smoke/HealthCheckTest.php`).
  - Commandes: `composer test` ou `vendor/bin/phpunit`.
- CI
  - Frontend: les tests Vitest s'exécutent dans `deploy-frontend-image.yml` avant le build/push Docker.
  - Backend: PHPUnit s'exécute dans `deploy-backend-image.yml` (si présent) et dans `deploy-api.yml` avant le push vers AlwaysData.
  - Analyse statique PHPStan exécutée dans `deploy-backend-image.yml`.
  - Vercel ne lance pas automatiquement les tests; ils sont gérés dans GitHub Actions.

---

## 📁 Structure du projet

```
.
├── backend/              # API Symfony
├── frontend/             # Application React (Vite)
├── docker-compose.yml    # Docker orchestration
├── .vscode/              # Configuration VS Code
├── .github/workflows/    # WWorkflow GitHub Actions
└── README.md
└── WORKFLOW.md
└── COMMIT_GUIDE.md
```

---

## 🐳 Déploiement local via Docker

L’environnement local utilise **Docker** avec les **images buildées** et **push sur DockerHub**, simulant un environnement de production.

### 1. 🔃 Récupération du projet

```bash
git clone https://github.com/AdrienBaptiste/Nutrition-App
cd Nutrition-App
```

### 2. 🐳 Lancement avec DockerHub

Copier les fichiers d'environement sous un nouveau nom :

```bash
cp backend/.env.example backend/.env.prod
cp frontend/.env.example frontend/.env.production
```

Lancer le projet avec les images DockerHub :

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Accès aux services

| Service       | URL                   |
| ------------- | --------------------- |
| Frontend      | http://localhost:3000 |
| Backend (API) | http://localhost:8000 |
| phpMyAdmin    | http://localhost:8080 |

---

## 🧪 Développement

> En mode développement manuel (hors Docker), tu peux toujours lancer les services indépendamment :

### 🔧 Frontend

```bash
cd frontend
npm install
npm run dev
```

### 🔧 Backend

```bash
cd backend
composer install --no-interaction --prefer-dist --no-progress
symfony serve
```

---

## 🔐 JWT / Auth

- Les clés JWT sont générées dans `config/jwt/` dans le container Docker.
- En dev local : tu peux les générer avec :

```bash
php bin/console lexik:jwt:generate-keypair
```

> Assure-toi que les droits sont corrects sur les fichiers `.pem`

### Variables d’environnement Backend

- À définir via `backend/.env` (exemples dans `backend/.env.example`). Ne jamais committer de secrets.
  - `APP_ENV`, `APP_DEBUG`, `APP_SECRET`
  - `CORS_ALLOW_ORIGIN` (regex accepté)
  - `DATABASE_URL`
  - `JWT_SECRET_KEY`, `JWT_PUBLIC_KEY`, `JWT_PASSPHRASE`
- Les chemins définis dans `.env` doivent correspondre aux fichiers générés (ex: `config/jwt/private.pem`, `config/jwt/public.pem`).

### Sécurité API

- Authentification JWT, rôles `ROLE_USER` et `ROLE_ADMIN`.
- Rate limiting sur les endpoints sensibles.
- Contrôles d’accès au niveau API Platform (providers/processors) avec vérifications d’appartenance et garde `instanceof User` pour éviter les erreurs de typage.

---

## 🚀 Images Docker (automatisées)

Le build & push des images est géré par GitHub Actions:

- Workflow 1: build/push `frontend` → Docker Hub
- Workflow 2: build/push `backend` → Docker Hub

> Les commandes manuelles restent possibles localement mais ne sont plus nécessaires dans le flux standard.

---

## ✅ Check rapide avant push

- [ ] `.env` présent dans `frontend` et `backend`
- [ ] Clés JWT dans `backend/config/jwt/`
- [ ] Frontend buildé si nécessaire
- [ ] Test des routes API avec Postman / Front

---

## 👨‍💻 Auteur

Made with love and coffee by **@AdrienBaptiste**
