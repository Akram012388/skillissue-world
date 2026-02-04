# PLAN.md

## SkillIssue.world — UX Clone Implementation Plan

**Status**: Ready to Execute
**Reference Sites**: skills.sh (primary), skillsdirectory.com (supplementary)
**Last Updated**: 2026-02-04

---

## Executive Summary

This document is a pixel-perfect UX specification derived from reverse-engineering skills.sh and skillsdirectory.com. Every component, interaction, and visual pattern is documented for exact replication.

---

## I. SITE ARCHITECTURE

### URL Structure (Clone skills.sh exactly)

```
/                           → Homepage (leaderboard + search)
/docs                       → Documentation page
/[org]                      → Organization page (e.g., /vercel-labs)
/[org]/[repo]               → Repository skills page (e.g., /vercel-labs/agent-skills)
/[org]/[repo]/[skill]       → Individual skill detail (e.g., /vercel-labs/agent-skills/vercel-react-best-practices)
```

### Navigation Hierarchy

```
Breadcrumb Pattern:
skills / [org] / [repo] / [skill-name]
   ↑       ↑       ↑          ↑
  home   org pg  repo pg   skill detail

Each segment is a clickable link enabling backward traversal.
```

---

## II. GLOBAL LAYOUT

### Header (Sticky, z-50)

```
┌─────────────────────────────────────────────────────────────────┐
│  [▲ Logo] │ Skills                                        Docs  │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Position: `sticky top-0 z-50`
- Background: `bg-background` (dark theme)
- Height: 48-56px
- Container: `max-w-6xl mx-auto`

**Left Section:**
- Logo: Vercel-style triangle (SVG, 20x20px) → Links to `/`
- Separator: Vertical line `|` with `text-muted-foreground`
- Brand: "Skills" text → Links to `/`

**Right Section:**
- "Docs" link → `/docs`
- Typography: `text-sm text-muted-foreground hover:text-foreground transition-colors`

### Body Container

```css
.container {
  max-width: 1152px; /* max-w-6xl */
  margin: 0 auto;
  padding: 0 16px;
}
```

### Footer

Minimal — no explicit footer. Vercel branding in header suffices.

---

## III. HOMEPAGE (`/`)

### Section 1: Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ███████╗██╗  ██╗██╗██╗     ██╗     ███████╗                   │
│  ██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝    The Open       │
│  ███████╗█████╔╝ ██║██║     ██║     ███████╗    Agent Skills   │
│  ╚════██║██╔═██╗ ██║██║     ██║     ╚════██║    Ecosystem      │
│  ███████║██║  ██╗██║███████╗███████╗███████║                   │
│  ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝                   │
│                                                                 │
│  Skills are reusable capabilities for AI agents                 │
│  that function as plugins enhancing agent functionality.        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  INSTALL IN ONE COMMAND                                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ $ npx skills add [owner/repo]                    [📋]  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  AVAILABLE FOR THESE AGENTS                                     │
│  [claude-code] [cursor] [codex] [gemini-cli] [opencode] ...    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Grid Layout:**
```css
/* Desktop: 2 columns */
.hero-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px; /* gap-10 */
}

/* Mobile: stack */
@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
```

**ASCII Art Logo:**
- Font: Monospace (Fira Mono or system mono)
- Color: `text-foreground`
- Responsive: Hide on mobile or scale down

**Tagline:**
- Text: "The Open Agent Skills Ecosystem"
- Typography: `text-xl sm:text-2xl lg:text-3xl font-medium`

**Description:**
- Text: "Skills are reusable capabilities for AI agents..."
- Typography: `text-muted-foreground text-base`

**Install Command Box:**
```
┌──────────────────────────────────────────────────────┐
│ $ npx skills add [owner/repo]              [📋 Copy] │
└──────────────────────────────────────────────────────┘

- Background: bg-(--ds-gray-100)/80 (translucent)
- Border: none, rounded-md
- Font: Fira Mono / monospace
- Copy button: Right-aligned, icon button
```

**Agent Carousel:**
```
Horizontal scrollable row of agent badges:
[claude-code] [cursor] [codex] [gemini-cli] [opencode] [antigravity] [aider] ...

- 20+ agent logos as SVG badges
- Horizontal scroll on overflow
- Each badge links to external agent site
- Spacing: gap-3
```

---

### Section 2: Search Bar

```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 Search skills...                                       [/]  │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Width: Full width of container
- Height: 48px
- Background: `bg-muted`
- Border: `border border-border rounded-lg`
- Padding: `px-4`

