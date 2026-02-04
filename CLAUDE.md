# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**skillissue.world** — Curated directory of official agent skills. Search, copy install command, go.

## Philosophy

```
Speed > Choice > Completeness
```

Every decision filters through this hierarchy. We optimize for the dev with 3 seconds between terminal tabs.

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **Convex** (database + functions)
- **Tailwind CSS v4**
- **TypeScript** (strict mode)
- **Biome** (linting + formatting)
- **Playwright** (E2E) + **Vitest** (unit)
- **Bun** (package manager)
- **nuqs** (URL state)

## Commands

```bash
bun dev              # Start dev server (Next + Convex + Turbopack)
bun check            # Lint + format check (Biome)
bun check:fix        # Auto-fix lint/format issues
bun test:unit        # Run Vitest unit tests
bun test:unit:watch  # Unit tests in watch mode
bun test:e2e         # Run Playwright E2E tests
bun test:e2e:ui      # E2E with Playwright UI
bun run build        # Production build
bun typecheck        # TypeScript type checking
bun ci               # Full CI check (lint + typecheck + tests)
```

## Project Structure

```
src/
├── app/           # Next.js pages (App Router)
├── components/    # React components
├── hooks/         # Custom hooks (useSearch, useKeyboard, useCopy)
├── lib/           # Utilities and search logic
├── test/          # Test setup files
└── types/         # TypeScript interfaces
convex/
├── schema.ts      # Database schema (skills, events tables)
└── skills.ts      # Query/mutation functions
e2e/               # Playwright tests
docs/              # Full documentation (VISION, PRD, ADR, SPECS, RULES)
```

## Architecture

### Data Flow
- **Convex** handles all data: skills table with full-text search index
- **nuqs** syncs URL params: `/?q=react&agent=claude-code&tag=frontend`
- All state is shareable via URL — no localStorage for core state

### Key Components
- `SearchBar` — focuses on `/`, debounced input (150ms)
- `SkillCard` — displays skill with copy/repo actions
- `AgentToggle` — switches install command format
- `KeyboardHandler` — global shortcuts (`/`, `c`, `g`, `↑↓`, `Esc`)

### Convex Schema
Skills indexed by: `by_slug`, `by_org`, `by_installs`, `by_lastUpdated`, plus `search_skills` for full-text search.

## Key Patterns

### Default Agent
All install commands default to **Claude Code**. Display order: Claude Code → Codex CLI → Cursor → others.

### Keyboard-First
| Key | Action |
|-----|--------|
| `/` | Focus search |
| `c` | Copy command |
| `g` | Go to repo |
| `↑↓` | Navigate results |
| `Esc` | Clear/blur |

### Official Only Policy
Only skills from org GitHub namespaces (vercel-labs, anthropics, openai, supabase, etc). The Stripe Test: if it's not at `github.com/stripe/*`, it doesn't exist here.

## Code Style

- **Biome** handles linting + formatting (no ESLint/Prettier)
- Strict TypeScript — no `any`, no implicit returns, `noUncheckedIndexedAccess`
- Functional components with explicit return types
- Props destructured, interfaces for all prop types
- Question every `bun add` — minimal dependencies

### Naming
| Type | Convention |
|------|------------|
| Components | PascalCase (`SkillCard.tsx`) |
| Hooks | camelCase with `use` prefix |
| Types/Interfaces | PascalCase |
| Constants | SCREAMING_SNAKE |

## Testing

- **E2E (Playwright)**: Search, copy command, keyboard nav, agent toggle
- **Unit (Vitest)**: Search logic, utilities, hooks
- Run `bun test:unit` before commits
- Critical paths must have E2E coverage

## Don'ts (Non-Negotiable)

- No community features (accounts, comments, likes, submissions)
- No heavy UI libraries (Radix, shadcn, Headless UI for MVP)
- No images/media — text only for speed
- No `any` types
- No monetization features (ads, paywalls, sponsored listings)
- No ESLint/Prettier — use Biome only

## Commit Messages

Format: `<type>(<scope>): <subject>`

Types: `feat`, `fix`, `data`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Example: `feat(search): add keyboard shortcut for focus`

## Documentation Reference

Full docs in `docs/`:
- `ADR.md` — Architecture decisions (15 ADRs covering all major choices)
- `SPECS.md` — Component specs, search algorithm, performance targets
- `RULES.md` — Non-negotiable principles
- `TECH_STACK.md` — Full technical breakdown with code examples
