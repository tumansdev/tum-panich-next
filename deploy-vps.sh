#!/bin/bash

# Navigate to project directory
cd /var/www/tum-panich-next

# Pull latest changes
git pull origin main

# Build liff-app with no cache (to ensure latest code)
docker compose build --no-cache liff-app

# Recreate containers
docker compose up -d --force-recreate liff-app nginx

# Show status
docker compose ps
