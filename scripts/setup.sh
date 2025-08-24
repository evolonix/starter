#!/usr/bin/env bash

# Check if .env exists
if [ ! -f .env ]; then
  echo ".env file is missing. Creating one now..."
  if ! cp .env.example .env; then
    echo "❌ Failed to create .env file."
    exit 1
  fi
  echo "✅ .env file created."
fi

# Check if libs/data/prisma/dev.db exists
if [ ! -f libs/data/prisma/dev.db ]; then
  echo "Database setup has not been run. Running it now..."
  if ! npx nx run data:reset --force; then
    echo "❌ Error occurred during setup."
    exit 1
  fi
  echo "✅ Database setup complete."
fi

echo "✅ Setup complete."
exit 0
