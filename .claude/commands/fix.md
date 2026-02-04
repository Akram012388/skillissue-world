You are debugging and fixing the SkillIssue.world codebase. Run a self-healing loop until everything works.

**Direction:** $ARGUMENTS

## 1. Discovery Phase

Understand the current state:

```bash
# Project structure
ls -la src/components/
ls -la src/hooks/
ls -la src/app/
ls -la convex/

# Check for TypeScript errors
bun typecheck 2>&1

# Check for lint errors
bun lint 2>&1

# Try to build
bun run build 2>&1
```

Read key files to understand implementation:
- `src/app/page.tsx`
- `src/components/HomeContent.tsx`
- `src/hooks/useSkills.ts`
- `convex/skills.ts`

## 2. Common Issues Checklist

Check and fix these known issues:

### Color Consistency
All components must use `zinc-*` colors, NOT `gray-*`:
```bash
grep -r "gray-" src/components/ --include="*.tsx"
```
If found, replace all `gray-` with `zinc-`.

### Missing Dark Mode
Ensure all color classes have dark mode variants:
- `bg-zinc-100 dark:bg-zinc-800`
- `text-zinc-600 dark:text-zinc-400`
- `border-zinc-200 dark:border-zinc-700`

### Animation Dependencies
Check if `tailwindcss-animate` is used but not installed:
```bash
grep -r "animate-in\|slide-in" src/components/
```
If found, either install the package or replace with plain CSS transitions.

### No Data in Convex
Check if skills exist:
```bash
# Look for seed script
cat scripts/seed-skills.ts 2>/dev/null || echo "No seed script"

# Check data file
cat data/skills.json 2>/dev/null | head -20 || echo "No data file"
```
If no data, create and run a seed function.

### Import/Export Mismatches
Verify all exports match imports:
```bash
# Check component exports
cat src/components/index.ts

# Check hook exports
cat src/hooks/index.ts
```

## 3. Fix Loop

For each issue found:

1. **Identify** - Pinpoint the exact problem
2. **Fix** - Make the minimal change needed
3. **Verify** - Run `bun typecheck && bun lint`
4. **Test** - Check if the fix works
5. **Repeat** - Move to next issue

## 4. Runtime Verification

After all static fixes:

```bash
bun dev
```

Open localhost:3000 and verify:
- [ ] Page renders (not blank white screen)
- [ ] Search bar visible and styled
- [ ] Skills display (or proper loading/empty state)
- [ ] No console errors
- [ ] Keyboard shortcuts work (`/`, `c`, `g`)
- [ ] Copy shows toast feedback
- [ ] Dark mode works (if system preference is dark)

## 5. Full Build Verification

```bash
bun run build
```

Must complete without errors.

## 6. Report

After all fixes, report:

```
## Fix Summary

### Issues Found & Fixed:
1. [issue] - [fix applied]
2. ...

### Verification:
- TypeScript: ✅/❌
- Lint: ✅/❌
- Build: ✅/❌
- Runtime: ✅/❌

### Remaining Issues:
- [any blockers]

### Files Modified:
- path/file.tsx - [change]
```

## 7. Loop Until Done

If issues remain after first pass:
1. Re-run discovery
2. Identify new issues
3. Fix and verify
4. Repeat

**Success criteria:** All checks pass, localhost:3000 works perfectly.

If $ARGUMENTS specifies a particular issue, focus on that first.
