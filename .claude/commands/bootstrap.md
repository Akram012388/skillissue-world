You are setting up the SkillIssue.world project from scratch. Follow these steps exactly.

**Direction:** $ARGUMENTS

## 1. Verify Prerequisites

```bash
# Check required tools
node --version  # Should be 18+
bun --version   # Should be 1.0+
```

If missing, stop and tell the user what to install.

## 2. Install Dependencies

```bash
bun install
```

## 3. Initialize Convex

```bash
bunx convex dev --once
```

- When prompted, create a new project named `skill-issue`
- This generates `convex/_generated/` types
- Note the deployment URL

## 4. Set Up Environment

Create `.env.local` with:
```
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
```

## 5. Verify TypeScript

```bash
bun typecheck
```

Fix any errors before proceeding.

## 6. Verify Linting

```bash
bun lint
```

Fix any errors before proceeding.

## 7. Test Development Server

```bash
bun dev
```

- Visit http://localhost:3000
- Verify page loads without errors
- Check browser console for issues

## 8. Seed Initial Data (if needed)

```bash
bunx convex run skills:seedSkills
```

Or if seed function doesn't exist, create sample data manually.

## 9. Final Verification Checklist

Run and report status of each:
- [ ] `bun typecheck` passes
- [ ] `bun lint` passes
- [ ] `bun run build` succeeds
- [ ] `bun dev` runs without crashes
- [ ] localhost:3000 shows homepage
- [ ] Convex connection works (check console)

## 10. Report

Tell the user:
- What was set up successfully
- Any issues encountered
- Next steps to proceed with development

If $ARGUMENTS mentions specific setup tasks, prioritize those.
