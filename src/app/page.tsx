import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { InstallCommand, LoadingSkeleton } from '@/components';
import { HomeContent } from '@/components/HomeContent';

export default function Home(): ReactNode {
  return (
    <div className="py-8 lg:py-12">
      {/* Hero Section */}
      <section className="mb-12 lg:mb-16">
        <div className="hero-shell relative overflow-hidden rounded-2xl border border-border/60 px-6 py-10 sm:px-10 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
            {/* Left: Wordmark + Copy */}
            <div className="text-center lg:text-left">
              <h1
                className="font-display hero-glow uppercase tracking-tight text-4xl sm:text-6xl lg:text-7xl font-semibold leading-none mb-4 relative inline-block animate-[hero-fade-up_0.6s_ease-out_both] motion-reduce:animate-none"
                style={{ animationDelay: '40ms' }}
              >
                <span
                  className="absolute left-0 top-0 -translate-x-1 -translate-y-1 text-sky-400/70"
                  aria-hidden="true"
                >
                  SKILL ISSUE
                </span>
                <span
                  className="absolute left-0 top-0 translate-x-1 translate-y-1 text-blue-500/60"
                  aria-hidden="true"
                >
                  SKILL ISSUE
                </span>
                <span className="relative text-foreground">Skill Issue</span>
              </h1>

              <p
                className="text-lg sm:text-xl text-foreground mb-3 animate-[hero-fade-up_0.6s_ease-out_both] motion-reduce:animate-none"
                style={{ animationDelay: '120ms' }}
              >
                The open agent skills ecosystem.
              </p>
              <p
                className="text-foreground-muted text-base max-w-xl mx-auto lg:mx-0 animate-[hero-fade-up_0.6s_ease-out_both] motion-reduce:animate-none"
                style={{ animationDelay: '180ms' }}
              >
                Skills are reusable capabilities for AI agents that function as plugins enhancing
                agent functionality.
              </p>
            </div>

            {/* Right: Actions */}
            <div className="text-center lg:text-left">
              {/* Install Command */}
              <div
                className="mb-6 animate-[hero-fade-up_0.6s_ease-out_both] motion-reduce:animate-none"
                style={{ animationDelay: '240ms' }}
              >
                <p className="text-xs font-mono uppercase text-foreground-muted mb-2">
                  Install in one command
                </p>
                <InstallCommand command="npx skills add [owner/repo]" className="inline-flex" />
              </div>

              <div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8 animate-[hero-fade-up_0.6s_ease-out_both] motion-reduce:animate-none"
                style={{ animationDelay: '300ms' }}
              >
                <a
                  href="#skills"
                  className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
                >
                  Browse skills
                </a>
                <a
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background-subtle"
                >
                  Docs
                </a>
              </div>

              {/* Agent Carousel Placeholder */}
              <div
                className="animate-[hero-fade-up_0.6s_ease-out_both] motion-reduce:animate-none"
                style={{ animationDelay: '360ms' }}
              >
                <p className="text-xs font-mono uppercase text-foreground-muted mb-2">
                  Available for these agents
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {['claude-code', 'cursor', 'codex', 'gemini-cli', 'opencode', 'aider'].map(
                    (agent) => (
                      <span
                        key={agent}
                        className="px-3 py-1.5 bg-background-subtle rounded-full text-xs text-foreground-muted"
                      >
                        {agent}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Leaderboard */}
      <div id="skills">
        <Suspense fallback={<LoadingSkeleton variant="list" count={10} />}>
          <HomeContent />
        </Suspense>
      </div>
    </div>
  );
}
