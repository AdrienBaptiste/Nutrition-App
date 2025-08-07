# Étape 1 : Construction avec Node.js
FROM node:18 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le contenu du projet dans le conteneur
COPY . ./

# Construire l'application avec Vite
RUN npm run build

# Étape 2 : Servir les fichiers statiques avec Nginx
FROM nginx:1.23

# Copier les fichiers construits (dossier dist) dans le dossier Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
