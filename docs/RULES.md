# Rules

## SkillIssue.world — Non-Negotiable Principles

These rules are immutable. They define what SkillIssue.world is and isn't.

---

## The Magna Carta

```
Speed > Choice > Completeness
```

Every decision flows from this hierarchy. When in doubt, optimize for speed.

---

## Rule 1: Official Only

**A skill is included if and only if:**

✅ Hosted under an organization's **official** GitHub namespace
✅ Actively maintained by the organization
✅ Has a valid SKILL.md or equivalent documentation

**A skill is excluded if:**

❌ Hosted on a personal repo (even if "blessed" by an org)
❌ A fork of an official skill
❌ Abandoned (no commits in 12+ months with no LTS declaration)
❌ Community-created without org backing

**The Stripe Test:**
> If a Stripe engineer hosts a skill on their personal repo and says "Stripe loves this," it's still not official. If it's not at `github.com/stripe/*`, it doesn't exist to us.

---

## Rule 2: Claude Code Default

All install commands default to **Claude Code** format.

- Claude Code is the Big Dog of the coding agent era
- We don't fight UX for theoretical neutrality
- Other agents are one toggle away

**Display Order:**
1. Claude Code (always shown first)
2. Codex CLI (if supported)
3. Cursor (if supported)
4. Others alphabetically

---

## Rule 3: No Community Features

**We will never have:**

- User accounts
- Public submissions
- Comments
- Likes/upvotes
- Reviews
- Profiles
- Forums
- Discord integration

**Rationale:** Community features invite noise. We are a reference, not a platform.

---

## Rule 4: No Monetization (MVP)

**We will never have:**

- Ads
- Paywalls
- Premium tiers
- Sponsored listings
- Affiliate links
- Data selling

**Future consideration:** If monetization becomes necessary, it must not compromise the core UX. Subtle sponsorship categories only, clearly marked.

---

## Rule 5: Text Only

**We will never have:**

- Skill logos
- Screenshots
- Videos
- Embeds
- Animations (beyond micro-interactions)
- Heavy media

**Rationale:** Text loads instantly. Media doesn't.

---

## Rule 6: Keyboard First

Every core action must be achievable via keyboard:

| Action | Key |
|--------|-----|
| Focus search | `/` |
| Copy command | `c` |
| Go to repo | `g` |
| Navigate | `↑` `↓` |
| Select | `Enter` |
| Clear/close | `Esc` |

If a feature can't have a keyboard shortcut, question if we need it.

---

## Rule 7: One Owner

Curation decisions are made by **one person**: @CodeAkram.

- No committee
- No voting
- No democracy
- No "community input"

**Rationale:** Quality requires taste. Taste requires authority. Authority requires singular ownership.

---

## Rule 8: Data Integrity

Every skill entry must have:

| Field | Required | Source |
|-------|----------|--------|
| Name | ✅ | Repo name or SKILL.md |
| Org | ✅ | GitHub namespace |
| Description | ✅ | Curated from SKILL.md |
| Claude Code command | ✅ | Documented or constructed |
| Repo URL | ✅ | GitHub |
| Last updated | ✅ | GitHub API |
| Tags | ✅ | Manually assigned |
| Install count | ⚪ | skills.sh or estimated |
| Stars | ⚪ | GitHub API |

No skill ships with empty required fields.

---

## Rule 9: Instant Gratification

The user journey:

```
Land → Search → See skill → Copy command → Leave
```

Target time: **< 10 seconds**

Every additional click is a failure. Every loading spinner is a failure. Every modal is a failure.

---

## Rule 10: Open Source, Closed Curation

**Open:**
- All code
- All documentation
- Data schema
- Contribution to code welcome

**Closed:**
- Skill selection decisions
- Editorial control
- Curation criteria changes

**Rationale:** Open source builds trust. Closed curation maintains quality.

---

## Rule 11: No "Awesome List" Behavior

We are NOT:
- A link dump
- A markdown file of URLs
- A community-curated list
- A popularity contest

We ARE:
- A searchable database
- A tool with actions (copy, navigate)
- A curated reference
- A utility for developers

---

## Rule 12: Breaking Changes

These rules can only be changed by:

1. Documenting the change in ADR.md
2. Explaining the rationale
3. Updating this document
4. Announcing publicly (if significant)

No silent policy changes. No "we've always done it this way."

---

## Rule 13: The Fun Rule

The name is "Skill Issue." It's a gaming meme. It's self-aware.

We take our work seriously. We don't take ourselves seriously.

Playfulness is allowed. Humor is allowed. Personality is allowed.

What's not allowed: Being boring.

---

## Enforcement

These rules are self-enforced by @CodeAkram.

If you see a violation, you can:
1. Open a GitHub issue
2. Tweet at @CodeAkram
3. Accept that it might be intentional

No rule lawyers. No debates. No committees.

---

*"Rules are for the obedience of fools and the guidance of wise men."*
*— Douglas Bader*

*We aim to be wise. These rules guide us.*
