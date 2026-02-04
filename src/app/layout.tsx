import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { KeyboardHandler } from '@/components';
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
    'The no-BS encyclopedia for official agent skills. Search, copy, go. Curated directory of skills from Vercel, Anthropic, OpenAI, and more.',
  keywords: ['agent skills', 'claude code', 'cursor', 'codex cli', 'AI agents', 'developer tools'],
  authors: [{ name: 'SkillIssue.world' }],
  openGraph: {
    title: 'SkillIssue.world - Official Agent Skills Directory',
    description: 'Search, copy, go. The curated directory of official agent skills.',
    url: 'https://skillissue.world',
    siteName: 'SkillIssue.world',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillIssue.world',
    description: 'The no-BS encyclopedia for official agent skills.',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NuqsAdapter>
          <Providers>
            <KeyboardHandler>{children}</KeyboardHandler>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
