# Architecture Decision Records (ADR)

## SkillIssue.world

This document captures key architectural decisions, their context, and rationale.

---

## ADR-001: Official Skills Only Policy

**Status**: Accepted
**Date**: 2026-02-04

### Context
The agent skills ecosystem is flooded with community contributions of varying quality. Developers waste time filtering signal from noise.

### Decision
Index **only** skills hosted under official organization GitHub namespaces.

### Criteria for "Official"
- ✅ Hosted at `github.com/{official-org}/{repo}`
- ✅ Maintained by org members
- ❌ Personal repos "blessed" by orgs don't count
- ❌ Forks don't count

### Consequences
- **Pro**: Guaranteed quality baseline
- **Pro**: Clear, objective inclusion criteria
- **Con**: Smaller initial dataset
- **Con**: May miss good indie skills

### Mitigation
If official pool proves too small, revisit with "vetted community" tier (requires manual review).

---

## ADR-002: Claude Code as Default Agent

**Status**: Accepted
**Date**: 2026-02-04

### Context
Multiple AI coding agents exist (Claude Code, Codex CLI, Cursor, OpenCode, Gemini CLI). Each has different install command syntax.

### Decision
Default all skill install commands to **Claude Code** format. Other agents available via toggle.

### Rationale
- Claude Code is the "Big Dog" of the coding agent era
- Fighting UX for theoretical neutrality helps no one
- Most users will want Claude Code anyway
- Other options remain accessible (one click away)

### Consequences
- **Pro**: Faster UX for majority use case
- **Pro**: Simpler default state
- **Con**: May appear biased to other agent communities

---

## ADR-003: Text-Only, No Images

**Status**: Accepted
**Date**: 2026-02-04

### Context
Design decision for MVP: Should we include skill logos, screenshots, or other media?

### Decision
**Text-only**. No images, videos, or media embeds.

### Rationale
- Speed > aesthetics
- Faster page loads
- Simpler maintenance
- Wikipedia-like neutrality
- Reduces visual noise

### Consequences
- **Pro**: Blazing fast
- **Pro**: Zero CDN complexity
- **Con**: Less visually engaging
- **Con**: Harder to differentiate skills at a glance

---

## ADR-004: JSON File for Initial Data Storage

**Status**: Accepted
**Date**: 2026-02-04

### Context
Need to store skill data. Options: JSON file, SQLite, Supabase, Convex, etc.

### Decision
Start with a **local JSON file** (`/data/skills.json`). Migrate to Supabase if/when needed.

### Rationale
- Simplest possible setup
- No external dependencies
- Easy to version control
- Manual curation model fits file-based approach
- Can deploy as static site

### Migration Path
```
JSON file → Supabase (when we need):
  - Real-time updates
  - More than ~500 skills
  - API access
  - Analytics queries
```

### Consequences
- **Pro**: Zero infrastructure cost
- **Pro**: Fast iteration
- **Con**: Manual file edits for updates
- **Con**: No query capabilities

---

## ADR-005: Keyboard-First Navigation

**Status**: Accepted
**Date**: 2026-02-04

### Context
Target user is a developer mid-workflow with hands on keyboard.

### Decision
Implement comprehensive keyboard shortcuts as first-class feature.

### Bindings
| Key | Action |
|-----|--------|
| `/` | Focus search |
| `c` | Copy install command |
| `g` | Go to GitHub repo |
| `↑/↓` | Navigate results |
| `Enter` | Select skill |
| `Esc` | Clear/close |

### Rationale
- Devs live in terminal
- Mouse context-switching is slow
- Power users will love it
- Differentiator from competitors

### Consequences
- **Pro**: Fastest possible UX for target user
- **Pro**: Cult following potential (ThePrimeagen audience)
- **Con**: Discovery problem (users may not know shortcuts exist)

### Mitigation
Show subtle hints: "Press / to search" • "c to copy"

---

## ADR-006: No User Accounts or Submissions

**Status**: Accepted
**Date**: 2026-02-04

### Context
Should users be able to submit skills or create accounts?

### Decision
**No**. Curation is 100% owner-controlled. No accounts, no submissions, no community features.

### Rationale
- Maintains quality control
- Avoids spam/abuse
- Simpler architecture
- No auth complexity
- No moderation burden

