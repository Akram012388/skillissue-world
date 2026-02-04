# Tech Stack

## SkillIssue.world — Production-Grade Stack

**Philosophy**: Build like pros, not amateurs. Database from day one. Tests from day one. CI/CD from day one.

---

## Stack Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  Next.js 14 (App Router) + TypeScript + Tailwind CSS            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  Convex (Real-time DB + Functions + TypeScript-native)          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        TESTING                                   │
│  Playwright (E2E) + Vitest (Unit) + React Testing Library       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD                                     │
│  GitHub Actions → Vercel (Preview/Prod) + Convex Deploy         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Frontend

### Framework: Next.js 16 (Latest Stable)

| Choice | Rationale |
|--------|-----------|
| **Next.js 16** | Latest stable, Turbopack default, no deprecation debt |
| **App Router** | Modern patterns, layouts, loading states |
| **Server Components** | Faster initial loads, less client JS |
| **Client Components** | Only where interactivity needed (search, copy) |
| **Turbopack** | Now default bundler — faster dev server |

**Why 16, not 14 or 15?**
- We're starting fresh — no migration pain
- 15's async APIs were transitional (sync access removed in 16)
- Turbopack is stable and default in 16
- Security patches prioritized for latest
- `next lint` removed — we use Biome anyway

```bash
bunx create-next-app@latest skillissue-world --typescript --tailwind --app --src-dir --import-alias "@/*"
```

### Language: TypeScript (Strict)

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Styling: Tailwind CSS

| Choice | Rationale |
|--------|-----------|
| **Tailwind CSS** | Utility-first, zero runtime, tree-shakes |
| **No component library** | Keep it lean, custom components only |
| **CSS variables** | Theme tokens for consistency |
| **System fonts** | Zero font downloads |

```css
/* Minimal, Wikipedia-like palette */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #1a1a1a;
  --text-secondary: #4a4a4a;
  --accent: #0066cc;
  --success: #22c55e;
  --border: #e5e7eb;
}
```

### UI Components

| Component | Implementation |
|-----------|----------------|
| Search | Custom, keyboard-optimized |
| SkillCard | Custom, minimal DOM |
| CopyButton | Custom + `navigator.clipboard` |
| Toast | Custom, CSS animations |
| AgentToggle | Custom radio group |

**No heavy dependencies**: No Radix, no Headless UI, no shadcn for MVP. Keep bundle tiny.

### URL State Management: nuqs

Type-safe URL search params for shareable, bookmarkable state.

```bash
npm install nuqs
```

**Why nuqs?**
- Shareable URLs: `skillissue.world?q=react&agent=claude-code&tag=frontend`
- Browser history works correctly (back/forward)
- SSR-friendly with Next.js App Router
- Type-safe with parsers
- Built-in debounce/throttle

```typescript
// src/hooks/useSearchParams.ts
import {
  useQueryState,
  parseAsString,
  parseAsStringLiteral,
  parseAsArrayOf,
} from 'nuqs';

const AGENTS = ['claude-code', 'codex-cli', 'cursor', 'open-code', 'gemini-cli'] as const;

export function useSkillSearchParams() {
  // Search query - debounced to avoid URL spam
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ throttleMs: 300 })
  );

  // Selected agent - persisted in URL
  const [agent, setAgent] = useQueryState(
    'agent',
    parseAsStringLiteral(AGENTS).withDefault('claude-code')
  );

  // Category filter
  const [tag, setTag] = useQueryState('tag', parseAsString);

  // Section (hit-picks, latest, hot)
  const [section, setSection] = useQueryState('section', parseAsString);

  return {
    query, setQuery,
    agent, setAgent,
    tag, setTag,
    section, setSection,
  };
}
```

```typescript
// src/app/page.tsx
import { Suspense } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { SkillList } from '@/components/SkillList';

// nuqs requires Suspense boundary at page level for SSR
export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const { query, setQuery, agent, setAgent, tag } = useSkillSearchParams();

  return (
    <main>
      <SearchBar value={query} onChange={setQuery} />
      <AgentToggle value={agent} onChange={setAgent} />
      <SkillList query={query} agent={agent} tag={tag} />
    </main>
  );
}
```

