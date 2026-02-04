# Guidelines

## SkillIssue.world — Best Practices & Standards

These guidelines provide direction for maintaining and contributing to the project.

---

## 1. Code Style Guidelines

### 1.1 TypeScript

```typescript
// ✅ DO: Use explicit types
function getSkill(id: string): Skill | null { }

// ❌ DON'T: Use any
function getSkill(id: any): any { }

// ✅ DO: Use interfaces for objects
interface SkillCardProps {
  skill: Skill;
  isSelected: boolean;
}

// ❌ DON'T: Use inline object types repeatedly
function Card(props: { skill: Skill; isSelected: boolean }) { }
```

### 1.2 React Components

```typescript
// ✅ DO: Function components with explicit return types
export function SkillCard({ skill }: SkillCardProps): JSX.Element {
  return <div>...</div>;
}

// ❌ DON'T: Class components or implicit returns for complex components
export const SkillCard = ({ skill }) => <div>...</div>;

// ✅ DO: Destructure props
export function CopyButton({ text, onCopied }: CopyButtonProps) { }

// ❌ DON'T: Use props.x throughout
export function CopyButton(props: CopyButtonProps) {
  return <button onClick={() => copy(props.text)}>Copy</button>;
}
```

### 1.3 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `SkillCard.tsx` |
| Hooks | camelCase, use prefix | `useSearch.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types/Interfaces | PascalCase | `Skill`, `AgentType` |
| Constants | SCREAMING_SNAKE | `MAX_RESULTS` |
| Files | kebab-case (non-components) | `skill-utils.ts` |

### 1.4 File Organization

```typescript
// Order within a file:
// 1. Imports (external, then internal)
// 2. Types/Interfaces
// 3. Constants
// 4. Helper functions
// 5. Main export
// 6. Sub-components (if any)

import { useState } from 'react';
import { Skill } from '@/types';

interface Props { }

const MAX_ITEMS = 50;

function formatSkill(skill: Skill): string { }

export function SkillList({ skills }: Props): JSX.Element { }
```

---

## 2. Commit Guidelines

### 2.1 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2.2 Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `data` | Skill data changes |
| `docs` | Documentation |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `chore` | Maintenance |

### 2.3 Examples

```bash
# Good
feat(search): add keyboard shortcut for focus
fix(copy): handle clipboard API failure gracefully
data: add 5 new Anthropic skills
docs: update ADR for agent defaults

# Bad
updated stuff
fix bug
changes
```

---

## 3. Data Curation Guidelines

### 3.1 Adding a New Skill

**Checklist before adding:**

- [ ] Is it under an official org namespace?
- [ ] Is it actively maintained (commit in last 6 months)?
- [ ] Does it have documentation (SKILL.md or README)?
- [ ] Is it a skill (not a general library)?
- [ ] Is the Claude Code command documented or derivable?

**Data entry process:**

1. Copy template from existing skill
2. Fill all required fields
3. Write description (1-3 sentences, factual, no marketing)
4. Assign appropriate tags (max 5)
5. Verify URLs work
6. Test install command locally if possible

### 3.2 Writing Descriptions

**DO:**
```
"Official Vercel guidelines for React component architecture
and performance patterns. Covers hooks, state management,
and Next.js integration."
```

**DON'T:**
```
"The BEST and most AMAZING React skill you'll ever use!!!
Must-have for all developers. Revolutionary approach to
building components. You won't believe how good this is!"
```

**Guidelines:**
- Factual, not promotional
- What it does, not why it's great
- 1-3 sentences max
- No exclamation marks
- No superlatives ("best", "amazing", "revolutionary")

### 3.3 Assigning Tags

**Primary tags** (pick 1-2):
- Technology: `react`, `nextjs`, `typescript`, `python`
- Domain: `database`, `security`, `api`, `ui-design`

**Secondary tags** (pick 0-2):
- Capability: `testing`, `documentation`, `devops`
- Pattern: `multi-agent`, `performance`, `backend`

**Tag limits:**
- Minimum: 1
- Maximum: 5
- If you can't pick, skill might be too generic

### 3.4 Updating Skills

**When to update:**
- New version released
- Install command changed
- Description needs correction
- New agent support added
- Metrics refresh (weekly)

**Process:**
1. Update `lastUpdated` timestamp
2. Update changed fields only
3. Note in CHANGELOG.md
4. Verify nothing broke

### 3.5 Removing Skills

**Criteria for removal:**
- Repo deleted or archived
- No commits in 12+ months (unless LTS)
- Org disavows ownership
- Severe security issue

**Process:**
1. Document reason in CHANGELOG.md
2. Remove from skills.json
3. Redirect skill page to homepage (or 404)

---

## 4. UI/UX Guidelines

### 4.1 Color Palette

```css
/* Neutral, Wikipedia-like palette */
--bg-primary: #ffffff;
--bg-secondary: #f5f5f5;
--text-primary: #1a1a1a;
--text-secondary: #666666;
--text-muted: #999999;
--border: #e0e0e0;
--accent: #0066cc;        /* Links, interactive */
--accent-hover: #0052a3;
--success: #22c55e;       /* Copy confirmation */
--code-bg: #f0f0f0;
```

### 4.2 Typography

```css
/* System fonts for speed */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;

