import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { LoadingSkeleton } from '@/components';
import { HomeContent } from '@/components/HomeContent';

export default function Home(): ReactNode {
  return (
    <div className="py-8 lg:py-12">
      {/* Hero Section */}
      <section className="mb-12 lg:mb-16">
        <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-start">
          {/* Left: ASCII Logo (hidden on mobile) */}
          <div className="hidden lg:block">
            <pre
              className="font-mono text-foreground text-[10px] leading-tight select-none"
              aria-hidden="true"
            >
              {`███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝`}
            </pre>
          </div>

          {/* Right: Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium text-foreground mb-4">
              The Open Agent Skills Ecosystem
            </h1>
            <p className="text-foreground-muted text-base mb-8 max-w-xl">
              Skills are reusable capabilities for AI agents that function as plugins enhancing
              agent functionality.
            </p>

            {/* Install Command */}
            <div className="mb-6">
              <p className="text-xs font-mono uppercase text-foreground-muted mb-2">
                Install in one command
              </p>
              <div className="inline-flex items-center gap-3 bg-background-subtle/80 rounded-md px-4 py-3 font-mono text-sm">
                <span className="text-foreground-muted">$</span>
                <code className="text-foreground">npx skills add [owner/repo]</code>
              </div>
            </div>

            {/* Agent Carousel Placeholder */}
            <div>
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
      </section>

      {/* Search + Leaderboard */}
      <Suspense fallback={<LoadingSkeleton variant="list" count={10} />}>
        <HomeContent />
      </Suspense>
    </div>
  );
}
