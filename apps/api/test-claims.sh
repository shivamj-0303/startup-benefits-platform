#!/bin/bash

# Test script for claims endpoints
# Run with: bash test-claims.sh
# Prerequisites: Server running, database seeded

BASE_URL="http://localhost:5000"

echo "=== Testing Claims API ==="
echo ""

# Step 1: Register an unverified user
echo "1. Register an unverified user"
echo "---"
UNVERIFIED_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "unverified@test.com",
    "password": "password123",
    "name": "Unverified User"
  }')

echo "$UNVERIFIED_RESPONSE" | jq '{user: .user | {email, isVerified}, token: .token[0:50]}'
UNVERIFIED_TOKEN=$(echo "$UNVERIFIED_RESPONSE" | jq -r '.token')
echo ""

# Step 2: Register a verified user (we'll manually verify in DB or use seed user)
echo "2. Register a verified user"
echo "---"
VERIFIED_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "verified@test.com",
    "password": "password123",
    "name": "Verified User"
  }')

echo "$VERIFIED_RESPONSE" | jq '{user: .user | {email, isVerified}, token: .token[0:50]}'
VERIFIED_TOKEN=$(echo "$VERIFIED_RESPONSE" | jq -r '.token')
echo ""
echo "NOTE: For full test, manually set isVerified=true in DB for verified@test.com"
echo "Or use the seeded test@example.com user with proper token"
echo ""

# Step 3: Unverified user claims a public deal (should succeed)
echo "3. Unverified user claims PUBLIC deal (should succeed)"
echo "---"
curl -s -X POST "${BASE_URL}/claims" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${UNVERIFIED_TOKEN}" \
  -d '{"dealId": "aws-cloud-credits"}' | jq '.'
echo ""

# Step 4: Unverified user tries to claim a locked deal (should fail with 403)
echo "4. Unverified user claims LOCKED deal (should fail - 403)"
echo "---"
curl -s -X POST "${BASE_URL}/claims" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${UNVERIFIED_TOKEN}" \
  -d '{"dealId": "github-enterprise"}' | jq '.'
echo ""

# Step 5: Claim without authentication (should fail with 401)
echo "5. Claim without authentication (should fail - 401)"
echo "---"
curl -s -X POST "${BASE_URL}/claims" \
  -H "Content-Type: application/json" \
  -d '{"dealId": "notion-pro"}' | jq '.'
echo ""

# Step 6: Claim non-existent deal (should fail with 404)
echo "6. Claim non-existent deal (should fail - 404)"
echo "---"
curl -s -X POST "${BASE_URL}/claims" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${UNVERIFIED_TOKEN}" \
  -d '{"dealId": "non-existent-deal"}' | jq '.'
echo ""

# Step 7: Duplicate claim (should fail with 409)
echo "7. Duplicate claim for same deal (should fail - 409)"
echo "---"
curl -s -X POST "${BASE_URL}/claims" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${UNVERIFIED_TOKEN}" \
  -d '{"dealId": "aws-cloud-credits"}' | jq '.'
echo ""

# Step 8: Claim another public deal
echo "8. Claim another public deal (should succeed)"
echo "---"
curl -s -X POST "${BASE_URL}/claims" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${UNVERIFIED_TOKEN}" \
  -d '{"dealId": "notion-pro"}' | jq '.'
echo ""

# Step 9: Get user's claims
echo "9. Get all claims for unverified user"
echo "---"
curl -s -X GET "${BASE_URL}/claims/me" \
  -H "Authorization: Bearer ${UNVERIFIED_TOKEN}" | jq '{stats, claimCount: (.claims | length), claims: .claims | map({status, claimedAt, deal: .dealId | {title, slug, accessLevel}})}'
echo ""

# Step 10: Get claims without auth (should fail)
echo "10. Get claims without authentication (should fail - 401)"
echo "---"
curl -s -X GET "${BASE_URL}/claims/me" | jq '.'
echo ""

# Note: all these tests are generated with the help of AI.
if [ ! -z "$VERIFIED_TOKEN" ]; then
  echo "11. Verified user claims locked deal (would succeed if isVerified=true)"
  echo "---"
  echo "Run this after manually verifying the user in DB:"
  echo "curl -X POST ${BASE_URL}/claims -H \"Content-Type: application/json\" -H \"Authorization: Bearer \${VERIFIED_TOKEN}\" -d '{\"dealId\": \"github-enterprise\"}'"
  echo ""
fi

echo "=== Claims API Tests Complete ==="
echo ""
echo "Summary of expected results:"
echo "  Unverified user CAN claim public deals"
echo "  Unverified user CANNOT claim locked deals (403 VERIFICATION_REQUIRED)"
echo "  Duplicate claims blocked (409 DUPLICATE_CLAIM)"
echo "  Non-existent deals return 404"
echo "  Unauthenticated requests return 401"
echo "  Verified users can claim locked deals"
echo "  User can fetch their claims with populated deal info"
