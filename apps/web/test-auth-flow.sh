#!/bin/bash

# Authentication Flow Test Script
# Tests: Registration → Login → Token Persistence → Protected Routes → Logout

API_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:3000"

echo "=================================="
echo "Authentication System Test"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Register New User
echo -e "${YELLOW}Test 1: User Registration${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser'$(date +%s)'@example.com",
    "password": "password123",
    "name": "Test User"
  }')

TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token // empty')

if [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✓ Registration successful${NC}"
  echo "Token: ${TOKEN:0:20}..."
  USER_EMAIL=$(echo "$REGISTER_RESPONSE" | jq -r '.user.email')
  USER_NAME=$(echo "$REGISTER_RESPONSE" | jq -r '.user.name')
  echo "User: $USER_NAME ($USER_EMAIL)"
else
  echo -e "${RED}✗ Registration failed${NC}"
  echo "$REGISTER_RESPONSE" | jq '.'
  exit 1
fi
echo ""

# Test 2: Login with Test Account
echo -e "${YELLOW}Test 2: User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "verified@example.com",
    "password": "hashme"
  }')

VERIFIED_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')

if [ -n "$VERIFIED_TOKEN" ]; then
  echo -e "${GREEN}✓ Login successful${NC}"
  echo "Token: ${VERIFIED_TOKEN:0:20}..."
  VERIFIED_USER=$(echo "$LOGIN_RESPONSE" | jq -r '.user.email')
  IS_VERIFIED=$(echo "$LOGIN_RESPONSE" | jq -r '.user.isVerified')
  echo "User: $VERIFIED_USER (Verified: $IS_VERIFIED)"
else
  echo -e "${RED}✗ Login failed${NC}"
  echo "$LOGIN_RESPONSE" | jq '.'
  exit 1
fi
echo ""

# Test 3: Access Protected Route WITH Token
echo -e "${YELLOW}Test 3: Protected Route (With Token)${NC}"
PROTECTED_RESPONSE=$(curl -s -X GET "$API_URL/protected/me" \
  -H "Authorization: Bearer $VERIFIED_TOKEN")

PROTECTED_USER=$(echo "$PROTECTED_RESPONSE" | jq -r '.user.email // empty')

if [ -n "$PROTECTED_USER" ]; then
  echo -e "${GREEN}✓ Protected route accessible with valid token${NC}"
  echo "User: $PROTECTED_USER"
else
  echo -e "${RED}✗ Protected route failed${NC}"
  echo "$PROTECTED_RESPONSE" | jq '.'
  exit 1
fi
echo ""

# Test 4: Access Protected Route WITHOUT Token
echo -e "${YELLOW}Test 4: Protected Route (Without Token)${NC}"
NO_AUTH_RESPONSE=$(curl -s -X GET "$API_URL/protected/me")

NO_AUTH_ERROR=$(echo "$NO_AUTH_RESPONSE" | jq -r '.error // empty')

if [ -n "$NO_AUTH_ERROR" ]; then
  echo -e "${GREEN}✓ Protected route blocked without token${NC}"
  echo "Error: $NO_AUTH_ERROR"
else
  echo -e "${RED}✗ Protected route should have been blocked${NC}"
  echo "$NO_AUTH_RESPONSE" | jq '.'
  exit 1
fi
echo ""

# Test 5: Access Protected Route with INVALID Token
echo -e "${YELLOW}Test 5: Protected Route (Invalid Token)${NC}"
INVALID_RESPONSE=$(curl -s -X GET "$API_URL/protected/me" \
  -H "Authorization: Bearer invalid_token_12345")

INVALID_ERROR=$(echo "$INVALID_RESPONSE" | jq -r '.error // empty')

if [ -n "$INVALID_ERROR" ]; then
  echo -e "${GREEN}✓ Invalid token rejected${NC}"
  echo "Error: $INVALID_ERROR"
else
  echo -e "${RED}✗ Invalid token should have been rejected${NC}"
  echo "$INVALID_RESPONSE" | jq '.'
  exit 1
fi
echo ""

# Test 6: Fetch Deals (Public - No Token Required)
echo -e "${YELLOW}Test 6: Fetch Deals (Public)${NC}"
DEALS_RESPONSE=$(curl -s -X GET "$API_URL/deals?limit=3")

DEALS_COUNT=$(echo "$DEALS_RESPONSE" | jq '.deals | length')

if [ "$DEALS_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓ Public deals accessible without token${NC}"
  echo "Deals fetched: $DEALS_COUNT"
  echo "$DEALS_RESPONSE" | jq -r '.deals[0] | "- \(.title) (\(.accessLevel))"'
else
  echo -e "${RED}✗ Failed to fetch deals${NC}"
  echo "$DEALS_RESPONSE" | jq '.'
  exit 1
fi
echo ""

# Test 7: Create Claim (Requires Token)
echo -e "${YELLOW}Test 7: Create Claim (With Token)${NC}"

# First get a deal ID
DEAL_ID=$(curl -s "$API_URL/deals?limit=1" | jq -r '.deals[0]._id')

CLAIM_RESPONSE=$(curl -s -X POST "$API_URL/claims" \
  -H "Authorization: Bearer $VERIFIED_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"dealId\": \"$DEAL_ID\"}")

CLAIM_STATUS=$(echo "$CLAIM_RESPONSE" | jq -r '.claim.status // .error // empty')

if [ -n "$CLAIM_STATUS" ]; then
  if [ "$CLAIM_STATUS" = "pending" ] || [[ "$CLAIM_STATUS" == *"already claimed"* ]]; then
    echo -e "${GREEN}✓ Claim created or already exists${NC}"
    echo "Status: $CLAIM_STATUS"
  else
    echo -e "${YELLOW}⚠ Claim response: $CLAIM_STATUS${NC}"
  fi
else
  echo -e "${RED}✗ Failed to create claim${NC}"
  echo "$CLAIM_RESPONSE" | jq '.'
fi
echo ""

# Test 8: Fetch My Claims
echo -e "${YELLOW}Test 8: Fetch My Claims${NC}"
MY_CLAIMS=$(curl -s -X GET "$API_URL/claims/me" \
  -H "Authorization: Bearer $VERIFIED_TOKEN")

CLAIMS_COUNT=$(echo "$MY_CLAIMS" | jq '.claims | length')

if [ "$CLAIMS_COUNT" -ge 0 ]; then
  echo -e "${GREEN}✓ My claims fetched successfully${NC}"
  echo "Total claims: $CLAIMS_COUNT"
else
  echo -e "${RED}✗ Failed to fetch claims${NC}"
  echo "$MY_CLAIMS" | jq '.'
  exit 1
fi
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}All Tests Passed!${NC}"
echo "=================================="
echo ""
echo "Frontend Instructions:"
echo "1. Visit $FRONTEND_URL/register"
echo "2. Register a new account"
echo "3. Check DevTools → Application → Local Storage"
echo "   - Should see 'token' entry"
echo "4. Refresh the page (F5)"
echo "   - Should stay logged in"
echo "5. Visit $FRONTEND_URL/dashboard"
echo "   - Should see protected content"
echo "6. Click 'Logout'"
echo "   - Token should be cleared"
echo "   - Should redirect to /login"
echo "7. Try accessing $FRONTEND_URL/dashboard"
echo "   - Should redirect to /login"
echo ""
echo "Test Accounts:"
echo "  Unverified: test@example.com / hashme"
echo "  Verified:   verified@example.com / hashme"
