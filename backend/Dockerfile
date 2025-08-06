FROM php:8.4.8-fpm

# Set working dir
WORKDIR /var/www

# Install system deps
RUN apt-get update && apt-get install -y \
    git unzip curl libicu-dev libonig-dev libzip-dev libpq-dev libxml2-dev libpng-dev \
    && docker-php-ext-install intl pdo pdo_mysql zip opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy files
COPY . .

# Install Symfony deps
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Permissions (optionnel)
RUN chown -R www-data:www-data /var/www

EXPOSE 9000
CMD ["php-fpm"]
