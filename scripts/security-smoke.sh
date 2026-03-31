#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://nextlevel-academy-app.vercel.app}"

check_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"

  if [[ "$actual" != "$expected" ]]; then
    echo "[FAIL] $name -> expected $expected, got $actual"
    exit 1
  fi

  echo "[OK] $name -> $actual"
}

admin_status="$(curl -I -s "$BASE_URL/admin" | awk 'NR==1 {print $2}')"
check_status "admin redirect" "307" "$admin_status"

checkout_status="$(
  curl -s -o /dev/null -D - \
    -X POST "$BASE_URL/api/checkout/session" \
    -H 'content-type: application/json' \
    --data '{"provider":"stripe","resourceType":"program","resourceId":"00000000-0000-0000-0000-000000000000","quantity":1}' |
    awk 'NR==1 {print $2}'
)"
check_status "checkout origin rejection" "403" "$checkout_status"

legacy_admin_status="$(
  curl -s -o /dev/null -D - \
    -X POST "$BASE_URL/admin/api/login" \
    -H "Origin: $BASE_URL" \
    --data 'username=admin&password=test' |
    awk 'NR==1 {print $2}'
)"
check_status "legacy admin route rejected" "303" "$legacy_admin_status"

echo "Security smoke checks passed for $BASE_URL"
