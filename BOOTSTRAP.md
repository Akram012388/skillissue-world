# BOOTSTRAP.md

## Meta Prompt for Claude Code

Copy everything below the line and paste into Claude Code to bootstrap the entire project infrastructure.

---

```
You are setting up the skillissue.world project from scratch. Execute each phase systematically, confirming completion before moving to the next. Do not write any application code — only infrastructure, configuration, and tooling.

## Context

Read these files first to understand the project:
- CLAUDE.md (project context)
- docs/TECH_STACK.md (full technical specifications)
- docs/ADR.md (architecture decisions)

## Phase 1: GitHub Repository

1. Create a new GitHub repository:
   - Name: `skillissue-world`
   - Description: "The No-BS Encyclopedia for Official Agent Skills — Search, Copy, Go."
   - Public repository
   - No template
   - Add README: No (we have our own)
   - Add .gitignore: No (we have our own)
   - License: MIT

2. Initialize local git and push existing docs:
```bash
cd /path/to/skill-issue
git init
git add .
git commit -m "docs: initial project documentation and specifications"
git branch -M main
git remote add origin git@github.com:CodeAkram/skillissue-world.git
git push -u origin main
```

## Phase 2: Next.js 16 Project

1. Create Next.js project in a temp directory, then merge:
```bash
cd ..
bunx create-next-app@latest skillissue-temp --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint --turbopack
```

2. Move Next.js files into our repo (preserve our docs):
```bash
# Copy Next.js scaffolding into skill-issue, don't overwrite our files
cp -rn skillissue-temp/* skill-issue/
cp skillissue-temp/.* skill-issue/ 2>/dev/null || true
rm -rf skillissue-temp
cd skill-issue
```

3. Verify structure:
```
skill-issue/
├── src/
│   └── app/
├── public/
├── docs/           # Our existing docs
├── CLAUDE.md       # Our existing file
├── README.md       # Our existing file
├── .gitignore      # Our existing file
└── package.json    # From Next.js
```

## Phase 3: Core Dependencies

Install production dependencies:
```bash
bun add convex nuqs
```

Install dev dependencies:
```bash
bun add -D @biomejs/biome @playwright/test vitest @vitejs/plugin-react \
  @testing-library/react @testing-library/jest-dom jsdom \
  husky concurrently @types/node @types/react @types/react-dom
```

## Phase 4: Convex Setup

1. Initialize Convex:
```bash
bunx convex init
```

2. Create schema file `convex/schema.ts`:
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  skills: defineTable({
    slug: v.string(),
    name: v.string(),
    org: v.string(),
    repo: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    commands: v.object({
      claudeCode: v.string(),
      codexCli: v.optional(v.string()),
      cursor: v.optional(v.string()),
      openCode: v.optional(v.string()),
      geminiCli: v.optional(v.string()),
    }),
    tags: v.array(v.string()),
    agents: v.array(v.string()),
    installs: v.number(),
    stars: v.number(),
    velocity: v.optional(v.number()),
    lastUpdated: v.string(),
    addedAt: v.string(),
    repoUrl: v.string(),
    docsUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    verified: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_org", ["org"])
    .index("by_installs", ["installs"])
    .index("by_lastUpdated", ["lastUpdated"])
    .searchIndex("search_skills", {
      searchField: "name",
      filterFields: ["org", "tags"],
    }),

  events: defineTable({
    skillSlug: v.string(),
    action: v.string(),
    agent: v.optional(v.string()),
    timestamp: v.string(),
  }).index("by_skill", ["skillSlug"]),
});
```

3. Create basic query functions `convex/skills.ts`:
```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db.query("skills").take(args.limit ?? 100);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) {
      return ctx.db.query("skills").withIndex("by_installs").order("desc").take(20);
    }
    return ctx.db
      .query("skills")
      .withSearchIndex("search_skills", (q) => q.search("name", args.query))
      .take(50);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("skills")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const hitPicks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db
      .query("skills")
      .withIndex("by_installs")
      .order("desc")
      .take(args.limit ?? 10);
  },
});

export const latestDrops = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db
      .query("skills")
      .withIndex("by_lastUpdated")
      .order("desc")
      .take(args.limit ?? 10);
  },
});

export const trackEvent = mutation({
  args: {
    skillSlug: v.string(),
    action: v.string(),
    agent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("events", {
      ...args,
      timestamp: new Date().toISOString(),
    });
  },
});
```

## Phase 5: Biome Configuration

1. Initialize Biome:
```bash
bunx biome init
```

2. Replace `biome.json` with our config from docs/TECH_STACK.md (the full biome.json config).

## Phase 6: TypeScript Configuration

Update `tsconfig.json` with strict settings:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "convex/_generated"]
}
```

## Phase 7: Vitest Configuration

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'e2e/', '*.config.*', 'convex/_generated/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});
```

## Phase 8: Playwright Configuration

1. Install Playwright browsers:
```bash
bunx playwright install
```

2. Create `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['github']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

3. Create `e2e/` directory with a placeholder test `e2e/smoke.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/skill/i);
});
```

## Phase 9: Husky Setup

```bash
bunx husky init
```

Create `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bun biome check --staged --write --no-errors-on-unmatched
bun typecheck
```

Create `.husky/pre-push`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bun test:unit
```

Make them executable:
```bash
chmod +x .husky/pre-commit .husky/pre-push
```

## Phase 10: Package.json Scripts

Update `package.json` scripts section:
```json
{
  "scripts": {
    "dev": "concurrently \"convex dev\" \"next dev --turbopack\"",
    "build": "next build",
    "start": "next start",
    "check": "biome check .",
    "check:fix": "biome check --write .",
    "lint": "biome lint .",
    "lint:fix": "biome lint --write .",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:unit:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test": "bun test:unit && bun test:e2e",
    "typecheck": "tsc --noEmit",
    "ci": "biome ci . && bun typecheck && bun test",
    "prepare": "husky"
  }
}
```

## Phase 11: GitHub Actions CI/CD

Create `.github/workflows/ci.yml` with the full CI/CD pipeline from docs/TECH_STACK.md.

## Phase 12: Environment Files

Create `.env.example`:
```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOY_KEY=

# Vercel (for CI/CD)
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=
```

Create `.env.local` (gitignored):
```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## Phase 13: Install Official Skills

Install Vercel's official agent skills:
```bash
npx skills add vercel-labs/agent-skills --skill react-best-practices --skill web-design-guidelines
```

## Phase 14: Configure MCPs

1. Convex MCP (built into Convex CLI):
```bash
# Start Convex MCP server (for Claude Desktop/Cursor integration)
npx convex mcp start
```

2. Add to Claude Code settings or Cursor MCP config:
```json
{
  "mcpServers": {
    "convex": {
      "command": "npx",
      "args": ["-y", "convex@latest", "mcp", "start"]
    }
  }
}
```

## Phase 15: Verification

Run these commands to verify everything is set up:

```bash
# Check Biome
bun check

# Check TypeScript
bun typecheck

# Check Convex schema
bunx convex dev --once

# Run unit tests (should pass with empty test)
bun test:unit

# Verify Playwright is installed
bunx playwright --version

# Start dev server to verify it works
bun dev
```

## Phase 16: Initial Commit

```bash
git add .
git commit -m "chore: complete project infrastructure setup

- Next.js 16 with Turbopack
- Convex database with schema
- Biome linting/formatting
- Vitest unit testing
- Playwright E2E testing
- Husky pre-commit hooks
- GitHub Actions CI/CD
- TypeScript strict mode"

git push origin main
```

## Completion Checklist

Confirm each item is complete:

- [ ] GitHub repo created and initial docs pushed
- [ ] Next.js 16 scaffolded with App Router
- [ ] Convex initialized with schema and queries
- [ ] Biome configured and passing
- [ ] TypeScript strict mode enabled
- [ ] Vitest configured with test setup
- [ ] Playwright installed and configured
- [ ] Husky hooks set up
- [ ] Package.json scripts complete
- [ ] GitHub Actions CI/CD workflow created
- [ ] Environment files created
- [ ] Vercel skills installed
- [ ] All verification commands pass
- [ ] Initial commit pushed

Once all items are checked, respond with:
"Infrastructure complete. Ready to write application code."

DO NOT proceed to writing application code until explicitly instructed.
```

---

## Quick Start (TL;DR)

If you want the fastest path, run this single command after copying the meta prompt:

```bash
# One-liner to verify the meta prompt worked
bun check && bun typecheck && bun test:unit && echo "✅ Infrastructure ready"
```
