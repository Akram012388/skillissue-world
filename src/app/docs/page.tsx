import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { InstallCommand } from '@/components';

export const metadata: Metadata = {
  title: 'Documentation - SkillIssue.world',
  description: 'Learn how to discover, install, and use agent skills.',
};

export default function DocsPage(): ReactNode {
  return (
    <div className="py-8 lg:py-12 max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Documentation</h1>
        <p className="text-xl text-foreground-muted">
          Learn how to discover, install, and use skills.
        </p>
      </header>

      {/* Content */}
      <div className="space-y-12">
        {/* What are skills? */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">What are skills?</h2>
          <p className="text-foreground-muted leading-relaxed">
            Skills are reusable capabilities for AI agents that function as plugins enhancing agent
            functionality. They allow agents like Claude Code, Cursor, Codex CLI, and others to
            perform specialized tasks with expert-level knowledge.
          </p>
          <p className="text-foreground-muted leading-relaxed mt-4">
            Each skill contains instructions, best practices, and domain-specific knowledge that
            gets injected into your agent&apos;s context when you install it.
          </p>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
          <p className="text-foreground-muted leading-relaxed mb-4">
            Installing a skill is simple. Use the skills CLI to add any skill to your agent:
          </p>
          <InstallCommand command="npx skills add [owner/repo]" />
          <p className="text-foreground-muted leading-relaxed mt-4">
            For example, to install the Vercel React best practices skill:
          </p>
          <InstallCommand
            command="npx skills add vercel-labs/agent-skills/vercel-react-best-practices"
            className="mt-2"
          />
        </section>

        {/* How Skills are Ranked */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">How Skills are Ranked</h2>
          <p className="text-foreground-muted leading-relaxed">
            The leaderboard uses anonymous telemetry data to rank skills by popularity. The ranking
            takes into account:
          </p>
          <ul className="mt-4 space-y-2 text-foreground-muted">
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>
                <strong className="text-foreground">All Time</strong> — Total install count across
                all agents
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>
                <strong className="text-foreground">Trending</strong> — Skills gaining popularity
                over the last 24 hours
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>
                <strong className="text-foreground">Hot</strong> — A combination of recent activity
                and total installs
              </span>
            </li>
          </ul>
        </section>

        {/* Browse Skills */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Browse Skills</h2>
          <p className="text-foreground-muted leading-relaxed">
            Discover skills on the{' '}
            <a href="/" className="text-foreground underline hover:no-underline">
              homepage
            </a>
            . Use the search bar to find skills by name, or browse the leaderboard to see
            what&apos;s popular.
          </p>
          <p className="text-foreground-muted leading-relaxed mt-4">
            Press <kbd className="px-2 py-1 bg-background-subtle rounded text-sm font-mono">/</kbd>{' '}
            anywhere to focus the search bar. Use{' '}
            <kbd className="px-2 py-1 bg-background-subtle rounded text-sm font-mono">↑</kbd>{' '}
            <kbd className="px-2 py-1 bg-background-subtle rounded text-sm font-mono">↓</kbd> to
            navigate results,{' '}
            <kbd className="px-2 py-1 bg-background-subtle rounded text-sm font-mono">c</kbd> to
            copy the install command, and{' '}
            <kbd className="px-2 py-1 bg-background-subtle rounded text-sm font-mono">g</kbd> to
            open the GitHub repository.
          </p>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Security</h2>
          <p className="text-foreground-muted leading-relaxed">
            We perform routine security audits on all skills listed in the directory. Only skills
            from verified organizations (like vercel-labs, anthropics, openai, supabase) are
            included.
          </p>
          <p className="text-foreground-muted leading-relaxed mt-4">
            Skills are static markdown files and configuration — they cannot execute arbitrary code
            or access your system. They simply provide context and instructions to your AI agent.
          </p>
        </section>

        {/* Supported Agents */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Supported Agents</h2>
          <p className="text-foreground-muted leading-relaxed">Skills work with many AI agents:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              'Claude Code',
              'Cursor',
              'Codex CLI',
              'Gemini CLI',
              'OpenCode',
              'Aider',
              'Windsurf',
              'Continue',
            ].map((agent) => (
              <span
                key={agent}
                className="px-3 py-1.5 bg-background-subtle rounded-full text-sm text-foreground"
              >
                {agent}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
