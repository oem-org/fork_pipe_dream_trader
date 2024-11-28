#!/bin/bash
set -e

# Check if the database is already initialized
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\dt' | grep bin1s > /dev/null 2>&1

if [ $? -ne 0 ]; then
  echo "Database is not initialized. Running init.sql..."
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/init.sql
else
  echo "Database is already initialized. Skipping init.sql."
fi

# Run the default entrypoint
exec docker-entrypoint.sh "$@"
