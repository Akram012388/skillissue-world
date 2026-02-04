# PLAN.md

## SkillIssue.world Implementation Plan

**Status**: Ready to Execute
**Infrastructure**: ✅ Complete (CI/CD passing)
**Last Updated**: 2026-02-04

---

## Guiding Principle

```
Speed > Choice > Completeness
```

Build for the dev with 3 seconds between terminal tabs.

---

## Phase Overview

| Phase | Name | Parallelizable | Est. Time |
|-------|------|----------------|-----------|
| 1 | Core Data Layer | No | 2 hours |
| 2 | UI Components | Yes (4 agents) | 3 hours |
| 3 | Page Assembly | Partial | 2 hours |
| 4 | Keyboard System | No | 1 hour |
| 5 | Search & Filtering | No | 2 hours |
| 6 | Polish & UX | Yes (3 agents) | 2 hours |
| 7 | Data Seeding | Yes (2 agents) | 2 hours |
| 8 | Testing | Yes (2 agents) | 2 hours |
| 9 | Launch Prep | No | 1 hour |

**Total Estimated**: ~17 hours

---

## Phase 1: Core Data Layer

**Goal**: Establish data flow from Convex to React components.

**Dependencies**: None (infrastructure complete)

**Parallelizable**: No (foundation for everything)

### Tasks

#### 1.1 Convex Provider Setup
```
File: src/app/providers.tsx
- Create ConvexClientProvider component
- Initialize ConvexReactClient with env var
- Export for use in layout.tsx
```

#### 1.2 Layout Integration
```
File: src/app/layout.tsx
- Wrap children with ConvexClientProvider
- Add NuqsAdapter for URL state
- Set up basic metadata (title, description, og tags)
```

#### 1.3 Type Definitions
```
File: src/types/index.ts
- Define Skill interface (matching Convex schema)
- Define AgentType union type
- Define CategoryTag union type
- Define AgentCommands interface
- Export all types
```

#### 1.4 Custom Hooks - Data Fetching
```
File: src/hooks/useSkills.ts
- useSkills() - fetch all skills
- useSkill(slug) - fetch single skill
- useHitPicks(limit) - top by installs
- useLatestDrops(limit) - newest updated
- useSearchSkills(query) - search results
```

### Verification
```bash
bun dev
# Visit localhost:3000, check console for Convex connection
# No errors = Phase 1 complete
```

---

## Phase 2: UI Components

**Goal**: Build all reusable UI components.

**Dependencies**: Phase 1 complete

**Parallelizable**: Yes — 4 independent component groups

### Agent 1: Search Components

#### 2.1 SearchBar
```
File: src/components/SearchBar.tsx
Props:
  - value: string
  - onChange: (value: string) => void
  - placeholder?: string
  - autoFocus?: boolean

Features:
  - Large, centered input
  - Debounced onChange (150ms)
  - Clear button (X) when has value
  - "Press / to search" hint when empty
  - Focus ring styling
  - Escape key clears and blurs
```

#### 2.2 SearchResults
```
File: src/components/SearchResults.tsx
Props:
  - skills: Skill[]
  - selectedIndex: number
  - onSelect: (skill: Skill) => void

Features:
  - Renders list of SkillCard components
  - Highlights selected card (for keyboard nav)
  - Empty state: "No skills found"
  - Loading state: skeleton cards
```

### Agent 2: Skill Display Components

#### 2.3 SkillCard
```
File: src/components/SkillCard.tsx
Props:
  - skill: Skill
  - isSelected?: boolean
  - selectedAgent: AgentType
  - onCopy?: () => void

Features:
  - Skill name + org badge
  - Description (1-2 lines, truncate)
  - Install command (monospace)
  - Copy button
  - Repo link
  - Tags as chips
  - Install count + stars
  - Last updated date
  - data-testid for E2E
```

