#!/bin/bash

set -e

JWT_DIR="/var/www/html/config/jwt"

if [[ "$FORCE_JWT_REGEN" == "1" ]]; then
  echo "♻️ Régénération forcée des clés JWT..."
  rm -f "$JWT_DIR/private.pem" "$JWT_DIR/public.pem"
fi

if [[ ! -f "$JWT_DIR/private.pem" || ! -f "$JWT_DIR/public.pem" ]]; then
  echo "🔑 Génération des clés JWT..."
  php bin/console lexik:jwt:generate-keypair --no-interaction
else
  echo "✅ Clés JWT déjà présentes."
fi

# ✅ Fixer les permissions sur les clés JWT
echo "🔐 Correction des permissions sur les clés JWT..."
chown -R www-data:www-data "$JWT_DIR"
chmod 600 "$JWT_DIR/private.pem"
chmod 644 "$JWT_DIR/public.pem"

# 🧹 Nettoyage et préchauffage du cache Symfony
echo "🧹 Nettoyage du cache Symfony..."
php bin/console cache:clear --no-warmup --no-interaction || true
php bin/console cache:clear --env=prod || true

# 🛠️ Exécution des migrations Doctrine
echo "🛠️ Exécution des migrations de base de données..."
php bin/console doctrine:migrations:migrate --no-interaction || true

# 🚀 Lancement du serveur Apache
echo "🚀 Démarrage d'Apache..."
exec apache2-foreground
