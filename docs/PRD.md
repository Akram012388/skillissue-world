# Product Requirements Document (PRD)

## SkillIssue.world v1.0

**Last Updated**: 2026-02-04
**Owner**: Shaikh Akram Ahmed (@CodeAkram)
**Status**: Draft

---

## 1. Overview

### Product Name
SkillIssue.world

### Tagline
The No-BS Encyclopedia for Official Agent Skills – Search, Copy, and Go.

### Elevator Pitch
A clean, text-only web directory that serves as a neutral, curated reference for officially maintained agent skills. Devs land, search, copy the install command, and bounce. That's it.

---

## 2. Problem Statement

Developers working with AI coding agents (Claude Code, Codex CLI, Cursor, etc.) need to discover and install skills quickly. Current solutions fail them:

| Problem | Impact |
|---------|--------|
| skills.sh is noisy with community submissions | Time wasted filtering |
| No "official only" filter exists | Quality uncertainty |
| Poor copy UX (multiple clicks) | Workflow interruption |
| Social features nobody asked for | Cognitive overhead |
| Paywalls and ads | Trust erosion |

---

## 3. Target User

**Primary Persona**: The Mid-Flow Developer

- Has 3 seconds between terminal tabs
- Knows what they want (e.g., "Vercel React best practices")
- Needs the install command NOW
- Doesn't care about comments, likes, or community
- Values speed over exploration

**Secondary Persona**: The Agent Explorer

- Evaluating different skills for a project
- Comparing options across categories
- Still values speed, but willing to browse

---

## 4. Core Design Principle

```
Speed > Choice > Completeness
```

Every feature, every pixel, every interaction must pass through this filter.

---

## 5. Feature Requirements

### 5.1 Search (P0 - Must Have)

| Requirement | Details |
|-------------|---------|
| Central search bar | Homepage dominant element |
| Keyboard shortcut | `/` focuses search instantly |
| Real-time filtering | No page reload, instant results |
| Search targets | Name, description, tags, org |
| No advanced filters MVP | Keep it simple |

### 5.2 Skill Cards (P0 - Must Have)

Each skill displays:

| Field | Source |
|-------|--------|
| Skill Name | Scraped from repo |
| Owner/Org | GitHub namespace |
| Description | From SKILL.md (1-3 sentences, curated) |
| Install Command | Default: Claude Code format |
| Agent Selector | Toggle for other agents' commands |
| Copy Button | One-click, keyboard shortcut `c` |
| Repo Link | One-click, keyboard shortcut `g` |
| Install Count | From skills.sh or GitHub stars |
| Last Updated | Last commit date |
| Tags | Category chips |

### 5.3 Agent Command Handling (P0 - Must Have)

**Default**: Claude Code (the Big Dog)

```bash
# Claude Code (default shown)
claude mcp add skill-name

# Codex CLI (on toggle)
codex skills install skill-name

# etc.
```

User can toggle to see other agent formats. We don't fight the UX — Claude Code is dominant, so it's the default.

### 5.4 Homepage Sections (P0 - Must Have)

| Section | Sort Logic |
|---------|------------|
| **Hit Picks** | Top by install count (descending) |
| **Latest Drops** | Newest by last commit date |
| **Hot Spots** | Rising fast (manual highlights or velocity) |
| **Categories** | Sidebar/grid browse |

### 5.5 Keyboard Shortcuts (P0 - Must Have)

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `c` | Copy install command (focused skill) |
| `g` | Go to repo (focused skill) |
| `↑/↓` | Navigate results |
| `Enter` | Select/expand skill |
| `Esc` | Clear/close |

*ThePrimeagen will love us for this.*

### 5.6 Categories (P1 - Should Have)

Initial category set:
- React / Next.js
- Security
- Database
- UI / Design
- Multi-Agent
- DevOps / CI
- Testing
- Documentation
- API / Backend

Expandable based on skill distribution.

### 5.7 Skill Detail Pages (P1 - Should Have)

URL pattern: `/skill/[slug]`

Example: `/skill/mcp-server-filesystem`

Note: A single repo can contain multiple skills, so the canonical route is
per-skill slug. Hierarchical browsing routes like `/[org]/[repo]/[skill]` may
also exist for discovery, but the canonical detail route is `/skill/[slug]`.

Full detail view with:
- All card info expanded
- Full description
- Supported agents list
- Related skills (same category)
- Direct copy/repo buttons

---

## 6. Out of Scope (MVP)

| Feature | Reason |
|---------|--------|
| User accounts | No community, no need |
| Submissions | Curated by owner only |
| Comments/likes | No social features |
| API endpoints | Internal use only |
| Advanced filters | Speed > Choice |
| Images/videos | Text-only |
| Mobile app | Web-only |
| Monetization | Free forever (MVP) |

---

## 7. Technical Requirements

| Component | Choice |
|-----------|--------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS (minimal, Wikipedia-like) |
| Data | JSON file initially → Supabase later |
| Hosting | Vercel (Hobby tier) |
| Domain | skillissue.world |
| Analytics | Vercel Analytics |

---

## 8. Data Model

```typescript
interface Skill {
  slug: string;                  // Unique skill slug
  name: string;                  // Display name
  org: string;                   // GitHub org
  repo: string;                  // Repo name (no org prefix)
  description: string;           // 1-3 sentences
  commands: {
    claudeCode: string;          // Default
    codexCli?: string;
    cursor?: string;
    openCode?: string;
    geminiCli?: string;
  };
  tags: string[];                // Category tags
  installs: number;              // Install count
  stars: number;                 // GitHub stars
  lastUpdated: string;           // ISO date
  repoUrl: string;               // Direct link
  official: true;                // Always true (we only index official)
}
```

---

## 9. Success Metrics

| Metric | Target (Month 1) |
|--------|------------------|
| Unique visitors | 1,000+ |
| Copy button clicks | 500+ |
| Avg time on site | < 30 seconds (speed is the goal) |
| Return visitors | 20%+ |

---

## 10. Timeline

| Week | Milestone |
|------|-----------|
| 1 | Project setup, data structure, seed 20-50 skills |
| 2 | Homepage, search, skill cards, keyboard shortcuts |
| 3 | Detail pages, styling polish, QA |
| 4 | Launch, promote via @CodeAkram |

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Low traffic | Aggressive X/Reddit promotion |
| Official pool too small | Monitor; expand to vetted community if needed |
| Data staleness | Weekly manual curation (1-2 hrs) |
| Scraping breaks | Manual fallback, multiple sources |

---

## 12. Future Considerations (Post-MVP)

- "Suggest Official Skill" email form
- API for programmatic access
- Browser extension for quick lookup
- RSS feed for new skills
- Comparison tool (skill A vs skill B)

---

*Document owned by @CodeAkram. All decisions are final until they're not.*
