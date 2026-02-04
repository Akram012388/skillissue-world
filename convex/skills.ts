import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db.query('skills').take(args.limit ?? 100);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) {
      return ctx.db.query('skills').withIndex('by_installs').order('desc').take(20);
    }
    return ctx.db
      .query('skills')
      .withSearchIndex('search_skills', (q) => q.search('name', args.query))
      .take(50);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query('skills')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();
  },
});

export const hitPicks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db
      .query('skills')
      .withIndex('by_installs')
      .order('desc')
      .take(args.limit ?? 10);
  },
});

export const latestDrops = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db
      .query('skills')
      .withIndex('by_lastUpdated')
      .order('desc')
      .take(args.limit ?? 10);
  },
});

export const trackEvent = mutation({
  args: {
    skillSlug: v.string(),
    action: v.string(),
    agent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('events', {
      ...args,
      timestamp: new Date().toISOString(),
    });
  },
});

// Mutation to insert a single skill (used for seeding)
export const insertSkill = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    org: v.string(),
    repo: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    commands: v.object({
      claudeCode: v.string(),
      codexCli: v.optional(v.string()),
      cursor: v.optional(v.string()),
      openCode: v.optional(v.string()),
      geminiCli: v.optional(v.string()),
    }),
    tags: v.array(v.string()),
    agents: v.array(v.string()),
    installs: v.number(),
    stars: v.number(),
    velocity: v.optional(v.number()),
    lastUpdated: v.string(),
    addedAt: v.string(),
    repoUrl: v.string(),
    docsUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    verified: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if skill with this slug already exists
    const existing = await ctx.db
      .query('skills')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();

    if (existing) {
      // Skip if already exists
      return { status: 'skipped', slug: args.slug };
    }

    // Insert the new skill
    await ctx.db.insert('skills', args);
    return { status: 'inserted', slug: args.slug };
  },
});

// Mutation to clear all skills (use with caution, for reseeding)
export const clearAllSkills = mutation({
  args: {},
  handler: async (ctx) => {
    const skills = await ctx.db.query('skills').collect();
    for (const skill of skills) {
      await ctx.db.delete(skill._id);
    }
    return { deleted: skills.length };
  },
});
