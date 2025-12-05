#!/bin/bash

# CODECADE - Local Setup Script
# This script sets up the project for local development

set -e  # Exit on error

echo "🚀 CODECADE - Local Setup"
echo "========================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check Node.js
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "   Please install Node.js v14 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo -e "${RED}❌ Node.js version 14 or higher is required (you have v$(node -v))${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Check npm
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v)${NC}"

# Check MongoDB (optional)
MONGODB_RUNNING=false
if command_exists mongod; then
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✅ MongoDB is running${NC}"
        MONGODB_RUNNING=true
    else
        echo -e "${YELLOW}⚠️  MongoDB is installed but not running${NC}"
        echo "   You can start it with: mongod --dbpath <path>"
        echo "   Or use MongoDB Atlas (cloud) and update .env file"
    fi
else
    echo -e "${YELLOW}⚠️  MongoDB not found locally${NC}"
    echo "   You can:"
    echo "   1. Install MongoDB locally: https://www.mongodb.com/try/download/community"
    echo "   2. Use MongoDB Atlas (free cloud): https://www.mongodb.com/cloud/atlas"
fi

echo ""

# Step 1: Install dependencies
echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
cd "$PROJECT_DIR/backend/node"

if [ ! -d "node_modules" ]; then
    echo "   Installing npm packages..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
    echo "   Run 'npm install' to update if needed"
fi

cd "$PROJECT_DIR"
echo ""

# Step 2: Setup environment file
echo -e "${BLUE}⚙️  Step 2: Setting up environment configuration...${NC}"
cd "$PROJECT_DIR/backend/node"

if [ ! -f ".env" ]; then
    echo "   Creating .env file from template..."
    
    cat > .env << 'EOF'
# CODECADE Backend - Local Development Environment
# Update these values for your local setup

# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/codecade

# JWT Configuration (CHANGE THIS IN PRODUCTION)
JWT_SECRET=codecade_local_dev_secret_key_change_in_production
JWT_EXPIRE=7d

# Bcrypt Configuration
BCRYPT_ROUNDS=10

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000

# Logging
LOG_LEVEL=info
EOF
    
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}   ⚠️  Please update MONGODB_URI if using MongoDB Atlas${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

cd "$PROJECT_DIR"
echo ""

# Step 3: Initialize database
echo -e "${BLUE}🗄️  Step 3: Database setup...${NC}"

if [ "$MONGODB_RUNNING" = true ] || command_exists mongosh || command_exists mongo; then
    echo "   Attempting to initialize database..."
    
    cd "$PROJECT_DIR/database"
    
    # Try to run init script
    if NODE_PATH="../backend/node/node_modules" node -e "process.chdir('../backend/node'); require('dotenv').config(); require('mongodb');" 2>/dev/null; then
        echo "   Initializing MongoDB collections..."
        # The init script needs to be run with proper module paths
        echo -e "${YELLOW}   ⚠️  Run 'node init_mongodb.js' manually after ensuring MongoDB is running${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Could not initialize database automatically${NC}"
        echo "   Please run manually: cd database && node init_mongodb.js"
    fi
else
    echo -e "${YELLOW}   ⚠️  MongoDB not available. Skipping database initialization${NC}"
    echo "   You can initialize later when MongoDB is running:"
    echo "   cd database && node init_mongodb.js"
fi

cd "$PROJECT_DIR"
echo ""

# Step 4: Create logs directory
echo -e "${BLUE}📁 Step 4: Creating necessary directories...${NC}"
mkdir -p logs
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Step 5: Make scripts executable
echo -e "${BLUE}🔧 Step 5: Making scripts executable...${NC}"
chmod +x RESTART_SERVER.sh 2>/dev/null || true
chmod +x TEST_SYSTEM.sh 2>/dev/null || true
chmod +x run_comprehensive_tests.sh 2>/dev/null || true
echo -e "${GREEN}✅ Scripts are executable${NC}"
echo ""

# Summary
echo -e "${BLUE}=========================${NC}"
echo -e "${GREEN}✅ Local setup complete!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo ""
echo "1. ${YELLOW}Configure MongoDB:${NC}"
echo "   • If using local MongoDB: Start it with 'mongod'"
echo "   • If using MongoDB Atlas: Update MONGODB_URI in backend/node/.env"
echo ""
echo "2. ${YELLOW}Initialize database (if MongoDB is running):${NC}"
echo "   cd database"
echo "   node init_mongodb.js"
echo ""
echo "3. ${YELLOW}Start the server:${NC}"
echo "   ./RESTART_SERVER.sh"
echo "   OR"
echo "   cd backend/node && npm start"
echo ""
echo "4. ${YELLOW}Access the application:${NC}"
echo "   Open http://localhost:8080 in your browser"
echo ""
echo "5. ${YELLOW}Test login (after DB init):${NC}"
echo "   Email: test@example.com"
echo "   Password: password123"
echo ""
echo -e "${BLUE}📚 For more information, see README.md${NC}"
echo ""