**URL Examples:**
| User Action | Resulting URL |
|-------------|---------------|
| Searches "react" | `/?q=react` |
| Filters by tag | `/?q=react&tag=frontend` |
| Switches to Cursor | `/?q=react&agent=cursor` |
| Direct link to skill | `/skill/vercel-labs-react-best-practices?agent=codex-cli` |

All states are shareable. Copy URL, paste anywhere, land with exact same view.

---

## 2. Database: Convex

### Why Convex over Supabase?

| Factor | Convex | Supabase |
|--------|--------|----------|
| **TypeScript** | Native, end-to-end type safety | Good, but SQL-first |
| **Real-time** | Built-in, automatic | Requires setup |
| **Functions** | TypeScript functions, no SQL | SQL + Edge functions |
| **DX** | `npx convex dev` hot reload | Dashboard + migrations |
| **Pricing** | Generous free tier | Generous free tier |
| **Fit for us** | ✅ TS-native, fast iteration | Overkill for MVP |

### Convex Setup

```bash
npm install convex
npx convex init
```

### Schema Definition

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  skills: defineTable({
    // Identifiers
    slug: v.string(),              // "vercel-labs-react-best-practices"
    name: v.string(),              // "React Best Practices"
    org: v.string(),               // "vercel-labs"
    repo: v.string(),              // "react-best-practices"

    // Content
    description: v.string(),
    longDescription: v.optional(v.string()),

    // Commands by agent
    commands: v.object({
      claudeCode: v.string(),
      codexCli: v.optional(v.string()),
      cursor: v.optional(v.string()),
      openCode: v.optional(v.string()),
      geminiCli: v.optional(v.string()),
    }),

    // Metadata
    tags: v.array(v.string()),
    agents: v.array(v.string()),

    // Metrics
    installs: v.number(),
    stars: v.number(),
    velocity: v.optional(v.number()),

    // Timestamps
    lastUpdated: v.string(),       // ISO 8601
    addedAt: v.string(),

    // Links
    repoUrl: v.string(),
    docsUrl: v.optional(v.string()),

    // Flags
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

  // Analytics (optional, for tracking copies)
  events: defineTable({
    skillSlug: v.string(),
    action: v.string(),            // "copy" | "repo_click" | "view"
    agent: v.optional(v.string()), // Which agent command was copied
    timestamp: v.string(),
  }).index("by_skill", ["skillSlug"]),
});
```

### Convex Functions

```typescript
// convex/skills.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all skills (with optional filters)
export const list = query({
  args: {
    tag: v.optional(v.string()),
    org: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("skills");

    if (args.tag) {
      // Filter by tag in application code (Convex doesn't support array contains in index)
      const all = await q.collect();
      return all.filter(s => s.tags.includes(args.tag!)).slice(0, args.limit ?? 100);
    }

    if (args.org) {
      q = q.withIndex("by_org", q => q.eq("org", args.org!));
    }

    return q.take(args.limit ?? 100);
  },
});

// Full-text search
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) {
      return ctx.db.query("skills").withIndex("by_installs").order("desc").take(20);
    }
    return ctx.db
      .query("skills")
      .withSearchIndex("search_skills", q => q.search("name", args.query))
      .take(50);
  },
});

// Get single skill by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("skills")
      .withIndex("by_slug", q => q.eq("slug", args.slug))
      .unique();
  },
});

// Hit Picks (top by installs)
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

// Latest Drops (newest updated)
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

// Track event (copy, click, view)
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

### Convex + Next.js Integration

```typescript
// src/app/providers.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

```typescript
// src/app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## 3. Testing

### Testing Pyramid

