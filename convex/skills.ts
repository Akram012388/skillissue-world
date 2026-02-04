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