**Input:**
- Placeholder: "Search skills..."
- Typography: `text-base`
- Icon: Search icon (left, 20x20)

**Keyboard Hint:**
- Badge: `/` character in rounded pill
- Position: Right side inside input
- Typography: `text-xs text-muted-foreground bg-muted-foreground/10 px-2 py-1 rounded`

**Behavior:**
- Press `/` anywhere → Focus search input
- Debounce: 150ms
- URL sync: `/?q={query}` via nuqs
- Clear: `Escape` key clears and blurs

---

### Section 3: Leaderboard Tabs

```
┌────────────────────────────────────────────────────────────────┐
│  [All Time (39,453)]  [Trending (24h)]  [Hot]                  │
└────────────────────────────────────────────────────────────────┘
```

**Toggle Button Group:**
```jsx
<div className="flex gap-2">
  <button className={active ? "bg-foreground text-background" : "bg-muted text-foreground"}>
    All Time (39,453)
  </button>
  <button>Trending (24h)</button>
  <button>Hot</button>
</div>
```

**Button Styles:**
- Active: `bg-foreground text-background rounded-full px-4 py-1.5`
- Inactive: `bg-transparent text-muted-foreground hover:text-foreground`
- Typography: `text-sm font-medium`

**Count Display:**
- Format: Number with thousands separator in parentheses
- Updates dynamically based on filter

---

### Section 4: Leaderboard Table

```
┌─────────────────────────────────────────────────────────────────┐
│ #  │ Skill Name                           │ Repository │ Installs │
├────┼──────────────────────────────────────┼────────────┼──────────┤
│ 1  │ vercel-react-best-practices          │ vercel-labs│  73.8K   │
│ 2  │ vercel-composition-patterns          │ vercel-labs│  52.1K   │
│ 3  │ find-skills                          │ vercel-labs│  41.2K   │
│ 4  │ pdf                                  │ anthropics │  38.9K   │
│ ...│ ...                                  │ ...        │  ...     │
└─────────────────────────────────────────────────────────────────┘
```

**Table Structure:**
```jsx
<table className="w-full">
  <tbody>
    {skills.map((skill, index) => (
      <tr key={skill.id} className="hover:bg-muted transition-colors cursor-pointer">
        <td className="py-3 pr-4 text-muted-foreground w-12">{index + 1}</td>
        <td className="py-3 font-medium">{skill.name}</td>
        <td className="py-3 text-muted-foreground">{skill.org}</td>
        <td className="py-3 text-right tabular-nums">{formatCount(skill.installs)}</td>
      </tr>
    ))}
  </tbody>
</table>
```

**Row Specifications:**
- Height: ~48px (py-3)
- Hover: `hover:bg-muted`
- Cursor: `pointer`
- Click: Navigate to `/[org]/[repo]/[skill]`

**Columns:**
1. **Rank**: `text-muted-foreground w-12` — Right-aligned number
2. **Skill Name**: `font-medium` — Primary text, truncate if needed
3. **Repository/Org**: `text-muted-foreground` — Secondary
4. **Install Count**: `text-right tabular-nums` — Formatted (e.g., "73.8K")

**Number Formatting:**
```typescript
function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
```

**Pagination:**
- Load 50 initially
- Infinite scroll or "Load more" button
- Intersection Observer for infinite scroll

---

## IV. ORGANIZATION PAGE (`/[org]`)

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: skills / vercel-labs                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  vercel-labs                                        [GitHub →]  │
│  8 repos · 14 skills · 7.2K total installs                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Repository                                            Installs │
├─────────────────────────────────────────────────────────────────┤
│  agent-skills                                            195.9K │
│  6 skills: vercel-react-best-practices, ...                     │
├─────────────────────────────────────────────────────────────────┤
│  skills                                                   41.2K │
│  4 skills: find-skills, ...                                     │
├─────────────────────────────────────────────────────────────────┤
│  ...                                                            │
└─────────────────────────────────────────────────────────────────┘
```

**Header Section:**
- Org name: `text-3xl font-bold`
- Stats: `text-muted-foreground text-sm`
- GitHub link: Icon button, external link

**Repository List:**
- Each row: Repository name (bold) + skill count + skill names preview
- Right column: Total installs for that repo
- Click: Navigate to `/[org]/[repo]`

---

## V. REPOSITORY PAGE (`/[org]/[repo]`)

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: skills / vercel-labs / agent-skills                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  agent-skills                                       [GitHub →]  │
│  6 skills · 195.9K total installs                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Skill Name                                            Installs │
├─────────────────────────────────────────────────────────────────┤
│  vercel-react-best-practices                             90.9K  │
│  React and Next.js performance optimization guidelines...       │
├─────────────────────────────────────────────────────────────────┤
│  vercel-composition-patterns                             52.1K  │
│  React composition patterns that scale...                       │
├─────────────────────────────────────────────────────────────────┤
│  ...                                                            │
└─────────────────────────────────────────────────────────────────┘
```