#### 2.4 SkillDetail
```
File: src/components/SkillDetail.tsx
Props:
  - skill: Skill
  - selectedAgent: AgentType

Features:
  - Full skill information
  - All agent commands listed
  - Full description
  - Supported agents list
  - Large copy button
  - Direct repo link
  - Related skills (same tags)
```

### Agent 3: Action Components

#### 2.5 CopyButton
```
File: src/components/CopyButton.tsx
Props:
  - text: string
  - onCopied?: () => void
  - size?: 'sm' | 'md' | 'lg'

Features:
  - Uses navigator.clipboard.writeText
  - Shows checkmark briefly after copy
  - Tooltip: "Copy to clipboard"
  - Accessible: aria-label
```

#### 2.6 RepoLink
```
File: src/components/RepoLink.tsx
Props:
  - url: string
  - size?: 'sm' | 'md' | 'lg'

Features:
  - Opens in new tab (target="_blank")
  - rel="noopener noreferrer"
  - GitHub icon
  - Hover state
```

#### 2.7 AgentToggle
```
File: src/components/AgentToggle.tsx
Props:
  - skill: Skill
  - selectedAgent: AgentType
  - onSelect: (agent: AgentType) => void

Features:
  - Only shows agents the skill supports
  - Claude Code always first (default)
  - Radio button group styling
  - Persists to URL via nuqs
```

### Agent 4: Feedback Components

#### 2.8 Toast
```
File: src/components/Toast.tsx
Props:
  - message: string
  - type: 'success' | 'error' | 'info'
  - duration?: number (default 2000ms)

Features:
  - Bottom-right position
  - Slide-in animation
  - Auto-dismiss
  - No close button needed
```

#### 2.9 KeyboardHint
```
File: src/components/KeyboardHint.tsx
Props:
  - keys: string[] (e.g., ['/', 'c', 'g'])

Features:
  - Subtle hint bar at bottom
  - Shows available shortcuts
  - Fades on scroll
  - Hidden on mobile
```

#### 2.10 LoadingSkeleton
```
File: src/components/LoadingSkeleton.tsx
Props:
  - variant: 'card' | 'list' | 'detail'
  - count?: number

Features:
  - Animated pulse effect
  - Matches real component dimensions
  - Accessible: aria-busy="true"
```

### Verification
```bash
# Create a test page that renders each component
# Visual check: all components render correctly
# Interaction check: buttons, inputs work
```

---

## Phase 3: Page Assembly

**Goal**: Build all pages using components from Phase 2.

**Dependencies**: Phase 2 complete

**Parallelizable**: Partial (homepage blocks others)

### 3.1 Homepage Layout
```
File: src/app/page.tsx

Structure:
  <main>
    <header>
      <Logo /> (text only: "skillissue.world")
      <Tagline /> ("Search. Copy. Go.")
    </header>

    <SearchBar />

    <Suspense fallback={<LoadingSkeleton />}>
      <HomeContent />
    </Suspense>

    <KeyboardHint />
  </main>

HomeContent:
  - If search query: show SearchResults
  - If no query: show sections (Hit Picks, Latest, Hot)
```

### 3.2 Homepage Sections
```
File: src/components/HomeSection.tsx

Sections:
  - HitPicks: Top 10 by installs
  - LatestDrops: Newest 10 by lastUpdated
  - HotSpots: Featured/velocity-based (manual)
  - Categories: Tag-based browse grid
```

### 3.3 Skill Detail Page
```
File: src/app/skill/[slug]/page.tsx

Features:
  - Fetch skill by slug
  - Full SkillDetail component
  - Back button
  - 404 handling
  - SEO metadata (generateMetadata)
```

### 3.4 Category Page
```
File: src/app/category/[tag]/page.tsx

Features:
  - Filter skills by tag
  - Category title + description
  - Skill list
  - Back to home
```