```
        ┌─────────┐
        │   E2E   │  ← Playwright (critical paths)
        │ (few)   │
       ─┴─────────┴─
      ┌─────────────┐
      │ Integration │  ← Vitest + RTL (components)
      │  (some)     │
     ─┴─────────────┴─
    ┌─────────────────┐
    │      Unit       │  ← Vitest (utils, logic)
    │     (many)      │
    └─────────────────┘
```

### E2E Testing: Playwright

```bash
npm init playwright@latest
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['github'],  // GitHub Actions annotations
  ],
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
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Critical E2E Test Scenarios

```typescript
// e2e/search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test('homepage loads with search bar focused via / key', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('/');
    await expect(page.getByRole('searchbox')).toBeFocused();
  });

  test('search returns relevant results', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('searchbox').fill('react');
    await expect(page.getByTestId('skill-card')).toHaveCount.greaterThan(0);
    await expect(page.getByTestId('skill-card').first()).toContainText(/react/i);
  });

  test('empty search shows hit picks', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hit-picks-section')).toBeVisible();
  });
});
```

```typescript
// e2e/copy.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Copy Command', () => {
  test('copy button copies Claude Code command to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');

    // Focus first skill
    const firstSkill = page.getByTestId('skill-card').first();
    await firstSkill.hover();

    // Click copy button
    await firstSkill.getByRole('button', { name: /copy/i }).click();

    // Verify clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toMatch(/^claude mcp add/);

    // Verify toast
    await expect(page.getByText(/copied/i)).toBeVisible();
  });

  test('keyboard shortcut c copies command', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');

    // Navigate to first skill with arrow
    await page.keyboard.press('ArrowDown');

    // Press c to copy
    await page.keyboard.press('c');

    // Verify clipboard has command
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toMatch(/^claude mcp add/);
  });
});
```

```typescript
// e2e/keyboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test('/ focuses search from anywhere', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('/');
    await expect(page.getByRole('searchbox')).toBeFocused();
  });

  test('Escape clears search and blurs', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('searchbox').fill('test');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('searchbox')).toHaveValue('');
    await expect(page.getByRole('searchbox')).not.toBeFocused();
  });

  test('arrow keys navigate skill list', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('skill-card').first()).toHaveAttribute('data-selected', 'true');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('skill-card').nth(1)).toHaveAttribute('data-selected', 'true');
  });

  test('g opens repo in new tab', async ({ page, context }) => {
    await page.goto('/');
    await page.keyboard.press('ArrowDown');

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.keyboard.press('g'),
    ]);

    expect(newPage.url()).toMatch(/github\.com/);
  });
});
```

```typescript
// e2e/agent-toggle.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Agent Toggle', () => {
  test('defaults to Claude Code', async ({ page }) => {
    await page.goto('/');
    const command = page.getByTestId('skill-card').first().getByTestId('install-command');
    await expect(command).toContainText('claude mcp add');
  });

  test('switching agent updates command', async ({ page }) => {
    await page.goto('/');
    const card = page.getByTestId('skill-card').first();

    // Switch to Codex CLI
    await card.getByRole('button', { name: /codex/i }).click();

    const command = card.getByTestId('install-command');
    await expect(command).toContainText('codex skills install');
  });

  test('agent preference persists', async ({ page }) => {
    await page.goto('/');

    // Switch to Cursor
    await page.getByTestId('skill-card').first()
      .getByRole('button', { name: /cursor/i }).click();

    // Reload
    await page.reload();

    // Should still be Cursor
    const command = page.getByTestId('skill-card').first().getByTestId('install-command');
    await expect(command).toContainText('cursor skills add');
  });
});
```

### Unit Testing: Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```typescript
// vitest.config.ts
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
      exclude: ['node_modules/', 'e2e/', '*.config.*'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});
```

```typescript
// src/lib/search.test.ts
import { describe, it, expect } from 'vitest';
import { searchSkills, calculateRelevance } from './search';

