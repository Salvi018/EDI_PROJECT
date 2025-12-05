#!/bin/bash

# CODECADE - Stop Local Development Server

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🛑 Stopping CODECADE Server${NC}"
echo "=============================="
echo ""

# Check if PID file exists
if [ -f "logs/server.pid" ]; then
    PID=$(cat logs/server.pid)
    
    if ps -p $PID > /dev/null 2>&1; then
        echo "   Stopping server (PID: $PID)..."
        kill $PID 2>/dev/null || true
        
        # Wait for process to stop
        for i in {1..5}; do
            if ! ps -p $PID > /dev/null 2>&1; then
                break
            fi
            sleep 1
        done
        
        # Force kill if still running
        if ps -p $PID > /dev/null 2>&1; then
            echo "   Force stopping..."
            kill -9 $PID 2>/dev/null || true
        fi
        
        echo -e "${GREEN}✅ Server stopped${NC}"
    else
        echo -e "${YELLOW}⚠️  Server process not found (may have already stopped)${NC}"
    fi
    
    # Remove PID file
    rm -f logs/server.pid
else
    echo -e "${YELLOW}⚠️  PID file not found${NC}"
    
    # Try to find and kill any running server processes
    PIDS=$(pgrep -f "node.*server.js" || true)
    if [ -n "$PIDS" ]; then
        echo "   Found running server processes, stopping them..."
        echo "$PIDS" | xargs kill 2>/dev/null || true
        sleep 2
        echo -e "${GREEN}✅ Server processes stopped${NC}"
    else
        echo "   No running server processes found"
    fi
fi

echo ""

