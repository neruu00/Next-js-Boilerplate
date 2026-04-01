#!/bin/bash

# Exit on error
set -e

# Colors & Formatting
BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Visual Elements
DIVIDER="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -e "\n${CYAN}${BOLD}${DIVIDER}${NC}"
echo -e "${CYAN}${BOLD}  🚀 NEXT.JS BOILERPLATE SETUP${NC}"
echo -e "${CYAN}${BOLD}${DIVIDER}${NC}\n"

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD} 🔍 STEP 1: Environment Check${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Node.js check
NODE_VERSION=$(node -v)
echo -e "  - Node.js:          ${GREEN}${NODE_VERSION}${NC}"

# Next.js & React check
NEXT_VERSION=$(node -p "require('./package.json').dependencies.next")
REACT_VERSION=$(node -p "require('./package.json').dependencies.react")
echo -e "  - Next.js:          ${GREEN}${NEXT_VERSION}${NC}"
echo -e "  - React:            ${GREEN}${REACT_VERSION}${NC}"

# Package Manager Detection
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
else
    PACKAGE_MANAGER="npm"
fi
echo -e "  - Package Manager:  ${GREEN}${PACKAGE_MANAGER}${NC}\n"

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD} 📦 STEP 2: Git & Environment Setup${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Git Initialization (Original State)
echo -e "  [1/3] Resetting Git history..."
rm -rf .git
git init --quiet
git add .
git commit -m "initial boilerplate" --quiet
echo -e "  ${GREEN}✓${NC} Initial boilerplate committed."

# Environment Setup
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        echo -e "  [2/3] Creating .env.local..."
        cp .env.example .env.local
        echo -e "  ${GREEN}✓${NC} .env.local created."
    else
        echo -e "  ${RED}✗${NC} .env.example not found. Skipping."
    fi
else
    echo -e "  ${YELLOW}!${NC} .env.local already exists. Skipping."
fi

echo -e "  [3/3] Installing dependencies (${PACKAGE_MANAGER})..."
$PACKAGE_MANAGER install --silent > /dev/null 2>&1
echo -e "  ${GREEN}✓${NC} Dependencies installed.\n"

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD} 🧹 STEP 3: Final Cleanup & Configure${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Remove .env.example
if [ -f .env.example ]; then
    rm .env.example
    echo -e "  - Removing .env.example... ${GREEN}Done${NC}"
fi

# Remove setup script from package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (pkg.scripts && pkg.scripts.setup) {
  delete pkg.scripts.setup;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
}
"
echo -e "  - Cleaning package.json...  ${GREEN}Done${NC}"

# Final self-deletion and commit
# We use a subshell to ensure the script finishes after the commit stages the deletion
{
  echo -e "  - Finalizing Git...         ${GREEN}Done${NC}"
  git add .
  rm -- "$0"
  git add "$0"
  git commit -m "setup project" --quiet
}

echo -e "\n${BOLD}${GREEN}🎉 PROJECT SETUP COMPLETE!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${BOLD}Next Steps:${NC}"
echo -e "  1. Run the dev server:"
echo -e "     ${YELLOW}${PACKAGE_MANAGER} run dev${NC}"
echo -e "  2. Start building your app in /src"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}${PACKAGE_MANAGER} run dev${NC}"
