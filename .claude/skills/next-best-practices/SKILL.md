---
name: next-best-practices
description: Next.js development standards and App Router patterns. Use when writing or reviewing Next.js code, implementing routes, data fetching, server components, or handling Next.js-specific features. Covers file conventions, RSC boundaries, async APIs, directives, metadata, error handling, and debugging. Essential for Next.js 14-16+ development.
license: MIT (Vercel Labs)
---

# Next.js Best Practices

Comprehensive guide for Next.js development standards. Apply these rules when writing or reviewing Next.js code.

## Core Topics

| Topic | Key Points |
|-------|------------|
| File Conventions | Route structure, special files |
| RSC Boundaries | Server vs Client components |
| Async APIs | Next.js 15+ breaking changes |
| Directives | 'use client', 'use server', 'use cache' |
| Data Fetching | fetch, server actions, caching |
| Metadata | SEO, OG images |
| Error Handling | error.tsx, not-found.tsx |

## File Conventions

### Route Structure (App Router)

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home route /
├── loading.tsx         # Loading UI
├── error.tsx           # Error boundary
├── not-found.tsx       # 404 page
├── dashboard/
│   ├── layout.tsx      # Nested layout
│   ├── page.tsx        # /dashboard
│   └── [id]/
│       └── page.tsx    # /dashboard/:id
└── api/
    └── route.ts        # API route
```

### Special Files

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI, preserved on navigation |
| `page.tsx` | Unique route UI |
| `loading.tsx` | Suspense fallback |
| `error.tsx` | Error boundary (client component) |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint |
| `template.tsx` | Re-renders on navigation |

## RSC Boundaries

### Server Components (Default)

```tsx
// No directive needed - Server Component by default
async function Page() {
  const data = await fetchData(); // Direct async
  return <div>{data.title}</div>;
}
```

**Can:**
- Fetch data directly
- Access backend resources
- Keep sensitive data server-side
- Import server-only modules

**Cannot:**
- Use hooks (useState, useEffect)
- Use browser APIs
- Add event handlers

### Client Components

```tsx
'use client'; // Required at top

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Use when:**
- Need interactivity (onClick, onChange)
- Need hooks (useState, useEffect)
- Need browser APIs (localStorage, window)

### Boundary Patterns

```tsx
// Server Component
async function Page() {
  const data = await getData();
  return (
    <div>
      <h1>{data.title}</h1>          {/* Server */}
      <InteractiveWidget />           {/* Client boundary */}
    </div>
  );
}

// Push client boundary down
// Good - minimal client JS
<ServerWrapper>
  <ClientButton />
</ServerWrapper>

// Bad - entire tree becomes client
'use client';
<LargeClientWrapper>
  <Everything />
</LargeClientWrapper>
```

## Async APIs (Next.js 15+)

### Breaking Changes

In Next.js 15+, these APIs are now async:

```tsx
// Next.js 14
const params = useParams();
const searchParams = useSearchParams();
const { cookies, headers } = require('next/headers');

// Next.js 15+ (async)
const params = await props.params;
const searchParams = await props.searchParams;
const cookieStore = await cookies();
const headersList = await headers();
```

### Page Props Pattern

```tsx
// app/blog/[slug]/page.tsx
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort } = await searchParams;

  return <Article slug={slug} sortBy={sort} />;
}
```

## Directives

### 'use client'

```tsx
'use client'; // Must be first line

// Marks file as client boundary
// All imports become client components
```

### 'use server'

```tsx
// File-level
'use server';

export async function submitForm(data: FormData) {
  // Runs on server, callable from client
}

// Or inline in Server Component
async function Page() {
  async function handleSubmit(data: FormData) {
    'use server';
    await db.insert(data);
  }

  return <form action={handleSubmit}>...</form>;
}
```

### 'use cache' (Next.js 16+)

```tsx
'use cache';

export async function getCachedData() {
  return await fetch('/api/data');
}
```

## Data Fetching

### Server Components

```tsx
// Direct fetch in Server Component
async function Page() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache',     // Default: cache indefinitely
    // cache: 'no-store',     // Always fresh
    // next: { revalidate: 60 } // Revalidate every 60s
  });
  const data = await res.json();
  return <div>{data.title}</div>;
}
```

### Server Actions

```tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.posts.create({ title });
  revalidatePath('/posts');
}

// Usage in Client Component
'use client';
import { createPost } from './actions';

export function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
```

## Metadata & SEO

### Static Metadata

```tsx
// app/page.tsx
export const metadata = {
  title: 'Home',
  description: 'Welcome to my site',
  openGraph: {
    title: 'Home',
    description: 'Welcome to my site',
    images: ['/og-image.png'],
  },
};
```

### Dynamic Metadata

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
  };
}
```

## Error Handling

### error.tsx (Client Component)

```tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### not-found.tsx

```tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}

// Trigger programmatically
import { notFound } from 'next/navigation';

async function Page({ params }) {
  const post = await getPost(params.id);
  if (!post) notFound();
  return <Article post={post} />;
}
```

## Image & Font Optimization

### next/image

```tsx
import Image from 'next/image';

<Image
  src="/hero.png"
  alt="Hero image"
  width={1200}
  height={600}
  priority              // Preload above-fold images
  placeholder="blur"    // Show blur while loading
/>
```

### next/font

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function Layout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

## Full Reference

For advanced patterns (parallel routes, intercepting routes, middleware), see `references/advanced.md`.
