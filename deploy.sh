#!/bin/bash

echo "🚀 Deploying Tum Panich Next Gen..."

# Pull latest changes
git pull origin main

# Check if SSL certs exist, if not, run init script (logic omitted for brevity, assuming manual first run or generic start)
# For now, we just build and up

echo "📦 Building Docker Images..."
docker-compose build

echo "🔥 Starting Services..."
docker-compose up -d

echo "✅ Deployment Complete!"
docker-compose ps
