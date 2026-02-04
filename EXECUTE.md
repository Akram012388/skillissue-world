# EXECUTE.md — Claude Code Continuation Prompt

## Context

You are continuing the implementation of **SkillIssue.world** — a curated directory of official agent skills. The project has foundational infrastructure and UI components already built. Your job is to complete the remaining phases.

## Current State

**Completed:**
- ✅ Phase 1: Core Data Layer (providers, types, hooks)
- ✅ Phase 2: UI Components (10 components in src/components/)
- ✅ Phase 3: Page Assembly (homepage, skill detail, 404)

**Remaining:**
- ⏳ Phase 4: Keyboard System
- ⏳ Phase 5: Search & Filtering (nuqs URL state)
- ⏳ Phase 6: Polish & UX
- ⏳ Phase 7: Data Seeding (50+ official skills)
- ⏳ Phase 8: Testing (Vitest + Playwright)
- ⏳ Phase 9: Launch Prep

## First Steps

1. **Read the plan:** `cat docs/PLAN.md`
2. **Understand the codebase:**
   ```bash
   ls -la src/
   ls -la src/components/
   ls -la src/hooks/
   ls -la src/types/
   ls -la convex/
   ```
3. **Review key files:**
   - `src/types/index.ts` — Core type definitions
   - `src/hooks/useSkills.ts` — Data fetching hooks
   - `src/components/HomeContent.tsx` — Main homepage logic
   - `convex/skills.ts` — Convex queries/mutations

## Guiding Principle

```
Speed > Choice > Completeness
```

Build for the dev with 3 seconds between terminal tabs.

## Phase 4: Keyboard System

Create global keyboard navigation:

### 4.1 Create `src/hooks/useKeyboard.ts`
```typescript
// Global shortcuts:
// '/' → focus search
// 'Escape' → clear search, blur
//
// Skill-context shortcuts (when skill selected):
// 'c' → copy command
// 'g' → open repo
// '↑' → previous skill
// '↓' → next skill
// 'Enter' → navigate to skill
```

### 4.2 Create `src/components/KeyboardHandler.tsx`
- Wraps app, provides keyboard context
- Tracks selected skill index
- Handles all key events
- Prevents shortcuts when typing in inputs

### 4.3 Update `src/app/layout.tsx`
- Wrap children with KeyboardHandler
- Pass searchRef for focus control

### Verification
```bash
bun dev
# Test: Press '/' → search focuses
# Test: Type, then Escape → clears and blurs
# Test: Arrow keys navigate skill cards
# Test: 'c' copies selected skill command
# Test: 'g' opens repo in new tab
```

## Phase 5: Search & Filtering

### 5.1 Create `src/hooks/useSearchParams.ts`
Use nuqs for type-safe URL state:
```typescript
import { useQueryState, parseAsString } from 'nuqs';

export function useSearchParams() {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [agent, setAgent] = useQueryState('agent', parseAsString.withDefault('claude-code'));
  const [tag, setTag] = useQueryState('tag');

  return { query, setQuery, agent, setAgent, tag, setTag };
}
```

### 5.2 Update `src/components/HomeContent.tsx`
- Replace useState with useSearchParams
- URL updates on search/filter change
- Browser back/forward works

### Verification
```bash
bun dev
# Test: Search updates URL to /?q=something
# Test: Refresh page → search state persists
# Test: Browser back → previous search restored
# Test: Share URL → opens with correct state
```

## Phase 6: Polish & UX

### 6.1 Update `src/app/globals.css`
- CSS variables for colors, spacing
- Focus states with visible rings
- Smooth transitions

### 6.2 Responsive Design
All components should work on:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### 6.3 Accessibility
- aria-labels on all buttons
- Focus indicators visible
- Keyboard navigable

### Verification
```bash
bun run build
# Check bundle size < 100KB JS
# Test on mobile viewport
# Run Lighthouse audit
```

## Phase 7: Data Seeding

### 7.1 Create `scripts/seed-skills.ts`
Seed 50+ official skills from these orgs:
- vercel-labs (15-20 skills)
- anthropics (5-10 skills)
- supabase (5-10 skills)
- github (5-10 skills)
- openai (5-10 skills)

### 7.2 Create seed data
Create `data/skills.json` with real official skills. Each skill needs:
```json
{
  "slug": "vercel-ai-sdk",
  "name": "Vercel AI SDK",
  "org": "vercel-labs",
  "repo": "vercel-labs/ai",
  "description": "Build AI-powered applications with React, Next.js, and more",
  "commands": {
    "claudeCode": "claude mcp add vercel-ai-sdk",
    "codexCli": "codex install vercel-ai-sdk"
  },
  "tags": ["ai", "frontend", "react"],
  "agents": ["claude-code", "codex-cli", "cursor"],
  "installs": 15000,
  "stars": 8500,
  "repoUrl": "https://github.com/vercel/ai",
  "verified": true
}
```

### 7.3 Run seed
```bash
bunx convex run scripts/seed-skills.ts
```

## Phase 8: Testing

### 8.1 Unit Tests (Vitest)
Create tests in `src/**/*.test.ts`:
- `src/lib/utils.test.ts` — formatRelativeTime, debounce
- `src/hooks/useSearchParams.test.ts` — URL state sync

### 8.2 E2E Tests (Playwright)
Create tests in `e2e/`:
- `e2e/search.spec.ts` — Search flow
- `e2e/keyboard.spec.ts` — Keyboard shortcuts
- `e2e/copy.spec.ts` — Copy to clipboard

### Run Tests
```bash
bun test:unit
bun test:e2e
```

## Phase 9: Launch Prep

### 9.1 Final QA
```
[ ] All pages load without console errors
[ ] Search works with various queries
[ ] All keyboard shortcuts functional
[ ] Copy works in Chrome, Firefox, Safari
[ ] Mobile layout correct
[ ] 404 page works
[ ] URL state persists
[ ] Lighthouse 90+ all categories
```

### 9.2 Deploy
```bash
git add .
git commit -m "feat: complete MVP implementation"
git push origin main
# CI runs, Vercel deploys
```

## Execution Strategy

### For Sequential Phases
Execute one phase at a time, verify before moving on.

### For Parallel Work (if spawning sub-agents)
Phase 6 can be parallelized:
- Agent 1: Styling (globals.css, theme)
- Agent 2: Accessibility (aria, focus)
- Agent 3: Performance (bundle, loading)

Phase 8 can be parallelized:
- Agent 1: Unit tests
- Agent 2: E2E tests

## Non-Negotiables

1. **Official only** — No community skills, no personal repos
2. **Claude Code default** — Always show Claude Code command first
3. **No external UI libs** — Pure Tailwind, no shadcn/chakra/etc
4. **Minimal deps** — Question every `bun add`
5. **Type-safe** — No `any`, strict TypeScript

## Commands Reference

```bash
# Development
bun dev

# Type check
bun typecheck

# Lint
bun lint

# Unit tests
bun test:unit

# E2E tests
bun test:e2e

# Build
bun run build

# Convex
bunx convex dev
bunx convex deploy
```

## Start Now

Begin with Phase 4 (Keyboard System). Read the existing code first:

```bash
cat src/components/HomeContent.tsx
cat src/components/KeyboardHint.tsx
cat src/hooks/index.ts
```

Then implement `useKeyboard.ts` and `KeyboardHandler.tsx`.

Good luck. Build fast. Ship it.
