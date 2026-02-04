import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { Header, KeyboardHandler } from '@/components';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SkillIssue.world - Official Agent Skills Directory',
  description:
    'The open agent skills ecosystem. Search, copy install command, go. Curated directory of skills from Vercel, Anthropic, OpenAI, and more.',
  keywords: ['agent skills', 'claude code', 'cursor', 'codex cli', 'AI agents', 'developer tools'],
  authors: [{ name: 'SkillIssue.world' }],
  openGraph: {
    title: 'SkillIssue.world - Official Agent Skills Directory',
    description: 'The open agent skills ecosystem. Search, copy, go.',
    url: 'https://skillissue.world',
    siteName: 'SkillIssue.world',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillIssue.world',
    description: 'The open agent skills ecosystem.',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <NuqsAdapter>
          <Providers>
            <KeyboardHandler>
              <Header />
              <main className="max-w-6xl mx-auto px-4">{children}</main>
            </KeyboardHandler>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
