# skillissue.world

**The No-BS Encyclopedia for Official Agent Skills**

Search. Copy. Go. That's it.

---

## The Problem

You're mid-flow. Terminal open. Claude Code humming. You need that one skill — the official Vercel React patterns thing.

So you go to skills.sh.

Seventeen community submissions later, you're still looking. Half of them are some dude's "awesome prompt hacks" from 2024. The other half require reading a README longer than your codebase.

**We fixed that.**

---

## What This Is

A curated directory of **officially maintained** agent skills. Only skills from real orgs — Vercel, Anthropic, OpenAI, Supabase, GitHub. No randos. No "blessed by my friend at Stripe." If it's not on the org's official GitHub, it doesn't exist here.

```
skillissue.world?q=react
```

One search. One click. Command copied. Back to work.

---

## Speed > Choice > Completeness

This is the magna carta. Every decision filters through this hierarchy.

You have **3 seconds** between terminal tabs. We respect that.

---

## Keyboard Shortcuts

Because your hands are already on the keyboard.

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `c` | Copy install command |
| `g` | Go to GitHub repo |
| `↑↓` | Navigate results |
| `Esc` | Clear |

ThePrimeagen would be proud.

---

## Default: Claude Code

All commands default to Claude Code format. It's the Big Dog. Other agents are one toggle away — we're not fighting reality for theoretical neutrality.

```bash
# What you see by default
claude mcp add vercel-labs/react-best-practices

# Toggle to see others
codex skills install vercel-labs/react-best-practices
cursor skills add vercel-labs/react-best-practices
```

---

## The Name

Yes, it's a gaming meme. Yes, we're self-aware.

Life doesn't have to be serious all the time. We're building useful software AND having fun. Cope.

---

## Tech Stack

Built like pros, not amateurs.

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 + Turbopack |
| Database | Convex |
| Styling | Tailwind CSS v4 |
| Quality | Biome (not ESLint+Prettier) |
| Testing | Playwright + Vitest |
| Package Manager | Bun |
| Hosting | Vercel |

Everything optimized for speed. Even our linter is 10x faster.

---

## Local Development

```bash
# Clone it
git clone https://github.com/CodeAkram/skillissue-world.git
cd skillissue-world

# Install (3 seconds with Bun)
bun install

# Run it
bun dev

# That's it. You're up.
```

---

## Project Structure

```
├── src/
│   ├── app/           # Next.js pages
│   ├── components/    # React components
│   └── hooks/         # Custom hooks
├── convex/            # Database schema + functions
├── e2e/               # Playwright tests
└── docs/              # The real documentation
```

---

## Documentation

The `docs/` folder has the good stuff:

- **VISION.md** — Why this exists
- **PRD.md** — Product requirements
- **ADR.md** — Architecture decisions (15 of them)
- **TECH_STACK.md** — Full technical breakdown
- **RULES.md** — Non-negotiable principles
- **SPECS.md** — Technical specifications

---

## What We Don't Have

- User accounts
- Comments
- Likes
- Community submissions
- Ads
- Paywalls
- Social features
- Bloat

You came to copy an install command, not to engage with content.

---

## Contributing

**Code contributions**: PRs welcome for bugs, performance, accessibility.

**Skill suggestions**: Open an issue with the org name and repo URL. Must be officially maintained — no personal repos.

**Curation decisions**: Final. One owner, one vision, no committees.

---

## FAQ

**Why isn't [skill] listed?**
Either it's not from an official org namespace, or we haven't indexed it yet.

**Can I submit my skill?**
Only if it's under your organization's official GitHub. Personal repos need not apply.

**Why default to Claude Code?**
Because pretending all agents are equal helps no one. Claude Code is dominant. Deal with it.

**Is this affiliated with Vercel/Anthropic/OpenAI?**
No. Independent project. We just index their public skills.

---

## License

MIT. Do whatever you want with it.

---

## Author

**Shaikh Akram Ahmed**
[@CodeAkram](https://x.com/CodeAkram)

Building tools for developers who value their time.

---

<p align="center">
  <br>
  <i>If you can't find the skill you need in under 10 seconds, that's on us.</i>
  <br>
  <i>If you can find it but still can't code, well...</i>
  <br>
  <br>
  <b>skill issue.</b>
</p>
