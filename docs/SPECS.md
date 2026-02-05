# Technical Specifications

## SkillIssue.world v1.0

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Search    │  │ Skill Cards │  │ Keyboard Handler│  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  Homepage   │  │ Skill Page  │  │   API Routes    │  │
│  │   /page.tsx │  │/skill/[slug]│  │  (if needed)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Data Layer                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              /data/skills.json                   │    │
│  │         (Static JSON, version controlled)        │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Vercel Platform                       │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐     │
│  │  Hosting │  │   Edge   │  │  Vercel Analytics  │     │
│  └──────────┘  └──────────┘  └────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Data Schema

### 2.1 Skill Object

```typescript
interface Skill {
  // Identifiers
  slug: string;                    // Unique per-skill slug
  name: string;                    // Display name
  org: string;                     // GitHub organization
  repo: string;                    // Repository name (no org prefix)

  // Content
  description: string;             // 1-3 sentences, curated
  longDescription?: string;        // Optional extended description

  // Install Commands (by agent)
  commands: AgentCommands;

  // Metadata
  tags: string[];                  // Category tags
  agents: AgentType[];             // Supported agents

  // Metrics
  installs: number;                // Install count (from skills.sh)
  stars: number;                   // GitHub stars

  // Timestamps
  lastUpdated: string;             // ISO 8601 date
  addedAt: string;                 // When we indexed it

  // Links
  repoUrl: string;                 // GitHub repo URL
  docsUrl?: string;                // Optional docs link

  // Internal
  featured?: boolean;              // Manual highlight flag
  velocity?: number;               // Growth rate for "Hot Spots"
}

interface AgentCommands {
  claudeCode: string;              // Required (default)
  codexCli?: string;
  cursor?: string;
  openCode?: string;
  geminiCli?: string;
  // Extensible for future agents
}

type AgentType =
  | 'claude-code'
  | 'codex-cli'
  | 'cursor'
  | 'open-code'
  | 'gemini-cli';

type CategoryTag =
  | 'react'
  | 'nextjs'
  | 'security'
  | 'database'
  | 'ui-design'
  | 'multi-agent'
  | 'devops'
  | 'testing'
  | 'documentation'
  | 'api'
  | 'backend'
  | 'frontend'
  | 'typescript'
  | 'python'
  | 'performance';
```

### 2.2 Example Skill Entry

```json
{
  "slug": "vercel-react-best-practices",
  "name": "React Best Practices",
  "org": "vercel-labs",
  "repo": "react-best-practices",
  "description": "Official Vercel guidelines for React component architecture, performance patterns, and Next.js integration.",
  "commands": {
    "claudeCode": "claude mcp add vercel-labs/react-best-practices",
    "codexCli": "codex skills install vercel-labs/react-best-practices",
    "cursor": "cursor skills add vercel-labs/react-best-practices"
  },
  "tags": ["react", "nextjs", "frontend", "performance"],
  "agents": ["claude-code", "codex-cli", "cursor"],
  "installs": 45230,
  "stars": 12400,
  "lastUpdated": "2026-01-28T14:30:00Z",
  "addedAt": "2026-02-01T10:00:00Z",
  "repoUrl": "https://github.com/vercel-labs/react-best-practices",
  "featured": true,
  "velocity": 1250
}
```

---

## 3. Directory Structure

```
skillissue.world/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
  │   ├── skill/
  │   │   └── [slug]/
  │   │       └── page.tsx        # Skill detail page (canonical)
│   ├── category/
│   │   └── [tag]/
│   │       └── page.tsx        # Category listing
│   └── globals.css             # Global styles
├── components/
│   ├── SearchBar.tsx           # Main search component
│   ├── SkillCard.tsx           # Skill display card
│   ├── SkillList.tsx           # List of skill cards
│   ├── AgentToggle.tsx         # Agent selector
│   ├── CopyButton.tsx          # Copy-to-clipboard button
│   ├── RepoLink.tsx            # GitHub link component
│   ├── CategoryChips.tsx       # Tag display
│   ├── KeyboardHandler.tsx     # Global keyboard shortcuts
│   └── Toast.tsx               # Copy confirmation toast
├── data/
│   └── skills.json             # Skill database
├── lib/
│   ├── skills.ts               # Data loading/filtering
│   ├── search.ts               # Search logic
│   ├── clipboard.ts            # Clipboard utilities
│   └── keyboard.ts             # Keyboard shortcut logic
├── hooks/
│   ├── useSearch.ts            # Search state hook
│   ├── useKeyboard.ts          # Keyboard shortcut hook
│   └── useCopy.ts              # Copy action hook
├── types/
│   └── index.ts                # TypeScript interfaces
├── public/
│   └── favicon.ico
├── docs/                       # This documentation
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. Component Specifications

### 4.1 SearchBar

```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

