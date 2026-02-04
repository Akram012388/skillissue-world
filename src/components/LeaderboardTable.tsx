'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { formatCount } from '@/lib/constants';
import type { Skill } from '@/types';

interface LeaderboardRowProps {
  rank: number;
  skill: Skill;
  isSelected?: boolean;
  onClick: () => void;
}

/**
 * LeaderboardRow component - individual row in the leaderboard table
 */
function LeaderboardRow({
  rank,
  skill,
  isSelected = false,
  onClick,
}: LeaderboardRowProps): ReactNode {
  return (
    <tr
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      aria-selected={isSelected}
      className={`group cursor-pointer transition-colors ${
        isSelected ? 'bg-background-subtle' : 'hover:bg-background-subtle'
      }`}
    >
      <td className="py-3 pr-4 text-foreground-muted w-12 text-right tabular-nums">{rank}</td>
      <td className="py-3 font-medium text-foreground group-hover:text-foreground transition-colors">
        {skill.name}
      </td>
      <td className="py-3 text-foreground-muted">{skill.org}</td>
      <td className="py-3 text-right tabular-nums text-foreground-muted">
        {formatCount(skill.installs)}
      </td>
    </tr>
  );
}

interface LeaderboardTableProps {
  skills: Skill[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

/**
 * LeaderboardTable component matching skills.sh design
 *
 * Features:
 * - Table columns: Rank, Skill Name, Org, Installs
 * - Clickable rows navigate to skill detail
 * - Hover state with bg-muted
 * - Install counts formatted with K/M suffix
 * - Uses tabular-nums for numeric alignment
 */
export function LeaderboardTable({
  skills,
  selectedIndex = -1,
  onSelect,
}: LeaderboardTableProps): ReactNode {
  const router = useRouter();

  const handleRowClick = (skill: Skill, index: number) => {
    onSelect?.(index);
    router.push(`/skill/${skill.slug}`);
  };

  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground-muted">No skills found</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead className="sr-only">
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Skill Name</th>
            <th scope="col">Organization</th>
            <th scope="col">Installs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {skills.map((skill, index) => (
            <LeaderboardRow
              key={skill._id}
              rank={index + 1}
              skill={skill}
              isSelected={index === selectedIndex}
              onClick={() => handleRowClick(skill, index)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
