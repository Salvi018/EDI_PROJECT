#!/bin/bash

# CODECADE - Initialize Database Script
# This script initializes the MongoDB database for local development

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🗄️  CODECADE Database Initialization${NC}"
echo "=================================="
echo ""

# Check if MongoDB is accessible
echo -e "${BLUE}📡 Checking MongoDB connection...${NC}"

cd database

# Try to load environment variables
if [ -f "../backend/node/.env" ]; then
    # Export env vars temporarily
    export $(grep -v '^#' ../backend/node/.env | xargs)
fi

# Check MongoDB connection
if command_exists mongosh; then
    MONGO_CMD="mongosh"
elif command_exists mongo; then
    MONGO_CMD="mongo"
else
    echo -e "${YELLOW}⚠️  mongosh/mongo not found in PATH${NC}"
    echo "   This is okay if you're using MongoDB Atlas"
fi

# Try to connect and initialize
echo "   Attempting to initialize database..."

# Run initialization script with proper Node.js path
if [ -f "init_mongodb.js" ]; then
    # Change to backend/node to access node_modules
    cd ../backend/node
    
    # Load environment variables
    if [ -f ".env" ]; then
        export $(grep -v '^#' .env | xargs)
    fi
    
    # Run init script
    node ../../database/init_mongodb.js
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Database initialized successfully!${NC}"
        echo ""
        echo -e "${BLUE}📝 Test Credentials:${NC}"
        echo "   Email: test@example.com"
        echo "   Password: password123"
        echo ""
    else
        echo ""
        echo -e "${RED}❌ Database initialization failed${NC}"
        echo ""
        echo -e "${YELLOW}💡 Troubleshooting:${NC}"
        echo "   1. Ensure MongoDB is running"
        echo "   2. Check MONGODB_URI in backend/node/.env"
        echo "   3. Verify MongoDB connection string is correct"
        echo ""
        exit 1
    fi
else
    echo -e "${RED}❌ init_mongodb.js not found${NC}"
    exit 1
fi

cd "$PROJECT_DIR"

