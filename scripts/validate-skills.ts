import skillsData from '../data/skills.json';
import { normalizeSkillData, type SkillData } from './skill-utils';

const errors: string[] = [];

for (const skill of skillsData as SkillData[]) {
  if (skill.repo.includes('/')) {
    errors.push(`[${skill.slug}] repo contains "/": ${skill.repo}`);
  }

  const normalized = normalizeSkillData(skill);
  if (skill.repoUrl !== normalized.repoUrl) {
    errors.push(
      `[${skill.slug}] repoUrl mismatch: expected ${normalized.repoUrl}, found ${skill.repoUrl}`,
    );
  }
}

if (errors.length > 0) {
  console.error('Skill data validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Skill data validation passed.');
