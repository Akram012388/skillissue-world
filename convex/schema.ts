import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  skills: defineTable({
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
  })
    .index('by_slug', ['slug'])
    .index('by_org', ['org'])
    .index('by_installs', ['installs'])
    .index('by_lastUpdated', ['lastUpdated'])
    .searchIndex('search_skills', {
      searchField: 'name',
      filterFields: ['org', 'tags'],
    }),

  events: defineTable({
    skillSlug: v.string(),
    action: v.string(),
    agent: v.optional(v.string()),
    timestamp: v.string(),
  }).index('by_skill', ['skillSlug']),
});
