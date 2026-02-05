/**
 * Seed script for skills data
 *
 * This script reads skills from data/skills.json and inserts them into the Convex database.
 * It handles duplicates gracefully by skipping skills that already exist (by slug).
 *
 * Usage:
 *   bun run scripts/seed-skills.ts
 *
 * Prerequisites:
 *   - Convex must be running (bun run convex dev or deployed)
 *   - CONVEX_URL environment variable must be set (or use .env.local)
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import skillsData from '../data/skills.json';
import { normalizeSkillData } from './skill-utils';

// Types for skill data
interface SkillData {
  slug: string;
  name: string;
  org: string;
  repo: string;
  description: string;
  longDescription?: string;
  commands: {
    claudeCode: string;
    codexCli?: string;
    cursor?: string;
    openCode?: string;
    geminiCli?: string;
  };
  tags: string[];
  agents: string[];
  installs: number;
  stars: number;
  velocity?: number;
  lastUpdated: string;
  addedAt: string;
  repoUrl: string;
  docsUrl?: string;
  featured?: boolean;
  verified: boolean;
}

async function seedSkills(): Promise<void> {
  const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    console.error('Error: CONVEX_URL or NEXT_PUBLIC_CONVEX_URL environment variable is required');
    console.error('Make sure your .env.local file has the Convex URL set.');
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  console.log('Starting skill seeding...');
  console.log(`Found ${skillsData.length} skills to seed\n`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const skill of skillsData as SkillData[]) {
    try {
      const normalizedSkill = normalizeSkillData(skill);
      const result = await client.mutation(api.skills.insertSkill, normalizedSkill);

      if (result.status === 'inserted') {
        console.log(`✓ Inserted: ${skill.name} (${skill.slug})`);
        inserted++;
      } else {
        console.log(`- Skipped (exists): ${skill.name} (${skill.slug})`);
        skipped++;
      }
    } catch (error) {
      console.error(`✗ Error inserting ${skill.name}:`, error);
      errors++;
    }
  }

  console.log('\n--- Seeding Complete ---');
  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Errors:   ${errors}`);
  console.log(`Total:    ${skillsData.length}`);
}

// Run the seed function
seedSkills().catch((error) => {
  console.error('Seed script failed:', error);
  process.exit(1);
});
