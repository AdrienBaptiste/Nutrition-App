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
composer install
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

---

## ⚙️ Fichiers d’environnement requis

### frontend/.env

```env
VITE_API_URL=http://localhost:8000
```

### backend/.env.local

```env
DATABASE_URL="mysql://admin:admin@db:3306/nutrition_app_db?serverVersion=8.0&charset=utf8mb4"
JWT_PASSPHRASE=your_passphrase
```

Des fichiers `.env.example` sont disponibles dans chaque dossier.

---

## 🚀 Build & Push des images (optionnel pour mise à jour DockerHub)

### Build des images

```bash
docker build -t tonuserdockerhub/frontend ./frontend
docker build -t tonuserdockerhub/backend ./backend
```

### Push sur DockerHub

```bash
docker push tonuserdockerhub/frontend
docker push tonuserdockerhub/backend
```

---

## 📦 Lint & Format (frontend)

```bash
# Linter
npm run lint

# Formatage automatique
npm run format
```

> Configuré avec **ESLint** (Flat Config) et **Prettier**

---

## 🧠 VS Code – Configuration

Fichier `.vscode/settings.json` intégré :

- Formatage auto
- ESLint & Prettier intégrés

---

## ✅ Check rapide avant push

- [ ] `.env` présent dans `frontend` et `backend`
- [ ] Clés JWT dans `backend/config/jwt/`
- [ ] Frontend buildé si nécessaire
- [ ] Test des routes API avec Postman / Front

---

## 🛠 Commandes de déploiement local complètes

```bash
# Lancer Docker
docker compose up -d

# Accéder à phpMyAdmin si besoin
# http://localhost:8080 (login: admin / admin)

# Générer les clés JWT (si manquantes)
docker exec -it <container_backend> bash
php bin/console lexik:jwt:generate-keypair

# Vérifier l’état des conteneurs
docker ps
```

---

## 👨‍💻 Auteur

Made with love and coffee by **@AdrienBaptiste**