// Behavior:
// - Focused via '/' keyboard shortcut
// - Debounced input (150ms)
// - Clears on Escape
// - Shows result count while typing
```

### 4.2 SkillCard

```typescript
interface SkillCardProps {
  skill: Skill;
  isSelected?: boolean;          // For keyboard navigation
  onCopy?: () => void;
  selectedAgent: AgentType;
}

// Behavior:
// - Displays skill info in compact format
// - 'c' copies command when selected
// - 'g' opens repo when selected
// - Click expands or navigates to detail
```

### 4.3 AgentToggle

```typescript
interface AgentToggleProps {
  skill: Skill;
  selectedAgent: AgentType;
  onSelect: (agent: AgentType) => void;
}

// Behavior:
// - Shows only agents the skill supports
// - Defaults to 'claude-code'
// - Updates displayed command on change
// - Persists selection in localStorage
```

### 4.4 CopyButton

```typescript
interface CopyButtonProps {
  text: string;
  onCopied?: () => void;
}

// Behavior:
// - Uses navigator.clipboard.writeText()
// - Shows toast on success
// - Fallback for older browsers
// - Visual feedback (checkmark briefly)
```

---

## 5. Keyboard Shortcut System

### 5.1 Global Shortcuts

```typescript
const GLOBAL_SHORTCUTS = {
  '/': 'focusSearch',
  'Escape': 'clearSearch',
} as const;

const SKILL_SHORTCUTS = {
  'c': 'copyCommand',
  'g': 'goToRepo',
  'ArrowUp': 'previousSkill',
  'ArrowDown': 'nextSkill',
  'Enter': 'selectSkill',
} as const;
```

### 5.2 Implementation

```typescript
// hooks/useKeyboard.ts
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (e.target instanceof HTMLInputElement) {
        if (e.key === 'Escape') {
          // Allow escape to blur input
          (e.target as HTMLInputElement).blur();
        }
        return;
      }

      switch (e.key) {
        case '/':
          e.preventDefault();
          focusSearch();
          break;
        case 'c':
          copySelectedSkillCommand();
          break;
        case 'g':
          openSelectedSkillRepo();
          break;
        // ... etc
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
}
```

### 5.3 Edge Cases

| Scenario | Behavior |
|----------|----------|
| User typing in search | Only Escape works |
| No skill selected | c/g do nothing |
| Multiple skills visible | Arrow keys navigate |
| Modal open | Escape closes modal first |
| Command already copied | Show "Already copied" toast |

---

## 6. Search Specification

### 6.1 Search Algorithm

```typescript
function searchSkills(skills: Skill[], query: string): Skill[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return skills;

  return skills
    .map(skill => ({
      skill,
      score: calculateRelevance(skill, normalizedQuery)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ skill }) => skill);
}

function calculateRelevance(skill: Skill, query: string): number {
  let score = 0;

  // Exact name match (highest)
  if (skill.name.toLowerCase() === query) score += 100;

  // Name starts with query
  if (skill.name.toLowerCase().startsWith(query)) score += 50;

  // Name contains query
  if (skill.name.toLowerCase().includes(query)) score += 30;

  // Org match
  if (skill.org.toLowerCase().includes(query)) score += 20;

  // Description contains query
  if (skill.description.toLowerCase().includes(query)) score += 10;

  // Tag match
  if (skill.tags.some(t => t.includes(query))) score += 15;

  // Boost by popularity (normalized)
  score += Math.log10(skill.installs + 1) * 2;

  return score;
}
```

### 6.2 Search UX

- Debounce: 150ms
- Min query length: 1 character
- Max results shown: 50 (paginate if more)
- Empty state: Show "Hit Picks" section
- No results: Show suggestions

---

## 7. API Routes (If Needed)

### 7.1 Skills Endpoint

```typescript
// app/api/skills/route.ts
// Only if we need server-side filtering

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const tag = searchParams.get('tag');
  const agent = searchParams.get('agent');

  let skills = await getSkills();

  if (query) skills = searchSkills(skills, query);
  if (tag) skills = skills.filter(s => s.tags.includes(tag));
  if (agent) skills = skills.filter(s => s.agents.includes(agent));

  return Response.json({ skills });
}
```

---

## 8. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.0s |
| Largest Contentful Paint | < 1.5s |
| Time to Interactive | < 2.0s |
| Search response time | < 50ms |
| Copy action feedback | < 100ms |
| Total bundle size | < 100KB |

---

## 9. Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 14+ |
| Edge | 90+ |

Note: Clipboard API requires HTTPS.

---

## 10. Accessibility

- Keyboard navigation for all interactions
- ARIA labels on interactive elements
- Focus indicators visible
- Color contrast ratio ≥ 4.5:1
- Screen reader compatible
- Reduced motion support

---

*Specs are living documents. Update as implementation reveals new requirements.*
