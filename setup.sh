#!/bin/bash

# Exit on error
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting project setup...${NC}"

# 1. Version Checks
echo -e "\n${YELLOW}Checking environment versions...${NC}"

# Node.js
NODE_VERSION=$(node -v)
echo -e "Node.js: ${GREEN}${NODE_VERSION}${NC}"

# Next.js & React (from package.json)
NEXT_VERSION=$(node -p "require('./package.json').dependencies.next")
REACT_VERSION=$(node -p "require('./package.json').dependencies.react")
echo -e "Next.js: ${GREEN}${NEXT_VERSION}${NC}"
echo -e "React:   ${GREEN}${REACT_VERSION}${NC}"

# Package Manager Detection
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
else
    PACKAGE_MANAGER="npm"
fi
echo -e "Using package manager: ${GREEN}${PACKAGE_MANAGER}${NC}"

# 2. Git Initialization
if [ ! -d ".git" ]; then
    echo -e "\n${YELLOW}Initializing git repository...${NC}"
    git init
    echo -e "✅ Git repository initialized."
else
    echo -e "\n${GREEN}⚠️ Git repository already exists. Skipping init.${NC}"
fi

# 3. Environment Setup
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        echo -e "\n${YELLOW}Creating .env.local from .env.example...${NC}"
        cp .env.example .env.local
        echo -e "✅ .env.local created."
    else
        echo -e "\n${RED}❌ .env.example not found. Skipping env setup.${NC}"
    fi
else
    echo -e "\n${GREEN}⚠️ .env.local already exists. Skipping.${NC}"
fi

# 4. Dependency Installation
echo -e "\n${YELLOW}Installing dependencies using ${PACKAGE_MANAGER}...${NC}"
$PACKAGE_MANAGER install
echo -e "✅ Dependencies installed."

# 5. Cleanup
echo -e "\n${YELLOW}Cleaning up setup files...${NC}"

# Remove .env.example
if [ -f .env.example ]; then
    rm .env.example
    echo -e "✅ .env.example removed."
fi

# Remove setup script from package.json
echo -e "Removing 'setup' script from package.json..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (pkg.scripts && pkg.scripts.setup) {
  delete pkg.scripts.setup;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
}
"
echo -e "✅ 'setup' script removed from package.json."

# Self-deletion
SCRIPT_NAME=$0
echo -e ""

echo -e "${GREEN}🎉 Project setup complete!${NC}"
echo -e "Self-destructing ${SCRIPT_NAME} in 3 seconds..."
sleep 3
rm -- "$SCRIPT_NAME"

echo -e "\n${GREEN}🚀 Ready to go! Run:${NC}"
echo -e "${YELLOW}${PACKAGE_MANAGER} run dev${NC}"