**Skill Row:**
- Name: `font-medium text-lg`
- Description: `text-muted-foreground text-sm line-clamp-2`
- Installs: `text-right tabular-nums`
- Click: Navigate to full skill detail

---

## VI. SKILL DETAIL PAGE (`/[org]/[repo]/[skill]`)

### Layout (Desktop: 12-column grid)

```
┌───────────────────────────────────────────────────────────────────────┐
│  Breadcrumb: skills / vercel-labs / agent-skills / vercel-react-...  │
├───────────────────────────────────────────────────────┬───────────────┤
│                                                       │               │
│  vercel-react-best-practices                          │  WEEKLY       │
│                                                       │  INSTALLS     │
│  React and Next.js performance optimization           │  73.8K        │
│  guidelines from Vercel Engineering.                  │               │
│                                                       ├───────────────┤
│  ─────────────────────────────────────────────────   │  REPOSITORY   │
│  INSTALL COMMAND                                      │  [GitHub →]   │
│  ┌─────────────────────────────────────────────┐     │               │
│  │ $ npx skills add vercel-labs/agent-...  [📋]│     ├───────────────┤
│  └─────────────────────────────────────────────┘     │  FIRST SEEN   │
│                                                       │  Jan 16, 2026 │
│  ─────────────────────────────────────────────────   │               │
│  SKILL.md                                             ├───────────────┤
│                                                       │  INSTALLED ON │
│  ## When to Apply                                     │  claude-code  │
│  - Writing new React components                       │    49.7K      │
│  - Implementing data fetching                         │  cursor       │
│  - Reviewing existing code                            │    40.0K      │
│  - Refactoring components                             │  codex        │
│  - Performance optimization                           │    27.3K      │
│                                                       │  gemini-cli   │
│  ## Rule Categories by Priority                       │    30.1K      │
│  | Category | Impact | Count |                       │  ...          │
│  |----------|--------|-------|                       │               │
│  | async-   | CRIT   | 8     |                       │               │
│  | bundle-  | HIGH   | 10    |                       │               │
│  | ...      | ...    | ...   |                       │               │
│                                                       │               │
└───────────────────────────────────────────────────────┴───────────────┘
```

**Grid Layout:**
```css
.skill-detail-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
}

@media (max-width: 1024px) {
  .skill-detail-grid {
    grid-template-columns: 1fr;
  }
}
```

**Main Content (Left Column):**
1. Skill name: `text-4xl font-bold`
2. Description: `text-xl text-muted-foreground`
3. Install command box (same as homepage)
4. SKILL.md content rendered as Markdown

**Sidebar (Right Column):**
Cards stacked vertically:

```jsx
<aside className="space-y-4">
  <Card title="Weekly Installs" value="73.8K" />
  <Card title="Repository" link={githubUrl} />
  <Card title="First Seen" value="Jan 16, 2026" />
  <Card title="Installed On" agents={agentBreakdown} />
</aside>
```

**Sidebar Card Styles:**
- Background: `bg-muted rounded-lg p-4`
- Title: `text-xs uppercase text-muted-foreground mb-1`
- Value: `text-2xl font-mono`

---

## VII. DOCUMENTATION PAGE (`/docs`)

### Content Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Documentation                                                  │
│  Learn how to discover, install, and use skills.               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ## What are skills?                                            │
│  Skills are reusable capabilities for AI agents...              │
│                                                                 │
│  ## Getting Started                                             │
│  $ npx skills add [owner/repo]                                  │
│                                                                 │
│  ## How Skills are Ranked                                       │
│  The leaderboard uses anonymous telemetry data...               │
│                                                                 │
│  ## Browse Skills                                               │
│  Discover skills on the homepage →                              │
│                                                                 │
│  ## Security                                                    │
│  We perform routine security audits...                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Layout:**
- Single column, max-width prose
- Sections separated by `space-y-8`
- Code blocks with copy functionality

