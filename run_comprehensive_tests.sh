#!/bin/bash

# Comprehensive Test Runner for CODECADE
# This script runs all tests with proper dependency handling

echo "🧪 CODECADE Comprehensive Test Suite"
echo "======================================"
echo ""

API_URL="http://localhost:8080"
TEST_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$TEST_DIR"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

passed=0
failed=0
errors=()

log_test() {
    local name=$1
    local result=$2
    local error=$3
    
    if [ "$result" = "pass" ]; then
        echo -e "${GREEN}✅ $name${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ $name${NC}"
        ((failed++))
        if [ -n "$error" ]; then
            errors+=("$name: $error")
            echo -e "${YELLOW}   Error: $error${NC}"
        fi
    fi
}

# Test 1: Server Health
echo -e "${CYAN}1. Testing Server Health...${NC}"
health_response=$(curl -s "$API_URL/health")
if echo "$health_response" | grep -q '"status":"OK"'; then
    log_test "Server Health Check" "pass"
else
    log_test "Server Health Check" "fail" "Server not responding"
    exit 1
fi

# Test 2: Database Connection (via server)
echo ""
echo -e "${CYAN}2. Testing Database via API...${NC}"

# Test 3: User Authentication Flow
echo ""
echo -e "${CYAN}3. Testing User Authentication...${NC}"

# Create unique test user
timestamp=$(date +%s)
test_email="test_${timestamp}@example.com"
test_username="TestUser${timestamp}"
test_password="test123456"

# Signup
echo "   Testing signup..."
signup_response=$(curl -s -X POST "$API_URL/auth/signup" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$test_username\",\"email\":\"$test_email\",\"password\":\"$test_password\"}")

if echo "$signup_response" | grep -q '"token"'; then
    log_test "User Signup" "pass"
    token=$(echo "$signup_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    log_test "User Signup" "fail" "$signup_response"
    token=""
fi

# Duplicate signup rejection
echo "   Testing duplicate signup rejection..."
duplicate_response=$(curl -s -X POST "$API_URL/auth/signup" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$test_username\",\"email\":\"$test_email\",\"password\":\"$test_password\"}")

if echo "$duplicate_response" | grep -q "already registered"; then
    log_test "Duplicate Signup Rejection" "pass"
else
    log_test "Duplicate Signup Rejection" "fail"
fi

# Login
if [ -n "$token" ]; then
    echo "   Testing login..."
    login_response=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$test_email\",\"password\":\"$test_password\"}")
    
    if echo "$login_response" | grep -q '"token"'; then
        log_test "User Login" "pass"
        token=$(echo "$login_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    else
        log_test "User Login" "fail"
    fi
fi

# Invalid login
echo "   Testing invalid login rejection..."
invalid_login=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"nonexistent@example.com","password":"wrong"}')

if echo "$invalid_login" | grep -q "Invalid\|error"; then
    log_test "Invalid Login Rejection" "pass"
else
    log_test "Invalid Login Rejection" "fail"
fi

