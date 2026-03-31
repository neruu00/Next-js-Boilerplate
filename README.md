# Next.js Boilerplate

This is a Next.js boilerplate designed to help you quickly start developing web applications based on a modern tech stack.

### Features

- **Next.js 15+** with App Router
- **React 19+** for modern component-based architecture
- **TypeScript** for strict type safety
- **Tailwind CSS 4.0** with **`prettier-plugin-tailwindcss`** for auto-sorting
- **Styling Utilities**: **`tailwind-merge`** & **`clsx`** (`cn` helper) for cleaner class management
- **Component Variants**: **`class-variance-authority` (CVA)** for type-safe UI components
- **Automated Quality Control**: **Husky** & **lint-staged** (ESLint & Prettier run automatically on commit)
- **Advanced Linting**: **`eslint-plugin-unused-imports`** for automatic cleanup
- **Absolute Imports**: Using the `@/*` path alias

### Getting Started

#### 1. Project Initialization

This boilerplate includes a smart setup script to get you started in seconds.

```bash
# 1. Clone the repository
git clone https://github.com/Woolegend/Next-js-Boilerplate.git new-next-app
cd new-next-app

# 2. Run the setup script (pnpm recommended)
pnpm run setup
```

The `setup` command automatically performs the following:
- Validates your environment (Node, Next, React versions)
- Creates `.env.local` from `.env.example` (if exists)
- Installs all dependencies
- **Automates Git**: Initializes a fresh repository, stages all files, and creates an initial "setup project" commit.
- **Self-Cleanup**: Removes the setup script from `package.json`, deletes `.env.example`, and deletes the `setup.sh` file itself.

### Recommended VS Code Extensions

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
  - *Note: Already configured in `.vscode/settings.json` to support `cn` and `cva`.*

### Available Scripts

- `pnpm dev`: Runs the application in development mode.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Checks for code style issues.
- `pnpm lint:fix`: Automatically fixes ESLint and formatting issues.
- `pnpm format`: Formats all files using Prettier.
- `pnpm setup`: **(Run once)** Initial automation to prepare your project.

### License
This project is licensed under the MIT License.