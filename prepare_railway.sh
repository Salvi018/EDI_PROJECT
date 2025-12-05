#!/bin/bash

# Prepare CODECADE for Railway Deployment

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚂 Preparing CODECADE for Railway Deployment${NC}"
echo "============================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git not initialized${NC}"
    read -p "Initialize git repository? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        echo -e "${GREEN}✅ Git initialized${NC}"
    fi
fi

# Check if Railway CLI is installed
if command -v railway &> /dev/null; then
    echo -e "${GREEN}✅ Railway CLI installed${NC}"
    railway --version
else
    echo -e "${YELLOW}⚠️  Railway CLI not installed${NC}"
    echo "   Install with: npm install -g @railway/cli"
    echo "   Or deploy via Railway dashboard (no CLI needed)"
fi

echo ""

# Check package.json
if [ -f "backend/node/package.json" ]; then
    echo -e "${GREEN}✅ package.json found${NC}"
else
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

# Check server.js
if [ -f "backend/node/server.js" ]; then
    echo -e "${GREEN}✅ server.js found${NC}"
else
    echo -e "${RED}❌ server.js not found${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 Pre-Deployment Checklist:${NC}"
echo ""
echo "Before deploying to Railway:"
echo ""
echo "1. ${YELLOW}MongoDB Atlas Setup:${NC}"
echo "   • Create account: https://www.mongodb.com/cloud/atlas"
echo "   • Create free cluster"
echo "   • Get connection string"
echo ""
echo "2. ${YELLOW}GitHub Repository:${NC}"
echo "   • Push code to GitHub"
echo "   • Ensure all files are committed"
echo ""
echo "3. ${YELLOW}Environment Variables:${NC}"
echo "   • MONGODB_URI (from Atlas)"
echo "   • JWT_SECRET (generate secure key)"
echo "   • Other variables (see DEPLOY_RAILWAY.md)"
echo ""
echo -e "${BLUE}📖 Next Steps:${NC}"
echo ""
echo "1. Read: ${GREEN}DEPLOY_RAILWAY.md${NC} for complete guide"
echo "2. Or use checklist: ${GREEN}RAILWAY_DEPLOY_CHECKLIST.md${NC}"
echo ""
echo -e "${YELLOW}💡 Quick Deploy Steps:${NC}"
echo ""
echo "1. Setup MongoDB Atlas (5 min)"
echo "2. Go to: https://railway.app"
echo "3. Create new project from GitHub"
echo "4. Set Root Directory: backend/node"
echo "5. Add environment variables"
echo "6. Deploy!"
echo ""
echo -e "${GREEN}Ready to deploy! Follow DEPLOY_RAILWAY.md${NC}"
echo ""

