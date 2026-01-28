#!/bin/bash

# Test script for deals endpoints
# Run with: bash test-deals.sh

BASE_URL="http://localhost:5000"

echo "=== Testing Deals API ==="
echo ""

echo "1. Get all deals (no filters)"
echo "---"
curl -s "${BASE_URL}/deals" | jq '{total: .pagination.total, count: (.deals | length), deals: .deals[0:3] | map({title, slug, category, accessLevel})}'
echo ""

echo "2. Filter by category: cloud"
echo "---"
curl -s "${BASE_URL}/deals?category=cloud" | jq '{total: .pagination.total, deals: .deals | map({title, category, accessLevel})}'
echo ""

echo "3. Filter by category: marketing"
echo "---"
curl -s "${BASE_URL}/deals?category=marketing" | jq '{total: .pagination.total, deals: .deals | map({title, category, accessLevel})}'
echo ""

echo "4. Filter by accessLevel: locked"
echo "---"
curl -s "${BASE_URL}/deals?accessLevel=locked" | jq '{total: .pagination.total, deals: .deals | map({title, accessLevel})}'
echo ""

echo "5. Filter by accessLevel: public"
echo "---"
curl -s "${BASE_URL}/deals?accessLevel=public" | jq '{total: .pagination.total, deals: .deals | map({title, accessLevel})}'
echo ""

echo "6. Text search: 'cloud'"
echo "---"
curl -s "${BASE_URL}/deals?search=cloud" | jq '{total: .pagination.total, deals: .deals | map({title, category})}'
echo ""

echo "7. Text search: 'credits'"
echo "---"
curl -s "${BASE_URL}/deals?search=credits" | jq '{total: .pagination.total, deals: .deals | map({title, partnerName})}'
echo ""

echo "8. Combined filter: category=cloud AND accessLevel=public"
echo "---"
curl -s "${BASE_URL}/deals?category=cloud&accessLevel=public" | jq '{total: .pagination.total, deals: .deals | map({title, category, accessLevel})}'
echo ""

echo "9. Get single deal by slug: aws-cloud-credits"
echo "---"
curl -s "${BASE_URL}/deals/aws-cloud-credits" | jq '.deal | {title, slug, description, category, accessLevel, partnerName}'
echo ""

echo "10. Get single deal by slug: github-enterprise (locked)"
echo "---"
curl -s "${BASE_URL}/deals/github-enterprise" | jq '.deal | {title, slug, accessLevel, eligibility}'
echo ""

echo "11. Get non-existent deal (should return 404)"
echo "---"
curl -s "${BASE_URL}/deals/non-existent-slug" | jq '.'
echo ""

echo "12. Test pagination: limit=3, skip=0"
echo "---"
curl -s "${BASE_URL}/deals?limit=3&skip=0" | jq '{pagination, dealTitles: .deals | map(.title)}'
echo ""

echo "13. Test pagination: limit=3, skip=3"
echo "---"
curl -s "${BASE_URL}/deals?limit=3&skip=3" | jq '{pagination, dealTitles: .deals | map(.title)}'
echo ""

echo "=== All Deals Tests Complete ==="
