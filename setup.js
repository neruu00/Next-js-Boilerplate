const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// --- Colors & Branding ---
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const NC = '\x1b[0m'; // No Color

const DIVIDER = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

const log = {
  header: (msg) => console.log(`\n${CYAN}${BOLD}${DIVIDER}${NC}\n${CYAN}${BOLD}  ${msg}${NC}\n${CYAN}${BOLD}${DIVIDER}${NC}\n`),
  section: (msg) => console.log(`${BOLD}${DIVIDER}${NC}\n${BOLD} ${msg}${NC}\n${BOLD}${DIVIDER}${NC}`),
  item: (msg, status = '') => console.log(`  ${status} ${msg}`),
  info: (msg) => log.item(msg, `${CYAN}•${NC}`),
  success: (msg) => log.item(msg, `${GREEN}✓${NC}`),
  warn: (msg) => log.item(msg, `${YELLOW}!${NC}`),
  error: (msg) => log.item(msg, `${RED}✗${NC}`),
};

// --- Helper Functions ---
const run = (cmd, silent = true) => {
  try {
    return execSync(cmd, { stdio: silent ? 'ignore' : 'inherit', encoding: 'utf-8' });
  } catch (e) {
    return null;
  }
};

const main = async () => {
  log.header('🚀 NEXT.JS BOILERPLATE SETUP');

  // STEP 1: Environment Check
  log.section('🔍 STEP 1: Environment Check');
  const nodeVersion = process.version;
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const nextVersion = pkg.dependencies.next;
  const reactVersion = pkg.dependencies.react;

  log.info(`Node.js:          ${GREEN}${nodeVersion}${NC}`);
  log.info(`Next.js:          ${GREEN}${nextVersion}${NC}`);
  log.info(`React:            ${GREEN}${reactVersion}${NC}`);

  const userAgent = process.env.npm_config_user_agent || '';
  const isPnpm = userAgent.includes('pnpm') || fs.existsSync('pnpm-lock.yaml');
  const packageManager = isPnpm ? 'pnpm' : 'npm';
  log.info(`Package Manager:  ${GREEN}${packageManager}${NC}\n`);

  // STEP 2: Git & Environment Setup
  log.section('📦 STEP 2: Git & Environment Setup');

  // 2.1 Git Reset
  log.info('Resetting Git history...');
  run('rm -rf .git');
  run('git init --quiet');
  log.success('Git repository initialized (Fresh state).');

  // 2.2 Env Setup
  if (!fs.existsSync('.env.local') && fs.existsSync('.env.example')) {
    log.info('Creating .env.local...');
    fs.copyFileSync('.env.example', '.env.local');
    log.success('.env.local created.');
  } else if (fs.existsSync('.env.local')) {
    log.warn('.env.local already exists. Skipping.');
  }

  // 2.3 Dependencies
  log.info(`Installing dependencies using ${packageManager}...`);
  run(`${packageManager} install`, false);
  log.success('Dependencies installed.\n');

  // STEP 3: Final Cleanup & Single Commit
  log.section('🧹 STEP 3: Final Cleanup & Configure');

  // 3.1 Cleanup files
  if (fs.existsSync('.env.example')) {
    fs.unlinkSync('.env.example');
    log.success('Removed .env.example');
  }

  // 3.2 Update package.json (Remove setup script)
  log.info('Cleaning package.json...');
  delete pkg.scripts.setup;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  log.success('package.json optimized.');

  // 3.3 Delete setup scripts
  log.info('Removing setup files...');
  if (fs.existsSync('setup.js')) fs.unlinkSync('setup.js');
  const selfName = path.basename(__filename);
  
  // 3.4 The Grand Finale: Single Commit
  log.info('Generating single initial commit...');
  try {
    // Delete self last to ensure commands finish
    if (fs.existsSync(selfName)) fs.unlinkSync(selfName);
    run('git add -A');
    run('git commit -m "initial project setup" --quiet');
    log.success('Single commit generated: "initial project setup"\n');
  } catch (e) {
    log.error('Failed to create final commit.');
  }

  // Success Banner
  console.log(`${BOLD}${GREEN}🎉 PROJECT SETUP COMPLETE!${NC}`);
  console.log(`${GREEN}${DIVIDER}${NC}`);
  console.log(`  ${BOLD}Next Steps:${NC}`);
  console.log(`  1. Run the dev server:`);
  console.log(`     ${YELLOW}${packageManager} run dev${NC}`);
  console.log(`  2. Start building your app in /src`);
  console.log(`${GREEN}${DIVIDER}${NC}\n`);

  process.exit(0);
};

main().catch((err) => {
  log.error('Setup failed unexpectedly.');
  console.error(err);
  process.exit(1);
});
