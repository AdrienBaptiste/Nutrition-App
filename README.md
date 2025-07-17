# Nutrition-App

Te ultimate final projet to get my diploma and to become the best version of me. I have 1 mont.

# 🍽️ Nutrition App

Projet fullstack avec un frontend React (Vite), un backend Symfony, une base MySQL et une configuration Docker pour le développement.

---

## 📁 Structure du projet

```
.
├── backend/              # API Symfony
├── frontend/             # Application React (Vite)
├── docker-compose.yml    # Orchestration Docker
├── .vscode/              # Configuration VS Code (formatage, linting)
├── .gitignore
└── README.md
```

---

## 🚀 Démarrage rapide

### 🧱 Prérequis

- [Docker](https://www.docker.com/)
- [Node.js (>=18)](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)
- (optionnel) [Symfony CLI](https://symfony.com/download)

---

### 🔧 Installation locale

1. **Cloner le repo**

```bash
git clone <url-du-repo>
cd <nom-du-projet>
```

2. **Lancer les conteneurs Docker**

```bash
docker-compose up -d --build
```

3. **Installer les dépendances**

#### Frontend (React + Vite)

```bash
cd frontend
npm install
```

#### Backend (Symfony)

```bash
cd backend
composer install
```

---

## 🧪 Développement

### Frontend

```bash
cd frontend
npm run dev
```

### Backend

```bash
cd backend
symfony serve
```

---

## 🧹 Lint & Format

Le projet utilise **ESLint (Flat config)** et **Prettier** pour un code propre et cohérent.

### ➕ Dépendances installées

- ESLint
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-import
- eslint-plugin-react-refresh
- typescript-eslint
- Prettier

### 📦 Scripts disponibles

Dans `frontend/package.json` :

```json
"scripts": {
  "lint": "eslint .",
  "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,md}\""
}
```

---

## 🧠 VS Code – Recommandations

Le projet inclut une config VS Code partagée (`.vscode/`) :

- 📄 `settings.json` : Formatage automatique, intégration ESLint
- 📄 `extensions.json` : Recommandation d'extensions utiles

### 🔧 Extensions recommandées

> Si tu ouvres le projet avec **VS Code** ou autre IDE basé sur VS Code, une popup te proposera ces extensions :

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

## 🛠️ Variables d’environnement

Ajoute les fichiers suivants :

- `frontend/.env` ➝ base Vite (`VITE_API_URL=...`)
- `backend/.env.local` ➝ Symfony secrets

Des fichiers `.env.example` sont à disposition dans chaque dossier.

---

## ⚙️ Docker Services

- **frontend** : React App (port 5173)
- **backend** : Symfony API (port 8000)
- **mysql** : base de données (port 3306)
- **phpmyadmin** : interface pour gérer la base de données (port 8080)
