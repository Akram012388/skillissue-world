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

export function normalizeSkillData(skill: SkillData): SkillData {
  const repo = skill.repo.split('/').filter(Boolean).pop() ?? skill.repo;
  const repoUrl = `https://github.com/${skill.org}/${repo}`;

  return {
    ...skill,
    repo,
    repoUrl,
  };
}

export type { SkillData };
