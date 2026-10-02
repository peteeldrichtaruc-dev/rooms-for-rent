#!/bin/sh
set -e

echo "Starting container setup..."

# 1. Install PHP dependencies
if [ ! -d "vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# 2. Setup .env file
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    php artisan key:generate
fi

# 3. Install Node dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing NPM packages..."
    npm install --legacy-peer-deps
fi

# 4. Wait for PostgreSQL to be completely ready
echo "Waiting for PostgreSQL database connection..."
until php artisan db:monitor > /dev/null 2>&1 || php -r "
    try {
        $pdo = new PDO('pgsql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT').';dbname='.getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));
        exit(0);
    } catch (Exception \$e) {
        exit(1);
    }
"; do
    sleep 1
done

# 5. Run Database Migrations First (Do NOT chain --seed here)
echo "Wiping and running database migrations..."
php artisan migrate:fresh --force

# 6. Run Database Seeding as a separate step
echo "Running Database Seeders..."
php artisan db:seed --force

# 7. Build frontend assets
echo "Building frontend assets..."
npm run build

# Fix permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

echo "Setup finished successfully! Starting Supervisor..."
exec "$@"
