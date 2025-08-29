#!/bin/sh

# Simple wait function
wait_for() {
    echo "Waiting for $1..."
    while ! nc -z $2 $3; do
        sleep 1
    done
    echo "$1 is ready!"
}

# Wait for services
wait_for "PostgreSQL" postgres 5432
wait_for "Redis" redis 6379

# Run migration
echo "Running migration..."
npm run dev:migrate

# Start app
echo "Starting application..."
exec npm run dev