### 3.5 Not Found Page
```
File: src/app/not-found.tsx

Features:
  - Friendly 404 message
  - Search bar
  - Link to home
  - "skill issue" joke optional
```

### Verification
```bash
bun dev
# Navigate to all pages
# Check responsive layout
# Verify data loads
```

---

## Phase 4: Keyboard System

**Goal**: Implement full keyboard navigation.

**Dependencies**: Phase 3 complete

**Parallelizable**: No (global state management)

### 4.1 Keyboard Context
```
File: src/hooks/useKeyboard.ts

Global shortcuts:
  - '/' → focus search
  - 'Escape' → clear search, blur

Skill-context shortcuts (when skill selected):
  - 'c' → copy command
  - 'g' → open repo
  - '↑' → previous skill
  - '↓' → next skill
  - 'Enter' → expand/navigate to skill
```

### 4.2 Keyboard Handler Component
```
File: src/components/KeyboardHandler.tsx

Features:
  - Wraps app, provides context
  - Tracks selected skill index
  - Handles all key events
  - Prevents shortcuts when typing in input
```

### 4.3 Focus Management
```
File: src/hooks/useFocus.ts

Features:
  - Track focused element
  - Programmatic focus (searchbar)
  - Focus trap for modals (if any)
```

### 4.4 Integration
```
Update: src/app/layout.tsx
- Wrap with KeyboardHandler
- Pass refs to SearchBar
```

### Verification
```bash
bun dev
# Test all shortcuts manually
# Verify no conflicts with input typing
# Test on different browsers
```

---

## Phase 5: Search & Filtering

**Goal**: Implement search logic and URL state.

**Dependencies**: Phase 4 complete

**Parallelizable**: No (core feature)

### 5.1 URL State Hook
```
File: src/hooks/useSearchParams.ts

State managed:
  - q: search query (debounced)
  - agent: selected agent (default: claude-code)
  - tag: category filter
  - section: active section

Uses nuqs for type-safe URL params.
```

### 5.2 Search Logic
```
File: src/lib/search.ts

Client-side search (backup):
  - searchSkills(skills, query)
  - calculateRelevance(skill, query)
  - Scoring: name > org > tags > description

Server-side (Convex):
  - Uses search index
  - Full-text search on name
  - Filter by org, tags
```

### 5.3 Filter Integration
```
Update: src/app/page.tsx
- Connect useSearchParams to SearchBar
- Pass filters to skill queries
- Update URL on filter change
```

### 5.4 Agent Persistence
```
Update: src/hooks/useSearchParams.ts
- Agent selection persists in URL
- Default: claude-code
- Sync across all skill cards
```

### Verification
```bash
bun dev
# Test search with various queries
# Verify URL updates
# Test browser back/forward
# Share URL, verify state restored
```

---

## Phase 6: Polish & UX

**Goal**: Final UX improvements and styling.

**Dependencies**: Phase 5 complete

**Parallelizable**: Yes — 3 independent tracks

### Agent 1: Styling & Theme

#### 6.1 Global Styles
```
File: src/app/globals.css

Define:
  - CSS variables (colors, spacing)
  - Typography scale
  - Focus states
  - Transitions
```

#### 6.2 Responsive Design
```
Update: All components

Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

Mobile adjustments:
  - Stack layout
  - Larger touch targets
  - Hide keyboard hints
```

### Agent 2: Accessibility

#### 6.3 ARIA Labels
```
Update: All interactive components

Add:
  - aria-label on buttons
  - aria-describedby for hints
  - role attributes
  - aria-live for dynamic content
```

#### 6.4 Focus Indicators
```
Update: src/app/globals.css

Ensure:
  - Visible focus rings
  - High contrast
  - Skip links
```

### Agent 3: Performance

#### 6.5 Loading States
```
Update: All pages

Add:
  - Suspense boundaries
  - Skeleton loaders
  - Optimistic updates
```