/* Sizes */
--text-xs: 0.75rem;   /* 12px - tags */
--text-sm: 0.875rem;  /* 14px - secondary */
--text-base: 1rem;    /* 16px - body */
--text-lg: 1.125rem;  /* 18px - skill names */
--text-xl: 1.25rem;   /* 20px - section headers */
--text-2xl: 1.5rem;   /* 24px - page titles */
```

### 4.3 Spacing

```css
/* Consistent spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
```

### 4.4 Component Patterns

**Buttons:**
- Primary: Filled accent color (copy action)
- Secondary: Border only (navigation)
- Ghost: No border, hover reveals (repo link)

**Cards:**
- Light border, no shadow
- Subtle hover state (bg change)
- Focus state for keyboard nav

**Toasts:**
- Bottom-right position
- Auto-dismiss after 2s
- No close button needed

### 4.5 Responsive Breakpoints

```css
/* Mobile-first */
--bp-sm: 640px;   /* Small tablets */
--bp-md: 768px;   /* Tablets */
--bp-lg: 1024px;  /* Desktop */
--bp-xl: 1280px;  /* Large desktop */
```

---

## 5. Performance Guidelines

### 5.1 Bundle Size Limits

| Category | Limit |
|----------|-------|
| Total JS | < 100KB |
| Total CSS | < 20KB |
| Per-page JS | < 30KB |
| Initial load | < 50KB |

### 5.2 Performance Budget

| Metric | Budget |
|--------|--------|
| FCP | < 1.0s |
| LCP | < 1.5s |
| TTI | < 2.0s |
| CLS | < 0.1 |

### 5.3 Optimization Rules

1. **No heavy dependencies** - Question every npm install
2. **Static generation** - SSG where possible
3. **Lazy load** - Below-fold content only
4. **System fonts** - No web font downloads
5. **No images** - Text only (see Rules)
6. **Inline critical CSS** - Above-fold styles

---

## 6. Accessibility Guidelines

### 6.1 Keyboard Navigation

- All interactive elements focusable
- Visible focus indicators
- Logical tab order
- Skip links for main content

### 6.2 Screen Readers

```tsx
// ✅ DO: Provide context
<button aria-label="Copy install command for React Best Practices">
  Copy
</button>

// ❌ DON'T: Rely on visual context
<button>Copy</button>
```

### 6.3 Color Contrast

- Body text: 7:1 ratio minimum
- UI elements: 4.5:1 ratio minimum
- Never rely on color alone

### 6.4 Motion

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Testing Guidelines

### 7.1 What to Test

| Priority | What |
|----------|------|
| P0 | Search returns correct results |
| P0 | Copy button copies correct command |
| P0 | Keyboard shortcuts work |
| P1 | Agent toggle switches command |
| P1 | Links open correctly |
| P2 | Edge cases (empty search, no results) |

### 7.2 Manual QA Checklist

Before each deploy:
- [ ] Search works with various queries
- [ ] Copy works in Chrome, Firefox, Safari
- [ ] All keyboard shortcuts functional
- [ ] Mobile responsive layout correct
- [ ] No console errors
- [ ] All skill links valid

---

## 8. Documentation Guidelines

### 8.1 Code Comments

```typescript
// ✅ DO: Explain WHY, not WHAT
// We debounce search to prevent API spam during typing
const debouncedSearch = useMemo(() => debounce(search, 150), []);

// ❌ DON'T: State the obvious
// This function searches skills
function searchSkills(query: string) { }
```

### 8.2 README Updates

Update README when:
- New feature added
- Setup process changes
- New dependency added
- Breaking change introduced

### 8.3 CHANGELOG Entries

Every skill data change should be logged:
```markdown
## [Unreleased]
### Added
- anthropics/design-patterns skill
- vercel-labs/performance-metrics skill

### Updated
- openai/codex-prompts: new version with improved context handling

### Removed
- deprecated/old-skill: archived by maintainer
```

---

*Guidelines evolve. When in doubt, ask or check recent patterns in the codebase.*
