#!/bin/bash

echo "🧪 CODECADE System Test"
echo "======================="
echo ""

API_URL="http://localhost:8080"

# Check if server is running
echo "1. Checking server status..."
if curl -s "$API_URL/health" > /dev/null; then
    echo "   ✅ Server is running"
else
    echo "   ❌ Server is not running. Start with ./RESTART_SERVER.sh"
    exit 1
fi

# Test health endpoint
echo ""
echo "2. Testing health endpoint..."
HEALTH=$(curl -s "$API_URL/health")
echo "   Response: $HEALTH"

# Test signup
echo ""
echo "3. Testing user signup..."
SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"testuser@test.com","password":"test123"}')
echo "   Response: $SIGNUP_RESPONSE"

# Test login
echo ""
echo "4. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')
echo "   Response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "   ❌ Login failed - no token received"
else
    echo "   ✅ Login successful - token received"
    
    # Test authenticated endpoints
    echo ""
    echo "5. Testing user stats endpoint..."
    STATS=$(curl -s "$API_URL/user/stats" -H "Authorization: Bearer $TOKEN")
    echo "   Response: $STATS"
    
    echo ""
    echo "6. Testing battle stats endpoint..."
    BATTLE_STATS=$(curl -s "$API_URL/battle/stats" -H "Authorization: Bearer $TOKEN")
    echo "   Response: $BATTLE_STATS"
fi

echo ""
echo "======================="
echo "✅ System test complete!"
