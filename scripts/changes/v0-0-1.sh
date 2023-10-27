#!/usr/bin/bash

python init-stores.py "$1"
python post-text.py "$1" --filepath ../data/source_texts/Immensee.txt --language de

# Install environment variables
cp .db.config ../.env
echo "Local config file .db.config promoted to ../.env"
# Add URLs for Vercel and Neon DBs for playwright tests
awk '/^POSTGRES_URL=/ {print "\n" $0}' ../.env.local >> ../.env
echo "Vercel POSTGRES_URL copied to ../.env" 
awk '/^PG/ {print "\n" $0}' ../.env.local >> ../.env
echo "Neon environment variables copied to ../.env" 