---

## VIII. SUPPLEMENTARY UX FROM skillsdirectory.com

### Filter Sidebar (Adapted for Category Page)

```
┌─────────────────────────────────────────────────────────────────┐
│  FILTERS                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Search                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔍 Filter skills...                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Sort By                                                        │
│  [▼ Relevance]                                                  │
│                                                                 │
│  Categories                                                     │
│  ☑ Development                                                  │
│  ☑ Frontend                                                     │
│  ☐ Backend                                                      │
│  ☐ DevOps                                                       │
│  ☐ Security                                                     │
│                                                                 │
│  Organizations                                                  │
│  ☑ vercel-labs (45)                                            │
│  ☑ anthropics (12)                                             │
│  ☐ openai (8)                                                  │
│  ☐ supabase (6)                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Use Case**: Category browse page `/category/[tag]`

**Filter Behaviors:**
- Multi-select checkboxes
- URL state sync: `/?categories=frontend,backend&orgs=vercel-labs`
- Real-time filtering (no submit button)

### Loading Skeletons (From skillsdirectory.com)

```jsx
function SkillCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
      <div className="h-4 bg-muted rounded w-1/2 mb-4" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-5/6 mt-1" />
    </div>
  );
}
```

### Theme Toggle (Dark/Light)

```jsx
<button
  onClick={toggleTheme}
  className="p-2 rounded-lg hover:bg-muted"
  aria-label="Toggle theme"