describe('searchSkills', () => {
  const mockSkills = [
    { name: 'React Best Practices', org: 'vercel-labs', tags: ['react'], installs: 1000 },
    { name: 'TypeScript Patterns', org: 'anthropics', tags: ['typescript'], installs: 500 },
    { name: 'React Security', org: 'openai', tags: ['react', 'security'], installs: 200 },
  ];

  it('returns all skills for empty query', () => {
    expect(searchSkills(mockSkills, '')).toHaveLength(3);
  });

  it('filters by name', () => {
    const results = searchSkills(mockSkills, 'react');
    expect(results).toHaveLength(2);
    expect(results.every(s => s.name.toLowerCase().includes('react'))).toBe(true);
  });

  it('ranks exact matches higher', () => {
    const results = searchSkills(mockSkills, 'react best');
    expect(results[0].name).toBe('React Best Practices');
  });

  it('searches tags', () => {
    const results = searchSkills(mockSkills, 'security');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('React Security');
  });
});

describe('calculateRelevance', () => {
  it('scores exact name match highest', () => {
    const skill = { name: 'test', org: 'org', tags: [], installs: 0 };
    expect(calculateRelevance(skill, 'test')).toBeGreaterThan(
      calculateRelevance(skill, 'tes')
    );
  });
});
```

---

## 4. CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
  NEXT_PUBLIC_CONVEX_URL: ${{ secrets.NEXT_PUBLIC_CONVEX_URL }}

jobs:
  # ─────────────────────────────────────────────────────
  # Lint & Type Check (Biome + Bun - blazing fast)
  # ─────────────────────────────────────────────────────
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: bun install --frozen-lockfile

      - name: Biome CI (lint + format)
        run: bun biome ci .

      - name: TypeScript
        run: bun typecheck

  # ─────────────────────────────────────────────────────
  # Unit Tests
  # ─────────────────────────────────────────────────────
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: bun install --frozen-lockfile

      - name: Run Vitest
        run: bun test:unit --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json

  # ─────────────────────────────────────────────────────
  # E2E Tests
  # ─────────────────────────────────────────────────────
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [lint, unit-tests]
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: bun install --frozen-lockfile

      - name: Install Playwright Browsers
        run: bunx playwright install --with-deps

      - name: Setup Convex (test instance)
        run: bunx convex deploy --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL

      - name: Run Playwright
        run: bun test:e2e
        env:
          PLAYWRIGHT_BASE_URL: http://localhost:3000

      - name: Upload Playwright Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  # ─────────────────────────────────────────────────────
  # Build
  # ─────────────────────────────────────────────────────
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, unit-tests]
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: bun install --frozen-lockfile

      - name: Build Next.js
        run: bun run build
        env:
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.NEXT_PUBLIC_CONVEX_URL }}

  # ─────────────────────────────────────────────────────
  # Deploy Preview (PRs)
  # ─────────────────────────────────────────────────────
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    needs: [e2e-tests, build]
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          github-comment: true

  # ─────────────────────────────────────────────────────
  # Deploy Production (main)
  # ─────────────────────────────────────────────────────
  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-latest
    needs: [e2e-tests, build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: bun install --frozen-lockfile

      - name: Deploy Convex
        run: bunx convex deploy --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}

      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Pre-commit Hooks (Husky + Biome)

```bash
bun add -D husky
bunx husky init
```

```bash
# .husky/pre-commit
# Biome handles both linting and formatting - blazing fast
bun biome check --staged --write --no-errors-on-unmatched
bun typecheck
```

```bash
# .husky/pre-push
bun test:unit
```

**Why no lint-staged?**
Biome's `--staged` flag handles staged files natively. One less dependency, simpler setup.

**Pre-commit runs in ~1 second** with Bun + Biome (vs 15-30s with npm + ESLint + Prettier).

---

## 5. Code Quality

### Why Biome over ESLint + Prettier?

| Factor | Biome | ESLint + Prettier |
|--------|-------|-------------------|
| **Speed** | 10-100x faster (Rust) | Slow (JS-based) |
| **Config** | One file, one tool | Two tools, two configs |
| **CI time** | ~2 seconds | ~15-30 seconds |
| **TypeScript** | Native support | Needs parser plugin |
| **Maintenance** | Single dependency | Multiple deps to update |
| **Philosophy** | Speed > Choice ✅ | More customizable |

**Decision**: Use **Biome** — aligns with our speed-first philosophy.

### Biome Configuration

```bash
bun add -D @biomejs/biome
bunx biome init
```

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExtraBooleanCast": "error",
        "noMultipleSpacesInRegularExpressionLiterals": "error",
        "noUselessCatch": "error",
        "noUselessTypeConstraint": "error"
      },
      "correctness": {
        "noConstAssign": "error",
        "noConstantCondition": "error",
        "noEmptyCharacterClassInRegex": "error",
        "noEmptyPattern": "error",
        "noGlobalObjectCalls": "error",
        "noInvalidConstructorSuper": "error",
        "noInvalidNewBuiltin": "error",
        "noNonoctalDecimalEscape": "error",
        "noPrecisionLoss": "error",
        "noSelfAssign": "error",
        "noSetterReturn": "error",
        "noSwitchDeclarations": "error",
        "noUndeclaredVariables": "error",
        "noUnreachable": "error",
        "noUnreachableSuper": "error",
        "noUnsafeFinally": "error",
        "noUnsafeOptionalChaining": "error",
        "noUnusedLabels": "error",
        "noUnusedPrivateClassMembers": "error",
        "noUnusedVariables": "error",
        "useArrayLiterals": "error",
        "useIsNan": "error",
        "useValidForDirection": "error",
        "useYield": "error"
      },
      "style": {
        "noNamespace": "error",
        "useAsConstAssertion": "error",
        "useBlockStatements": "error",
        "useConsistentArrayType": {
          "level": "error",
          "options": { "syntax": "shorthand" }
        },
        "useForOf": "error",
        "useShorthandFunctionType": "error"
      },
      "suspicious": {
        "noAsyncPromiseExecutor": "error",
        "noCatchAssign": "error",
        "noClassAssign": "error",
        "noCompareNegZero": "error",
        "noControlCharactersInRegex": "error",
        "noDebugger": "error",
        "noDuplicateCase": "error",
        "noDuplicateClassMembers": "error",
        "noDuplicateObjectKeys": "error",
        "noDuplicateParameters": "error",
        "noEmptyBlockStatements": "error",
        "noExplicitAny": "error",
        "noExtraNonNullAssertion": "error",
        "noFallthroughSwitchClause": "error",
        "noFunctionAssign": "error",
        "noGlobalAssign": "error",
        "noImportAssign": "error",
        "noMisleadingCharacterClass": "error",
        "noMisleadingInstantiation": "error",
        "noPrototypeBuiltins": "error",
        "noRedeclare": "error",
        "noShadowRestrictedNames": "error",
        "noUnsafeDeclarationMerging": "error",
        "noUnsafeNegation": "error",
        "useGetterReturn": "error",
        "useValidTypeof": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5",
      "semicolons": "always"
    }
  },
  "json": {
    "formatter": {
      "trailingCommas": "none"
    }
  }
}
```

