#!/usr/bin/bash

python init-stores.py "$1"
python post-text.py "$1" --filepath data/source_texts/Immensee.txt --language de

if [[ ! "$1" = "--vercel" ]]; then
    cp .db.config ../.env
    echo "Local config file .db.config promoted to ../.env"
    # Add URL for Vercel DB for playwright tests
    awk '/^POSTGRES_URL=/ {print "\n" $0}' ../.env.development.local >> ../.env
    echo "Vercel POSTGRES_URL copied to ../.env" 
fi