>
  {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
</button>
```

- Position: Header right side
- Default: Dark (matches skills.sh)
- Persistence: localStorage + system preference detection

---

## IX. COMPONENT SPECIFICATIONS

### 1. Breadcrumb

```tsx
interface BreadcrumbProps {
  segments: Array<{ label: string; href: string }>;
}

function Breadcrumb({ segments }: BreadcrumbProps) {
  return (
    <nav className="text-sm text-muted-foreground mb-6">
      {segments.map((segment, i) => (
        <span key={segment.href}>
          {i > 0 && <span className="mx-2">/</span>}
          <Link href={segment.href} className="hover:text-foreground">
            {segment.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
```

### 2. CopyButton

```tsx
interface CopyButtonProps {
  text: string;
  className?: string;
}

function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn("p-2 hover:bg-muted rounded transition-colors", className)}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}
```

### 3. InstallCommand

```tsx
interface InstallCommandProps {
  command: string;
}

function InstallCommand({ command }: InstallCommandProps) {
  return (
    <div className="flex items-center gap-2 bg-muted/80 rounded-md px-4 py-3 font-mono text-sm">
      <span className="text-muted-foreground">$</span>
      <code className="flex-1">{command}</code>
      <CopyButton text={command} />
    </div>
  );
}
```

### 4. AgentBadge

```tsx
interface AgentBadgeProps {
  agent: AgentType;
  count?: number;
}

function AgentBadge({ agent, count }: AgentBadgeProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
      <AgentIcon agent={agent} className="w-4 h-4" />
      <span className="text-sm font-medium">{agent}</span>
      {count && <span className="text-xs text-muted-foreground">{formatCount(count)}</span>}
    </div>
  );
}
```

### 5. StatCard (Sidebar)

```tsx
interface StatCardProps {
  title: string;
  value: string | React.ReactNode;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-muted rounded-lg p-4">
      <div className="text-xs uppercase text-muted-foreground mb-1">{title}</div>
      <div className="text-2xl font-mono">{value}</div>
    </div>
  );
}
```

### 6. LeaderboardRow

```tsx
interface LeaderboardRowProps {
  rank: number;
  skill: Skill;
  onClick: () => void;
}

function LeaderboardRow({ rank, skill, onClick }: LeaderboardRowProps) {
  return (
    <tr
      onClick={onClick}
      className="hover:bg-muted transition-colors cursor-pointer group"
    >
      <td className="py-3 pr-4 text-muted-foreground w-12 text-right">{rank}</td>
      <td className="py-3 font-medium group-hover:text-foreground transition-colors">
        {skill.name}
      </td>
      <td className="py-3 text-muted-foreground">{skill.org}</td>
      <td className="py-3 text-right tabular-nums">{formatCount(skill.installs)}</td>
    </tr>
  );
}
```

---

## X. KEYBOARD SHORTCUTS

### Global Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `/` | Focus search input | Anywhere |
| `Escape` | Clear search + blur | When search focused |
| `↑` / `k` | Previous item | Leaderboard focused |
| `↓` / `j` | Next item | Leaderboard focused |
| `Enter` | Navigate to selected | Item selected |
| `c` | Copy install command | Item selected |
| `g` | Open GitHub repo | Item selected |

### Implementation

```tsx
function useKeyboardNavigation() {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if typing in input (except search)
      if (e.target instanceof HTMLInputElement && e.target !== searchRef.current) {
        return;
      }

      switch (e.key) {
        case '/':
          e.preventDefault();
          searchRef.current?.focus();
          break;
        case 'Escape':
          searchRef.current?.blur();
          setSelectedIndex(-1);
          break;
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, maxIndex));
          break;
        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          if (selectedIndex >= 0) {
            navigateToSkill(selectedIndex);
          }
          break;
        case 'c':
          if (selectedIndex >= 0) {
            copyCommand(selectedIndex);
          }
          break;
        case 'g':
          if (selectedIndex >= 0) {
            openRepo(selectedIndex);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return { selectedIndex, setSelectedIndex, searchRef };
}
```

---

## XI. COLOR SYSTEM

### Dark Theme (Default - Clone skills.sh)

```css
:root {
  --background: 0 0% 3.9%;           /* #0a0a0a */
  --foreground: 0 0% 98%;            /* #fafafa */
  --muted: 0 0% 14.9%;               /* #262626 */
  --muted-foreground: 0 0% 63.9%;    /* #a3a3a3 */
  --border: 0 0% 14.9%;              /* #262626 */
  --ring: 0 0% 83.1%;                /* #d4d4d4 */
}
```

### Light Theme (Optional from skillsdirectory.com)

```css
.light {
  --background: 0 0% 100%;           /* #ffffff */
  --foreground: 0 0% 3.9%;           /* #0a0a0a */
  --muted: 0 0% 96.1%;               /* #f5f5f5 */
  --muted-foreground: 0 0% 45.1%;    /* #737373 */
  --border: 0 0% 89.8%;              /* #e5e5e5 */
  --ring: 0 0% 3.9%;                 /* #0a0a0a */
}
```

---

## XII. TYPOGRAPHY

### Font Stack

```css
--font-sans: system-ui, -apple-system, sans-serif;
--font-mono: 'Fira Mono', 'SF Mono', 'Monaco', monospace;
```

### Scale

| Element | Class | Size |
|---------|-------|------|
| Page Title | `text-4xl font-bold` | 36px |
| Section Title | `text-2xl font-bold` | 24px |
| Card Title | `text-lg font-medium` | 18px |
| Body | `text-base` | 16px |
| Small/Meta | `text-sm` | 14px |
| Micro/Label | `text-xs uppercase` | 12px |
| Code | `font-mono text-sm` | 14px |

---

## XIII. RESPONSIVE BREAKPOINTS

```css
/* Mobile first */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Key Responsive Patterns

1. **Hero Grid**: 2-col → 1-col below lg
2. **Skill Detail**: Sidebar → Stacked below lg
3. **Leaderboard**: Full table → Simplified cards on mobile
4. **Search Bar**: Full width, consistent across all
5. **Keyboard Hints**: Hidden on mobile (touch-first)

---

## XIV. ANIMATION & TRANSITIONS

### Standard Transitions

```css
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-all {
  transition-property: all;
  transition-duration: 150ms;
}
```

### Loading Skeleton

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## XV. DATA SCHEMA (Convex)

```typescript
// convex/schema.ts
export default defineSchema({
  skills: defineTable({
    // Identity
    slug: v.string(),           // "vercel-react-best-practices"
    name: v.string(),           // "vercel-react-best-practices"
    org: v.string(),            // "vercel-labs"
    repo: v.string(),           // "agent-skills"

    // Content
    description: v.string(),
    fullDescription: v.optional(v.string()), // Rendered SKILL.md

    // Metrics
    installs: v.number(),
    weeklyInstalls: v.number(),
    stars: v.optional(v.number()),

    // Metadata
    tags: v.array(v.string()),
    supportedAgents: v.array(v.string()),
    agentInstalls: v.optional(v.object({
      claudeCode: v.number(),
      cursor: v.number(),
      codex: v.number(),
      geminiCli: v.number(),
      // ... etc
    })),

    // Timestamps
    firstSeen: v.string(),      // ISO date
    lastUpdated: v.string(),    // ISO date

    // External
    repoUrl: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_org", ["org"])
    .index("by_installs", ["installs"])
    .index("by_weekly", ["weeklyInstalls"])
    .searchIndex("search_skills", {
      searchField: "name",
      filterFields: ["org", "tags"],
    }),

  // Organizations aggregate
  orgs: defineTable({
    name: v.string(),           // "vercel-labs"
    displayName: v.string(),    // "Vercel Labs"
    repoCount: v.number(),
    skillCount: v.number(),
    totalInstalls: v.number(),
    githubUrl: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_installs", ["totalInstalls"]),
});
```

---

## XVI. EXECUTION PHASES

### Phase 1: Core Layout (Foundation)

**Files to create/modify:**
```
src/app/layout.tsx          — Root layout with header
src/app/page.tsx            — Homepage shell
src/components/Header.tsx   — Sticky header
src/components/Breadcrumb.tsx
src/lib/constants.ts        — Colors, breakpoints
```

**Deliverable**: Navigation works, dark theme applied

---

### Phase 2: Homepage Hero + Search

**Files:**
```
src/components/Hero.tsx
src/components/ASCIILogo.tsx
src/components/SearchBar.tsx
src/components/InstallCommand.tsx
src/components/CopyButton.tsx
src/components/AgentCarousel.tsx
src/hooks/useSearch.ts
```

**Deliverable**: Hero renders, search focuses with `/`

---

### Phase 3: Leaderboard

**Files:**
```
src/components/LeaderboardTabs.tsx
src/components/LeaderboardTable.tsx
src/components/LeaderboardRow.tsx
src/hooks/useLeaderboard.ts
convex/skills.ts             — Add trending/hot queries
```

**Deliverable**: Full leaderboard with sorting tabs

---

### Phase 4: Organization + Repository Pages

**Files:**
```
src/app/[org]/page.tsx
src/app/[org]/[repo]/page.tsx
src/components/OrgHeader.tsx
src/components/RepoSkillList.tsx
```

**Deliverable**: Navigate to org/repo pages via breadcrumbs

---

### Phase 5: Skill Detail Page

**Files:**
```
src/app/[org]/[repo]/[skill]/page.tsx
src/components/SkillDetail.tsx
src/components/SkillSidebar.tsx
src/components/StatCard.tsx
src/components/AgentBreakdown.tsx
src/lib/markdown.ts          — SKILL.md rendering
```

**Deliverable**: Full skill detail with sidebar stats

---

### Phase 6: Documentation Page

**Files:**
```
src/app/docs/page.tsx
src/components/DocsContent.tsx
```

**Deliverable**: Static docs page matching skills.sh/docs

---

### Phase 7: Keyboard Navigation

**Files:**
```
src/hooks/useKeyboard.ts
src/components/KeyboardHandler.tsx
src/components/KeyboardHint.tsx
```

**Deliverable**: All shortcuts working per spec

---

### Phase 8: Polish & Responsive

**Focus:**
- Mobile responsive testing
- Loading skeletons
- Error states
- 404 page
- Meta tags + SEO

---

### Phase 9: Data Seeding + Launch

**Focus:**
- Scrape/seed 50+ skills
- Verify all pages work with real data
- Performance audit
- Deploy

---

## XVII. VERIFICATION CHECKLIST

```
[ ] Header matches skills.sh exactly
[ ] ASCII logo renders (or text fallback)
[ ] Search input focuses on '/'
[ ] Leaderboard tabs switch correctly
[ ] Row click navigates to skill
[ ] Copy button works + shows feedback
[ ] Breadcrumbs work at all levels
[ ] Org page lists repos
[ ] Repo page lists skills
[ ] Skill detail shows full info
[ ] Sidebar stats display correctly
[ ] Agent breakdown shows counts
[ ] Docs page content matches
[ ] All keyboard shortcuts work
[ ] Mobile layout is usable
[ ] Dark theme is default
[ ] URLs are shareable
[ ] Loading states show
[ ] 404 page works
```

---

## XVIII. SOURCES

Primary reference: https://skills.sh/
- Homepage leaderboard structure
- Skill detail page layout
- Breadcrumb navigation
- Install command UX
- Agent carousel
- Dark theme colors

Secondary reference: https://www.skillsdirectory.com/skills
- Filter sidebar patterns
- Category system
- Loading skeleton design
- Theme toggle placement

---

*This document is the complete UX specification. Execute with precision.*
*Speed > Choice > Completeness.*
