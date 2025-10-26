#!/bin/bash

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Run seed SQL
psql "${SUPABASE_DB_URL:-$NEXT_PUBLIC_SUPABASE_URL}" < scripts/seed_dev.sql

echo "✅ Database seeded successfully!"
