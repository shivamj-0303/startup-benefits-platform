#!/bin/bash
# Note: all these tests are generated with the help of AI.

# Test script for dev verification endpoints
# Usage: ./test-verification.sh

BASE_URL="http://localhost:5000"

echo "🔧 Testing Dev Verification Endpoints"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. List all users${NC}"
curl -s "$BASE_URL/dev/users" | jq '.'
echo ""
echo ""

echo -e "${YELLOW}2. Verify user by email (test@example.com)${NC}"
curl -s -X POST "$BASE_URL/dev/verify-user" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}' | jq '.'
echo ""
echo ""

echo -e "${YELLOW}3. Check user is verified${NC}"
curl -s "$BASE_URL/dev/users" | jq '.users[] | select(.email == "test@example.com")'
echo ""
echo ""

echo -e "${YELLOW}4. Login as verified user${NC}"
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "hashme"}' | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✅ Login successful${NC}"
  echo "Token: $TOKEN"
  echo ""
  
  echo -e "${YELLOW}5. Verify self (using token)${NC}"
  curl -s -X POST "$BASE_URL/dev/verify-me" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""
  echo ""
  
  echo -e "${YELLOW}6. Check protected endpoint with verified user${NC}"
  curl -s "$BASE_URL/protected/me" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""
else
  echo -e "${RED}❌ Login failed${NC}"
fi

echo ""
echo -e "${YELLOW}7. Unverify user (for testing unverified flow again)${NC}"
curl -s -X POST "$BASE_URL/dev/unverify-user" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}' | jq '.'
echo ""
echo ""

echo -e "${GREEN}✅ All verification tests complete!${NC}"
echo ""
echo "================================================"
echo "Summary of Dev Endpoints:"
echo "================================================"
echo "GET  /dev/users           - List all users"
echo "POST /dev/verify-user     - Verify user by email"
echo "POST /dev/unverify-user   - Unverify user by email"
echo "POST /dev/verify-me       - Verify yourself (requires auth token)"
echo ""
echo "Note: These endpoints are automatically disabled in production"
echo "======================================"