### Future Consideration
May add "Suggest Official Skill" email form (not public submission).

### Consequences
- **Pro**: Total quality control
- **Pro**: Zero abuse surface
- **Con**: Bottleneck on one person
- **Con**: May miss legitimate skills

---

## ADR-007: Vercel for Hosting

**Status**: Accepted
**Date**: 2026-02-04

### Context
Where to host the site?

### Decision
**Vercel** (Hobby tier initially, Pro if needed).

### Rationale
- Next.js native platform
- Free tier sufficient for MVP
- Built-in analytics
- Domain management
- Edge functions if needed
- Meta: We're indexing Vercel's skills, hosting on Vercel is thematically appropriate

### Consequences
- **Pro**: Zero DevOps burden
- **Pro**: Automatic deployments
- **Pro**: Free analytics
- **Con**: Vendor lock-in (acceptable)

---

## ADR-008: Data Sourcing Strategy

**Status**: Accepted
**Date**: 2026-02-04

### Context
How do we find and index official skills?

### Decision
Multi-source scraping + manual curation:

1. **Primary**: GitHub API - search org repos for SKILL.md files
2. **Secondary**: skills.sh leaderboard (filter to official orgs)
3. **Tertiary**: Official announcements (X, blogs, changelogs)
4. **Validation**: Manual review before inclusion

### Process
```
Scrape → Filter (official orgs only) → Validate → Add to JSON → Deploy
```

### Differentiation from Awesome Lists
- We're not a link collection
- We provide install commands
- We track metrics (installs, stars)
- We're searchable/filterable

### Consequences
- **Pro**: Comprehensive coverage
- **Pro**: Multiple data sources = resilience
- **Con**: Scraping may break
- **Con**: Manual effort required

---

## ADR-009: URL Structure

**Status**: Accepted
**Date**: 2026-02-04

### Context
How should skill URLs be structured?

### Decision
Pattern: `/skill/[org]-[repo]`

Examples:
- `/skill/vercel-labs-react-best-practices`
- `/skill/anthropics-frontend-design`
- `/skill/supabase-database-patterns`

### Rationale
- SEO-friendly
- Human-readable
- Unique (org-repo combo is unique on GitHub)
- Predictable (can construct URL from known skill)

### Consequences
- **Pro**: Clean URLs
- **Pro**: Easy to share
- **Con**: Long URLs for long repo names

---

## ADR-010: Open Source License

**Status**: Accepted
**Date**: 2026-02-04

### Context
Should the project be open source? If so, what license?

### Decision
**Yes**, open source under **MIT License**.

### Rationale
- Aligns with "pure signal, no paywalls" ethos
- Community can contribute fixes
- Transparency builds trust
- MIT is permissive and widely understood

### What's Open
- Website code
- Data structure/schema
- Documentation

### What's Controlled
- Actual skill curation (owner decision)
- Domain/hosting
- Final editorial control

### Consequences
- **Pro**: Community trust
- **Pro**: Potential contributors
- **Con**: Could be cloned (acceptable)

---

---

## ADR-011: Next.js 16 (Latest Stable)

**Status**: Accepted
**Date**: 2026-02-04

### Context
Which Next.js version should we use? Options: 14 (older stable), 15 (transitional), 16 (latest stable).

### Decision
Use **Next.js 16** — the latest stable release.

### Rationale
- We're starting fresh — no migration pain
- Turbopack is now the default bundler (faster dev server)
- Async request APIs are finalized (no deprecation warnings)
- `next lint` removed — we use Biome anyway
- Security patches prioritized for latest version
- No "middleware → proxy" migration needed (we start with new pattern)

### Breaking Changes We Avoid
| Change | Our Approach |
|--------|--------------|
| Async `params`, `cookies()`, `headers()` | Write correctly from day 1 |
| `middleware.ts` → `proxy.ts` | Start with new naming |
| `next lint` removed | Using Biome |
| Turbopack default | Already planned for it |

### Consequences
- **Pro**: No deprecation warnings
- **Pro**: Fastest dev experience (Turbopack)
- **Pro**: Future-proof patterns
- **Con**: Less Stack Overflow answers (newer version)

---

## ADR-012: Bun over pnpm

**Status**: Accepted
**Date**: 2026-02-04