---

## 6. Package.json Scripts

```json
{
  "name": "skillissue-world",
  "version": "0.1.0",
  "private": true,
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
    "prepare": "husky",
    "convex:dev": "convex dev",
    "convex:deploy": "convex deploy"
  },
  "dependencies": {
    "convex": "^1.x",
    "next": "^16.x",
    "nuqs": "^2.x",
    "react": "^19.x",
    "react-dom": "^19.x"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.x",
    "@playwright/test": "^1.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/react": "^16.x",
    "@types/node": "^22.x",
    "@types/react": "^19.x",
    "@vitejs/plugin-react": "^4.x",
    "concurrently": "^9.x",
    "husky": "^9.x",
    "jsdom": "^26.x",
    "tailwindcss": "^4.x",
    "typescript": "^5.x",
    "vitest": "^3.x"
  }
}
```

---

## 7. Environment Variables

```bash
# .env.local (local development)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key

# Vercel (production)
# Set in Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_CONVEX_URL=xxx
CONVEX_DEPLOY_KEY=xxx
```

---

## 8. Directory Structure (Final)

```
skillissue-world/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   ├── pre-commit
│   └── pre-push
├── convex/
│   ├── _generated/
│   ├── schema.ts
│   └── skills.ts
├── e2e/
│   ├── search.spec.ts
│   ├── copy.spec.ts
│   ├── keyboard.spec.ts
│   └── agent-toggle.spec.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   ├── globals.css
│   │   └── skill/
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   ├── SkillCard.tsx
│   │   ├── SkillList.tsx
│   │   ├── AgentToggle.tsx
│   │   ├── CopyButton.tsx
│   │   ├── KeyboardHandler.tsx
│   │   └── Toast.tsx
│   ├── hooks/
│   │   ├── useSearch.ts
│   │   ├── useKeyboard.ts
│   │   └── useCopy.ts
│   ├── lib/
│   │   ├── search.ts
│   │   ├── search.test.ts
│   │   └── clipboard.ts
│   ├── test/
│   │   └── setup.ts
│   └── types/
│       └── index.ts
├── docs/
│   ├── VISION.md
│   ├── PRD.md
│   ├── ADR.md
│   ├── SPECS.md
│   ├── RULES.md
│   ├── GUIDELINES.md
│   ├── TECH_STACK.md
│   ├── CHANGELOG.md
│   ├── PROGRESS.md
│   ├── README.md
│   └── LICENSE
├── playwright.config.ts
├── vitest.config.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 9. Summary

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Next.js 16 | Latest stable, Turbopack default, no deprecation debt |
| **Language** | TypeScript (strict) | Type safety end-to-end |
| **Styling** | Tailwind CSS v4 | Utility-first, zero runtime |
| **Database** | Convex | TS-native, real-time, fast DX |
| **URL State** | nuqs | Type-safe URL params, shareable links |
| **E2E Tests** | Playwright | Cross-browser, reliable, fast |
| **Unit Tests** | Vitest | Fast, ESM-native, Vite-compatible |
| **CI/CD** | GitHub Actions | Native GH integration, free |
| **Hosting** | Vercel | Next.js native, preview deploys |
| **Quality** | Biome + Husky | 10-100x faster than ESLint+Prettier |
| **Package Mgr** | Bun | 4-10x faster than pnpm, modern |

---

## 10. Quick Reference

### Install Commands

```bash
# Create project
bunx create-next-app@latest skillissue-world --typescript --tailwind --app --src-dir

