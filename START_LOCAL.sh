#!/bin/bash

# CODECADE - Start Local Development Server
# This script starts the development server with proper setup

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting CODECADE Local Server${NC}"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f "backend/node/.env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "   Running setup script first..."
    ./SETUP_LOCAL.sh
    echo ""
fi

# Check if dependencies are installed
if [ ! -d "backend/node/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependencies not installed${NC}"
    echo "   Installing dependencies..."
    cd backend/node
    npm install
    cd "$PROJECT_DIR"
    echo ""
fi

# Check if server is already running
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Server is already running on port 8080${NC}"
    echo ""
    read -p "Do you want to stop it and restart? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   Stopping existing server..."
        pkill -f "node.*server.js" || true
        sleep 2
    else
        echo "   Keeping existing server running"
        echo ""
        echo -e "${GREEN}✅ Server is available at http://localhost:8080${NC}"
        exit 0
    fi
fi

# Start the server
echo -e "${BLUE}📡 Starting server...${NC}"
cd backend/node

# Create logs directory if it doesn't exist
mkdir -p ../../logs

# Start server in background
nohup node server.js > ../../logs/server.log 2>&1 &
SERVER_PID=$!

# Save PID
echo $SERVER_PID > ../../logs/server.pid

# Wait a moment for server to start
sleep 3

# Check if server started successfully
if ps -p $SERVER_PID > /dev/null; then
    echo -e "${GREEN}✅ Server started successfully${NC}"
    echo ""
    echo -e "${BLUE}📊 Server Information:${NC}"
    echo "   PID: $SERVER_PID"
    echo "   Port: 8080"
    echo "   Logs: logs/server.log"
    echo ""
    echo -e "${GREEN}🌐 Application URL: http://localhost:8080${NC}"
    echo ""
    echo -e "${YELLOW}💡 Tips:${NC}"
    echo "   • View logs: tail -f logs/server.log"
    echo "   • Stop server: ./STOP_LOCAL.sh"
    echo "   • Test server: curl http://localhost:8080/health"
    echo ""
else
    echo -e "${RED}❌ Server failed to start${NC}"
    echo "   Check logs/server.log for errors"
    exit 1
fi

cd "$PROJECT_DIR"

