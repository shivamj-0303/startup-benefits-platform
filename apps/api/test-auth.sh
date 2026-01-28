#!/bin/bash

# Test script for auth endpoints
# Run with: bash test-auth.sh

BASE_URL="http://localhost:5000"

echo "=== Testing Auth System ==="
echo ""

echo "1. Testing Registration (POST /auth/register)"
echo "---"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securepass123",
    "name": "Alice Smith"
  }')

echo "$REGISTER_RESPONSE" | jq '.'
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
echo ""
echo "Extracted Token: ${TOKEN:0:50}..."
echo ""

echo "2. Testing Login (POST /auth/login)"
echo "---"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securepass123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""

echo "3. Testing Protected Route WITHOUT Token (should fail)"
echo "---"
curl -s -X GET "${BASE_URL}/protected/me" | jq '.'
echo ""

echo "4. Testing Protected Route WITH Valid Token (should succeed)"
echo "---"
curl -s -X GET "${BASE_URL}/protected/me" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.'
echo ""

echo "5. Testing Duplicate Registration (should fail)"
echo "---"
curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "anotherpass",
    "name": "Alice Duplicate"
  }' | jq '.'
echo ""

echo "6. Testing Login with Wrong Password (should fail)"
echo "---"
curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "wrongpassword"
  }' | jq '.'
echo ""

echo "=== All Tests Complete ==="
