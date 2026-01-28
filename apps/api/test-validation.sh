#!/bin/bash
# Note: all these tests are generated with the help of AI.
# Test script for validation and error handling
# Run with: bash test-validation.sh

BASE_URL="http://localhost:5000"

echo "=== Testing Validation & Error Handling ==="
echo ""

echo "1. Register with missing email (should fail - 400)"
echo "---"
curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"password": "password123", "name": "Test"}' | jq '.'
echo ""

echo "2. Register with invalid email (should fail - 400)"
echo "---"
curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "notanemail", "password": "password123", "name": "Test"}' | jq '.'
echo ""

echo "3. Register with short password (should fail - 400)"
echo "---"
curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "123", "name": "Test"}' | jq '.'
echo ""

echo "4. Register with missing name (should fail - 400)"
echo "---"
curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "password123"}' | jq '.'
echo ""

echo "5. Login with missing password (should fail - 400)"
echo "---"
curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com"}' | jq '.'
echo ""

echo "6. Login with invalid email format (should fail - 400)"
echo "---"
curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "notanemail", "password": "password123"}' | jq '.'
echo ""

echo "7. Claim with missing dealId (should fail - 400)"
echo "---"
# First, get a valid token
LOGIN=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"hashme"}')
TOKEN=$(echo $LOGIN | jq -r '.token')

curl -s -X POST "${BASE_URL}/claims" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{}' | jq '.'
echo ""

echo "8. Access non-existent route (should fail - 404)"
echo "---"
curl -s -X GET "${BASE_URL}/nonexistent" | jq '.'
echo ""

echo "9. Malformed JSON (should fail - 400)"
echo "---"
curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{invalid json}' | jq '.' 2>&1 | head -5
echo ""

echo "10. Test rate limiting on auth (make 6 requests quickly)"
echo "---"
for i in {1..6}; do
  echo "Request $i:"
  curl -s -X POST "${BASE_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' | jq '.error.code' 2>&1
  sleep 0.2
done
echo ""

echo "11. Valid registration (should succeed - 201)"
echo "---"
RANDOM_EMAIL="valid$(date +%s)@test.com"
curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${RANDOM_EMAIL}\",\"password\":\"password123\",\"name\":\"Valid User\"}" | jq '{user: .user | {email, name}, token: (.token[0:50] + "...")}'
echo ""

echo "=== Validation Tests Complete ==="
echo ""
echo "Summary of expected results:"
echo "  ❌ Missing fields return 400 with VALIDATION_ERROR"
echo "  ❌ Invalid email format returns 400"
echo "  ❌ Short password returns 400"
echo "  ❌ Non-existent routes return 404 with NOT_FOUND"
echo "  ❌ Rate limit exceeded returns 429 after 5 auth attempts"
echo "  ✅ Valid data succeeds with proper response"
echo "  ✅ No stack traces exposed to client"
echo "  ✅ All errors have consistent format: { error: { code, message, details? } }"