### Context
Which package manager? Options: npm, yarn, pnpm, Bun.

### Decision
Use **Bun** as the package manager.

### Benchmarks (2026)

| Manager | Install Time | Relative |
|---------|--------------|----------|
| npm | 48s | 1x |
| yarn | 21s | 2.3x |
| pnpm | 14s | 3.4x |
| **Bun** | 3s | **16x** |

For Next.js app with ~1.1k packages: Bun 8.6s vs pnpm 31.9s.

### Rationale
- **Speed > Choice** — Bun is 4-10x faster than pnpm
- We have standard dependencies (no exotic native modules)
- Bun 1.3+ is production-ready for typical web apps
- Vercel deploys work fine with Bun-installed `node_modules`
- Faster CI pipeline = faster feedback loops

### When pnpm Would Be Better
- Enterprise monorepos with complex workspaces
- Native module dependencies (`.node` files)
- Ultra-conservative environments

### Consequences
- **Pro**: Blazing fast installs
- **Pro**: Faster CI (3s vs 14s for install step)
- **Pro**: Modern, batteries-included
- **Con**: Slightly less mature ecosystem
- **Con**: Some edge cases with native modules (not our concern)

---

## ADR-013: Biome over ESLint + Prettier

**Status**: Accepted
**Date**: 2026-02-04

### Context
Need linting and formatting tools. Traditional choice is ESLint + Prettier. Newer option is Biome (Rust-based, combines both).

### Decision
Use **Biome** as the sole linting and formatting tool.

### Comparison

| Factor | Biome | ESLint + Prettier |
|--------|-------|-------------------|
| Speed | 10-100x faster | Slow (JS-based) |
| Config | One file | Two files |
| CI time | ~2 seconds | ~15-30 seconds |
| Dependencies | 1 | 5+ |
| TypeScript | Native | Needs plugins |

### Rationale
- **Speed > Choice** — Our core philosophy applies to tooling too
- Single tool = simpler mental model
- Faster CI = faster feedback loops
- Faster pre-commit hooks = better DX

### Consequences
- **Pro**: Blazing fast linting/formatting
- **Pro**: Simpler configuration
- **Pro**: One fewer tool to maintain
- **Con**: Smaller plugin ecosystem (acceptable for our scope)
- **Con**: Less customizable (we don't need niche rules)

---

## ADR-014: nuqs for URL State Management

**Status**: Accepted
**Date**: 2026-02-04

### Context
Search state, agent selection, and filters need to be shareable via URL.

### Decision
Use **nuqs** for type-safe URL search parameter management.

### Rationale
- URLs like `skillissue.world?q=react&agent=claude-code` are shareable
- Browser back/forward works correctly
- Type-safe with parsers (no more `searchParams.get("q") ?? ""`)
- SSR-friendly with Next.js App Router
- Built-in debounce for search input

### Example URLs

| State | URL |
|-------|-----|
| Search for react | `/?q=react` |
| Filter by tag | `/?q=react&tag=frontend` |
| Different agent | `/?q=react&agent=cursor` |

### Consequences
- **Pro**: Every state is a shareable link
- **Pro**: SEO-friendly (search engines can index filtered views)
- **Pro**: Type-safe, no runtime parsing errors
- **Con**: Slightly more complex than local state (worth it)

---

## ADR-015: Convex from Day One (No JSON File)

**Status**: Accepted
**Date**: 2026-02-04

### Context
Original plan was to start with a JSON file and migrate to database later. Revised approach: use Convex from the start.

### Decision
Use **Convex** as the database from day one. No JSON file phase.

### Rationale
- "Build like pros, not amateurs"
- Convex's DX is as fast as editing JSON (hot reload, TypeScript)
- Avoids migration pain later
- Real-time updates built-in (for future features)
- Type-safe queries from day one

### Trade-offs

| JSON File | Convex |
|-----------|--------|
| Zero setup | 5 min setup |
| Git-versioned data | Dashboard + migrations |
| No query capability | Full query capability |
| Manual deploys | Automatic sync |

### Consequences
- **Pro**: Production-ready from day one
- **Pro**: Type-safe data layer
- **Pro**: Real-time capability for free
- **Pro**: No migration debt
- **Con**: Slightly more setup (minimal with Convex)

---

*New ADRs should be added as numbered entries following this format.*
