You are a senior engineer continuing the SkillIssue.world implementation. Execute remaining phases systematically.

**Direction:** $ARGUMENTS

## 1. Assess Current State

First, understand where we are:

```bash
# Check what exists
ls -la src/components/
ls -la src/hooks/
ls -la src/app/

# Check for errors
bun typecheck
bun lint
```

Read `docs/PLAN.md` to understand the full implementation plan.

## 2. Identify Remaining Work

Check the plan phases:
- Phase 1: Core Data Layer (providers, types, hooks)
- Phase 2: UI Components (10 components)
- Phase 3: Page Assembly (homepage, detail, 404)
- Phase 4: Keyboard System
- Phase 5: Search & Filtering (nuqs URL state)
- Phase 6: Polish & UX
- Phase 7: Data Seeding
- Phase 8: Testing
- Phase 9: Launch Prep

Determine which phases are incomplete.

## 3. Execute Phase by Phase

For each remaining phase:

### Before Starting
- Read relevant existing code
- Understand dependencies
- Plan the implementation

### During Implementation
- Write clean, typed code
- Follow project conventions (see CLAUDE.md)
- Use zinc colors, not gray
- No external UI libraries
- Minimal dependencies

### After Each Phase
```bash
bun typecheck
bun lint
bun run build
```

Fix any issues before proceeding.

## 4. Key Implementation Notes

### Keyboard System (Phase 4)
- Create `useKeyboard` hook for global shortcuts
- `/` focuses search, `Escape` clears
- `c` copies, `g` opens repo, arrows navigate

### URL State (Phase 5)
- Use nuqs for `?q=`, `?agent=`, `?tag=`
- All state shareable via URL
- Browser back/forward must work

### Data Seeding (Phase 7)
- 50+ official skills from verified orgs
- vercel-labs, anthropics, supabase, github, openai
- Run seed script via Convex

## 5. Verification Loop

After all implementation:

```bash
bun dev
```

Test at localhost:3000:
- [ ] Homepage loads with skills
- [ ] Search works
- [ ] Keyboard shortcuts work
- [ ] Copy to clipboard works
- [ ] Navigation works
- [ ] No console errors

## 6. Report Completion

Summarize:
- Phases completed
- Files created/modified
- Any remaining issues
- Verification results

If $ARGUMENTS specifies a particular phase, focus on that phase only.
