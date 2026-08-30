#!/usr/bin/env bash
# Verifies the agent/AI-crawler readiness fixes against a live deployment.
#
# Usage: scripts/verify-agent-readiness.sh [base_url]
#   base_url defaults to https://www.joseromerodesign.com
#
# Exits non-zero if any check fails. Safe to re-run after every deploy —
# this is the closest thing this static site has to a regression suite
# for the agent-readiness work, since there's no build step or test
# framework to hang real tests off of.

set -u
BASE="${1:-https://www.joseromerodesign.com}"
FAIL=0

pass() { echo "  PASS  $1"; }
fail() { echo "  FAIL  $1"; FAIL=1; }

echo "Verifying agent readiness against: $BASE"
echo

# ── 1. Real 404 status for a nonexistent path ────────────────────────────
echo "1. Agent-friendly 404s"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/some-path-that-does-not-exist-xyz/")
if [ "$CODE" = "404" ]; then pass "nonexistent path returns HTTP 404 (got $CODE)"; else fail "nonexistent path returned $CODE, expected 404"; fi

MD_404=$(curl -s -H "Accept: text/markdown" "$BASE/some-path-that-does-not-exist-xyz/")
MD_404_TYPE=$(curl -s -o /dev/null -D - -H "Accept: text/markdown" "$BASE/some-path-that-does-not-exist-xyz/" | grep -i '^content-type:' | tr -d '\r')
if echo "$MD_404_TYPE" | grep -qi 'text/markdown'; then pass "404 + Accept:text/markdown returns text/markdown"; else fail "404 markdown content-type missing/wrong: $MD_404_TYPE"; fi
if echo "$MD_404" | grep -qi 'sitemap'; then pass "404 markdown body links to sitemap"; else fail "404 markdown body missing sitemap link"; fi
if echo "$MD_404" | grep -qi 'llms.txt'; then pass "404 markdown body links to llms.txt"; else fail "404 markdown body missing llms.txt link"; fi

# ── 2. llms.txt has when-to-use guidance ─────────────────────────────────
echo
echo "2. Agent instruction / when-to-use"
LLMS=$(curl -s "$BASE/llms.txt")
if echo "$LLMS" | grep -qi 'when to use'; then pass "llms.txt contains a \"when to use\" section"; else fail "llms.txt missing when-to-use heading"; fi

# ── 3 & 4. Homepage JSON-LD: parse properly (grep can't span the
# multi-line JSON blocks reliably), so hand this to Python. ─────────────
echo
echo "3. JSON-LD structured data (Person)"
echo "4. Organization schema completeness"
HOME=$(curl -s "$BASE/")
JSONLD_RESULT=$(echo "$HOME" | python3 -c '
import sys, re, json
html = sys.stdin.read()
blocks = re.findall(r"application/ld\+json\">\s*(\{.*?\})\s*</script>", html, re.S)
person = None
org = None
for b in blocks:
    try:
        data = json.loads(b)
    except Exception as e:
        print("INVALID_JSON:" + str(e))
        continue
    if data.get("@type") == "Person":
        person = data
    elif data.get("@type") == "Organization":
        org = data

if person and person.get("name") and person.get("description"):
    print("PASS:Person schema has both name and description")
else:
    print("FAIL:Person schema missing name or description")

if org:
    print("PASS:Organization schema present")
    if org.get("contactPoint"):
        print("PASS:Organization schema has contactPoint")
    else:
        print("FAIL:Organization schema missing contactPoint")
    if org.get("address"):
        print("PASS:Organization schema has address")
    else:
        print("FAIL:Organization schema missing address")
else:
    print("FAIL:Organization schema missing")
    print("FAIL:Organization schema missing contactPoint")
    print("FAIL:Organization schema missing address")
')
while IFS= read -r line; do
  status="${line%%:*}"
  msg="${line#*:}"
  if [ "$status" = "PASS" ]; then pass "$msg"; else fail "$msg"; fi
done <<< "$JSONLD_RESULT"

# ── 5. Homepage markdown negotiation still works ─────────────────────────
echo
echo "5. Homepage markdown negotiation"
HOME_MD_TYPE=$(curl -s -o /dev/null -D - -H "Accept: text/markdown" "$BASE/" | grep -i '^content-type:' | tr -d '\r')
if echo "$HOME_MD_TYPE" | grep -qi 'text/markdown'; then pass "homepage + Accept:text/markdown returns text/markdown"; else fail "homepage markdown content-type missing/wrong: $HOME_MD_TYPE"; fi

HOME_VARY=$(curl -s -o /dev/null -D - "$BASE/" | grep -i '^vary:' | tr -d '\r')
if echo "$HOME_VARY" | grep -qi 'accept'; then pass "homepage HTML response carries Vary: Accept"; else fail "homepage HTML response missing Vary: Accept"; fi

# ── 6. Regression check: normal pages and assets are unaffected ─────────
echo
echo "6. Regression check — existing pages and assets unaffected"
for path in "/about/" "/work/" "/thinking/" "/work/ikea-home-services/" "/contact/" "/privacy/" "/es/"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$path")
  TYPE=$(curl -s -o /dev/null -D - "$BASE$path" | grep -i '^content-type:' | tr -d '\r')
  if [ "$CODE" = "200" ] && echo "$TYPE" | grep -qi 'text/html'; then
    pass "$path -> 200, text/html"
  else
    fail "$path -> $CODE, $TYPE (expected 200, text/html)"
  fi
done

CSS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/assets/css/main.css")
CSS_TYPE=$(curl -s -o /dev/null -D - "$BASE/assets/css/main.css" | grep -i '^content-type:' | tr -d '\r')
if [ "$CSS_CODE" = "200" ] && echo "$CSS_TYPE" | grep -qi 'text/css'; then
  pass "/assets/css/main.css -> 200, text/css (untouched by middleware)"
else
  fail "/assets/css/main.css -> $CSS_CODE, $CSS_TYPE"
fi

SITEMAP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/sitemap.xml")
if [ "$SITEMAP_CODE" = "200" ]; then pass "/sitemap.xml -> 200"; else fail "/sitemap.xml -> $SITEMAP_CODE"; fi

ROBOTS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/robots.txt")
if [ "$ROBOTS_CODE" = "200" ]; then pass "/robots.txt -> 200"; else fail "/robots.txt -> $ROBOTS_CODE"; fi

echo
if [ "$FAIL" = "0" ]; then
  echo "All checks passed."
else
  echo "One or more checks FAILED — see above."
fi
exit $FAIL