#### 6.6 Bundle Optimization
```
Check:
  - No unnecessary dependencies
  - Tree shaking working
  - Images optimized (none for MVP)
```

### Verification
```bash
bun run build
# Check bundle size < 100KB
# Lighthouse audit: aim for 90+ all categories
# Test on mobile device
```

---

## Phase 7: Data Seeding

**Goal**: Populate database with official skills.

**Dependencies**: Phase 3 complete (can run parallel to 4-6)

**Parallelizable**: Yes — 2 independent tracks

### Agent 1: Skill Scraping

#### 7.1 GitHub Scraper
```
File: scripts/scrape-skills.ts

Target orgs:
  - vercel-labs
  - anthropics
  - openai
  - supabase
  - github

For each:
  - Find repos with SKILL.md
  - Extract: name, description, commands
  - Get: stars, last commit date
```

#### 7.2 Skills.sh Data
```
File: scripts/import-skillssh.ts

Extract:
  - Install counts
  - Popularity ranking
  - Filter to official orgs only
```

### Agent 2: Data Curation

#### 7.3 Manual Review
```
File: data/skills-raw.json → data/skills-curated.json

For each skill:
  - Verify official org ownership
  - Write 1-3 sentence description
  - Assign tags (max 5)
  - Verify install commands
  - Add supported agents
```

#### 7.4 Seed Script
```
File: scripts/seed-convex.ts

Process:
  - Read curated JSON
  - Transform to Convex schema
  - Insert via mutation
  - Verify counts
```

### Target: 50+ Official Skills

| Org | Target Count |
|-----|--------------|
| vercel-labs | 15-20 |
| anthropics | 5-10 |
| openai | 5-10 |
| supabase | 5-10 |
| github | 5-10 |
| others | 10+ |

### Verification
```bash
bunx convex dashboard
# Verify skill count
# Spot check data quality
```

---

## Phase 8: Testing

**Goal**: Comprehensive test coverage.

**Dependencies**: Phase 6 complete

**Parallelizable**: Yes — 2 independent tracks

### Agent 1: Unit Tests (Vitest)

#### 8.1 Search Logic Tests
```
File: src/lib/search.test.ts

Test:
  - Empty query returns all
  - Name matching
  - Tag matching
  - Relevance scoring
  - Edge cases (special chars, etc.)
```

#### 8.2 Hook Tests
```
File: src/hooks/*.test.ts

Test:
  - useSkills data fetching
  - useSearchParams URL sync
  - useCopy clipboard interaction
```

#### 8.3 Component Tests
```
File: src/components/*.test.tsx

Test:
  - SkillCard renders correctly
  - CopyButton triggers clipboard
  - AgentToggle state management
```

### Agent 2: E2E Tests (Playwright)

#### 8.4 Search Flow
```
File: e2e/search.spec.ts

Scenarios:
  - Homepage loads with search bar
  - '/' focuses search
  - Typing shows results
  - Clear search shows sections
  - Empty results state
```

#### 8.5 Copy Flow
```
File: e2e/copy.spec.ts

Scenarios:
  - Copy button copies command
  - 'c' shortcut copies command
  - Toast shows on copy
  - Correct command format per agent
```

#### 8.6 Keyboard Navigation
```
File: e2e/keyboard.spec.ts

Scenarios:
  - '/' focuses search
  - Arrow keys navigate
  - 'c' copies selected
  - 'g' opens repo
  - Escape clears
```

#### 8.7 Agent Toggle
```
File: e2e/agent-toggle.spec.ts

Scenarios:
  - Default is Claude Code
  - Toggle updates command
  - Selection persists in URL
  - Page reload preserves selection
```

### Coverage Targets

| Type | Target |
|------|--------|
| Unit | 80%+ |
| E2E | Critical paths covered |

### Verification
```bash
bun test:unit --coverage
bun test:e2e
# All tests pass
# Coverage meets targets
```

---

## Phase 9: Launch Prep

**Goal**: Final checks and launch.