# Test 4: Authenticated Endpoints
if [ -n "$token" ]; then
    echo ""
    echo -e "${CYAN}4. Testing Authenticated Endpoints...${NC}"
    
    # User stats
    echo "   Testing user stats..."
    stats_response=$(curl -s "$API_URL/user/stats" \
        -H "Authorization: Bearer $token")
    
    if echo "$stats_response" | grep -q '"level"'; then
        log_test "Get User Stats" "pass"
    else
        log_test "Get User Stats" "fail" "$stats_response"
    fi
    
    # User progress
    echo "   Testing user progress..."
    progress_response=$(curl -s "$API_URL/user/progress" \
        -H "Authorization: Bearer $token")
    
    if echo "$progress_response" | grep -q '"solvedProblems"\|"problems"\|"lessons"'; then
        log_test "Get User Progress" "pass"
    else
        log_test "Get User Progress" "fail"
    fi
    
    # Battle stats
    echo "   Testing battle stats..."
    battle_stats=$(curl -s "$API_URL/battle/stats" \
        -H "Authorization: Bearer $token")
    
    if echo "$battle_stats" | grep -q '"wins"\|"rating"\|"totalBattles"'; then
        log_test "Get Battle Stats" "pass"
    else
        log_test "Get Battle Stats" "fail"
    fi
    
    # Leaderboard (no auth required)
    echo "   Testing leaderboard..."
    leaderboard=$(curl -s "$API_URL/battle/leaderboard")
    
    if echo "$leaderboard" | grep -q '"rank"\|"username"\|\[\]'; then
        log_test "Get Leaderboard" "pass"
    else
        log_test "Get Leaderboard" "fail"
    fi
    
    # Test 5: Problem Endpoints
    echo ""
    echo -e "${CYAN}5. Testing Problem Endpoints...${NC}"
    
    # Mark problem solved
    echo "   Testing mark problem solved..."
    solve_response=$(curl -s -X POST "$API_URL/problems/solve" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d '{"problemId":"test-problem-1","attempts":1,"timeTaken":120,"xpReward":10}')
    
    if echo "$solve_response" | grep -q '"message"'; then
        log_test "Mark Problem Solved" "pass"
    else
        log_test "Mark Problem Solved" "fail" "$solve_response"
    fi
    
    # Get solved problems
    echo "   Testing get solved problems..."
    solved_response=$(curl -s "$API_URL/problems/solved" \
        -H "Authorization: Bearer $token")
    
    if echo "$solved_response" | grep -q '"problems"\|"total"'; then
        log_test "Get Solved Problems" "pass"
    else
        log_test "Get Solved Problems" "fail"
    fi
    
    # Submit problem
    echo "   Testing submit problem..."
    valid_code='function solve(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}'
    
    submit_response=$(curl -s -X POST "$API_URL/problems/submit" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "{\"problemId\":\"test-problem-2\",\"language\":\"javascript\",\"code\":\"$valid_code\",\"timeSpent\":300}")
    
    if echo "$submit_response" | grep -q '"verdict"'; then
        log_test "Submit Problem Solution" "pass"
    else
        log_test "Submit Problem Solution" "fail" "$submit_response"
    fi
    
    # Test 6: Lesson Endpoints
    echo ""
    echo -e "${CYAN}6. Testing Lesson Endpoints...${NC}"
    
    # Mark lesson completed
    echo "   Testing mark lesson completed..."
    lesson_response=$(curl -s -X POST "$API_URL/lessons/complete" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d '{"lessonId":"test-lesson-1","xpReward":5}')
    
    if echo "$lesson_response" | grep -q '"message"'; then
        log_test "Mark Lesson Completed" "pass"
    else
        log_test "Mark Lesson Completed" "fail" "$lesson_response"
    fi
    
    # Get completed lessons
    echo "   Testing get completed lessons..."
    completed_lessons=$(curl -s "$API_URL/lessons/completed" \
        -H "Authorization: Bearer $token")
    
    if echo "$completed_lessons" | grep -q '"lessons"\|"total"'; then
        log_test "Get Completed Lessons" "pass"
    else
        log_test "Get Completed Lessons" "fail"
    fi
    
    # Test 7: Test System Endpoints
    echo ""
    echo -e "${CYAN}7. Testing Test System Endpoints...${NC}"
    
    # Get test questions
    echo "   Testing get test questions..."
    questions_response=$(curl -s "$API_URL/api/test/questions" \
        -H "Authorization: Bearer $token")
    
    if echo "$questions_response" | grep -q '"questions"'; then
        log_test "Get Test Questions" "pass"
    else
        log_test "Get Test Questions" "fail" "$questions_response"
    fi
    
    # Submit test results
    echo "   Testing submit test results..."
    test_submit=$(curl -s -X POST "$API_URL/api/test/submit" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d '{"score":80,"percentage":80,"timeTaken":600}')
    
    if echo "$test_submit" | grep -q '"success"'; then
        log_test "Submit Test Results" "pass"
    else
        log_test "Submit Test Results" "fail" "$test_submit"
    fi
fi

# Test 8: Authorization
echo ""
echo -e "${CYAN}8. Testing Authorization...${NC}"
echo "   Testing unauthorized access..."
unauthorized=$(curl -s "$API_URL/user/stats")

if echo "$unauthorized" | grep -q '"error"\|"token"\|401\|Unauthorized'; then
    log_test "Unauthorized Access Rejection" "pass"
else
    log_test "Unauthorized Access Rejection" "fail"
fi

# Summary
echo ""
echo "======================================"
echo -e "${BLUE}📊 Test Results Summary${NC}"
echo "======================================"
echo -e "${GREEN}✅ Passed: $passed${NC}"
echo -e "${RED}❌ Failed: $failed${NC}"

if [ ${#errors[@]} -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}🔍 Errors:${NC}"
    for error in "${errors[@]}"; do
        echo -e "${YELLOW}   • $error${NC}"
    done
fi

total=$((passed + failed))
if [ $total -gt 0 ]; then
    success_rate=$(echo "scale=1; $passed * 100 / $total" | bc)
    echo ""
    echo -e "${CYAN}📈 Success Rate: ${success_rate}%${NC}"
fi

echo ""
if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review errors above.${NC}"
    exit 1
fi

