# ─── Configuration ───────────────────────────────────────────
GITHUB_TOKEN="${GITHUB_TOKEN}" 
REPO_NAME=$(basename "$PWD")
DESCRIPTION=$(basename "$PWD")
PRIVATE=false          # true for private, false for public
AUTO_INIT=false        # true to add a default README, false for truly empty

# ─── Create repo via GitHub API ──────────────────────────────
echo "Creating repository: $REPO_NAME ..."

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"$DESCRIPTION\",
    \"private\": $PRIVATE,
    \"auto_init\": $AUTO_INIT
  }")

# ─── Parse response ──────────────────────────────────────────
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" -eq 201 ]; then
  REPO_URL=$(echo "$BODY" | grep -o '"html_url": "[^"]*"' | head -1 | cut -d'"' -f4)
  echo "✅ Repository created successfully!"
  echo "🔗 URL: $REPO_URL/$REPO_NAME.git"
else
  echo "❌ Failed to create repository (HTTP $HTTP_CODE)"
  echo "$BODY" | grep -o '"message": "[^"]*"'
fi

# ─── Filter Git Commits & Push ────────────────────────────────
git filter-branch -f --env-filter " GIT_AUTHOR_NAME='apogod13' GIT_AUTHOR_EMAIL='apo.god.0585@gmail.com' GIT_COMMITTER_NAME='apogod13' GIT_COMMITTER_EMAIL='apo.god.0585@gmail.com'" HEAD
git remote set-url origin "$REPO_URL/$REPO_NAME.git"
git push