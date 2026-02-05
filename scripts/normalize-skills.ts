import { writeFileSync } from 'node:fs';
import skillsData from '../data/skills.json';
import { normalizeSkillData, type SkillData } from './skill-utils';

const normalized = (skillsData as SkillData[]).map((skill) => normalizeSkillData(skill));

writeFileSync('data/skills.json', `${JSON.stringify(normalized, null, 2)}\n`, 'utf-8');
console.log(`Normalized ${normalized.length} skills.`);