**Dependencies**: All phases complete

**Parallelizable**: No (sequential)

### 9.1 Final QA Checklist

```
[ ] All pages load without errors
[ ] Search works with various queries
[ ] All keyboard shortcuts functional
[ ] Copy works in Chrome, Firefox, Safari
[ ] Mobile responsive layout correct
[ ] 404 page works
[ ] URL state persists correctly
[ ] No console errors
[ ] Lighthouse score 90+
```

### 9.2 SEO & Metadata

```
File: src/app/layout.tsx

Add:
  - Title: "SkillIssue.world - Official Agent Skills Directory"
  - Description
  - Open Graph tags
  - Twitter card
  - Favicon
```

### 9.3 Analytics Verification

```
Check:
  - Vercel Analytics enabled
  - Page views tracking
  - Custom events (copy, repo click)
```

### 9.4 Production Deploy

```bash
git add .
git commit -m "feat: complete MVP implementation"
git push origin main

# Verify:
# - CI passes
# - Vercel deploys
# - Production site works
```

### 9.5 Launch Announcement

```
Prepare:
  - X thread (@CodeAkram)
  - Reddit posts (r/ClaudeCode, r/PromptEngineering)
  - Screenshots/GIFs
```

---

## Execution Commands for Claude Code

### Start Full Build (Sequential)
```
Execute the implementation plan in docs/PLAN.md.
Start with Phase 1 and proceed sequentially.
After each phase, verify before moving to next.
Do not skip phases.
```

### Parallel Phase 2 (UI Components)
```
Execute Phase 2 of docs/PLAN.md.
Spawn 4 parallel sub-agents:
  - Agent 1: SearchBar, SearchResults (2.1, 2.2)
  - Agent 2: SkillCard, SkillDetail (2.3, 2.4)
  - Agent 3: CopyButton, RepoLink, AgentToggle (2.5, 2.6, 2.7)
  - Agent 4: Toast, KeyboardHint, LoadingSkeleton (2.8, 2.9, 2.10)
Sync when all complete.
```

### Parallel Phase 6 (Polish)
```
Execute Phase 6 of docs/PLAN.md.
Spawn 3 parallel sub-agents:
  - Agent 1: Styling & Theme (6.1, 6.2)
  - Agent 2: Accessibility (6.3, 6.4)
  - Agent 3: Performance (6.5, 6.6)
Sync when all complete.
```

### Parallel Phase 7 (Data)
```
Execute Phase 7 of docs/PLAN.md.
Spawn 2 parallel sub-agents:
  - Agent 1: Scraping (7.1, 7.2)
  - Agent 2: Curation (7.3, 7.4)
Note: Agent 2 depends on Agent 1 output.
```

### Parallel Phase 8 (Testing)
```
Execute Phase 8 of docs/PLAN.md.
Spawn 2 parallel sub-agents:
  - Agent 1: Unit Tests (8.1, 8.2, 8.3)
  - Agent 2: E2E Tests (8.4, 8.5, 8.6, 8.7)
Run both test suites when complete.
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Convex query limits | Implement pagination early |
| Keyboard conflicts | Test all shortcuts in isolation first |
| Mobile UX issues | Test on real device each phase |
| Bundle size creep | Check size after each phase |
| Flaky E2E tests | Use stable selectors (data-testid) |

---

## Definition of Done

MVP is complete when:

1. ✅ 50+ official skills indexed
2. ✅ Search returns relevant results in <100ms
3. ✅ Copy-to-clipboard works in all major browsers
4. ✅ All keyboard shortcuts functional
5. ✅ Mobile responsive
6. ✅ Lighthouse 90+ all categories
7. ✅ All tests passing
8. ✅ CI/CD green
9. ✅ Production deployed
10. ✅ Analytics tracking

---

*This plan is the roadmap. Execute it systematically.*
*Speed > Choice > Completeness.*