# Add core dependencies
bun add convex nuqs

# Add dev dependencies
bun add -D @biomejs/biome @playwright/test vitest @testing-library/react \
  @testing-library/jest-dom @vitejs/plugin-react jsdom husky concurrently

# Initialize tools
bunx convex init
bunx biome init
bunx playwright install
bunx husky init
```

### Daily Commands

```bash
bun dev               # Start dev server (Next + Convex + Turbopack)
bun check             # Lint + format check
bun check:fix         # Auto-fix lint + format
bun test:unit         # Run unit tests
bun test:e2e          # Run E2E tests
bun test              # Run all tests
bun run build         # Production build
```

---

## 11. Why This Stack?

### Speed Comparison (Real Benchmarks)

| Operation | Old Stack | New Stack | Improvement |
|-----------|-----------|-----------|-------------|
| `install` | 31.9s (pnpm) | 8.6s (Bun) | **3.7x faster** |
| `lint + format` | 15-30s (ESLint+Prettier) | 2s (Biome) | **10x faster** |
| `dev server start` | 3-5s (Webpack) | <1s (Turbopack) | **5x faster** |
| `pre-commit hook` | 15-30s | 1-2s | **15x faster** |

### No Migration Debt

Starting on Next.js 16 means:
- No async API deprecation warnings
- No `middleware.ts` → `proxy.ts` migration
- No `next lint` removal surprises
- Turbopack is already default

---

*This is a production-grade stack. No shortcuts. No excuses.*
*Speed > Choice > Completeness — even in our tooling.*
