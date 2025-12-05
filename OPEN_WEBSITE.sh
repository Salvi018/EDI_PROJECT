#!/bin/bash

# Quick script to open CODECADE website

echo "🌐 Opening CODECADE Website..."
echo ""

# Check if server is running
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Server is running!"
    echo ""
    echo "Opening in browser..."
    
    # Try to open in default browser
    if command -v open > /dev/null; then
        open http://localhost:8080
    elif command -v xdg-open > /dev/null; then
        xdg-open http://localhost:8080
    elif command -v start > /dev/null; then
        start http://localhost:8080
    else
        echo "Please open http://localhost:8080 in your browser"
    fi
    
    echo ""
    echo "📍 Website URL: http://localhost:8080"
    echo ""
    echo "📝 Available Pages:"
    echo "   • Home: http://localhost:8080"
    echo "   • Dashboard: http://localhost:8080/dashboard.html"
    echo "   • Practice: http://localhost:8080/practice-new.html"
    echo "   • Battle: http://localhost:8080/battle.html"
    echo "   • Leaderboard: http://localhost:8080/leaderboard.html"
    echo "   • Profile: http://localhost:8080/profile.html"
    echo ""
    echo "🔑 Test Login:"
    echo "   Email: test@example.com"
    echo "   Password: password123"
    echo ""
else
    echo "❌ Server is not running!"
    echo ""
    echo "Starting server..."
    ./START_LOCAL.sh
    echo ""
    echo "Waiting for server to start..."
    sleep 3
    
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        echo "✅ Server started!"
        echo "Opening in browser..."
        open http://localhost:8080 2>/dev/null || echo "Please open http://localhost:8080"
    else
        echo "⚠️  Server may need more time to start"
        echo "Please check logs: tail -f logs/server.log"
    fi
fi

