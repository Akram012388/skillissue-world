---
name: next-cache-components
description: Next.js 16 Cache Components and Partial Pre-Rendering (PPR). Use when implementing caching strategies, working with 'use cache' directive, configuring cacheLife/cacheTag, or building PPR-enabled routes. Essential for Next.js 16+ performance optimization. Triggers on cache configuration, revalidation, static/dynamic content mixing.
license: MIT (Vercel Labs)
---

# Next.js 16 Cache Components

Cache Components enable Partial Pre-Rendering (PPR) - mixing static, cached, and dynamic content in a single route.

## Enabling Cache Components

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  cacheComponents: true, // Replaces experimental.ppr
};

export default config;
```

## Three Content Categories

| Type | Behavior | When Rendered |
|------|----------|---------------|
| **Static** | Synchronous code | Build time |
| **Cached** | Async with `'use cache'` | Build time + revalidation |
| **Dynamic** | Runtime data in Suspense | Request time |

## Key APIs

### 'use cache' Directive

Apply at file, component, or function level:

```tsx
// File-level caching
'use cache';

export async function getCachedData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}
```

```tsx
// Function-level caching
async function getProduct(id: string) {
  'use cache';
  return db.products.findUnique({ where: { id } });
}
```

```tsx
// Component-level caching
async function ProductCard({ id }: { id: string }) {
  'use cache';
  const product = await db.products.findUnique({ where: { id } });
  return <div>{product.name}</div>;
}
```

### cacheLife() - Cache Duration

```tsx
import { cacheLife } from 'next/cache';

async function getProducts() {
  'use cache';
  cacheLife('hours'); // Built-in profile

  return db.products.findMany();
}
```

**Built-in Profiles:**

| Profile | Stale | Revalidate | Expire |
|---------|-------|------------|--------|
| `'seconds'` | 0 | 1s | 60s |
| `'minutes'` | 5m | 1m | 1h |
| `'hours'` | 5m | 1h | 1d |
| `'days'` | 5m | 1d | 1w |
| `'weeks'` | 5m | 1w | 1mo |
| `'max'` | 5m | 1mo | indefinite |

**Custom Configuration:**

```tsx
import { cacheLife } from 'next/cache';

async function getProducts() {
  'use cache';
  cacheLife({
    stale: 60,      // Serve stale for 60s
    revalidate: 300, // Revalidate every 5m
    expire: 3600,    // Expire after 1h
  });

  return db.products.findMany();
}
```

### cacheTag() - Tagging for Invalidation

```tsx
import { cacheTag } from 'next/cache';

async function getProduct(id: string) {
  'use cache';
  cacheTag(`product-${id}`, 'products');

  return db.products.findUnique({ where: { id } });
}

async function getCategory(slug: string) {
  'use cache';
  cacheTag(`category-${slug}`, 'categories');

  return db.categories.findUnique({ where: { slug } });
}
```

### Invalidation Methods

**updateTag() - Immediate (same request):**

```tsx
import { updateTag } from 'next/cache';

async function updateProduct(id: string, data: ProductData) {
  'use server';

  await db.products.update({ where: { id }, data });
  updateTag(`product-${id}`); // Immediate invalidation
}
```

**revalidateTag() - Background (stale-while-revalidate):**

```tsx
import { revalidateTag } from 'next/cache';

async function updateProduct(id: string, data: ProductData) {
  'use server';

  await db.products.update({ where: { id }, data });
  revalidateTag(`product-${id}`); // Background revalidation
}
```

## PPR Pattern

Mix static shell with dynamic content:

```tsx
// app/product/[id]/page.tsx
import { Suspense } from 'react';

// Static shell (prerendered)
export default async function ProductPage({ params }) {
  const { id } = await params;

  return (
    <div>
      <StaticHeader />                        {/* Static */}
      <CachedProductInfo id={id} />           {/* Cached */}
      <Suspense fallback={<PriceSkeleton />}>
        <DynamicPrice id={id} />              {/* Dynamic */}
      </Suspense>
      <StaticFooter />                        {/* Static */}
    </div>
  );
}

// Cached component
async function CachedProductInfo({ id }: { id: string }) {
  'use cache';
  cacheLife('hours');
  cacheTag(`product-${id}`);

  const product = await db.products.findUnique({ where: { id } });
  return <div>{product.name}</div>;
}

// Dynamic component (not cached)
async function DynamicPrice({ id }: { id: string }) {
  // No 'use cache' - always fresh
  const price = await fetchCurrentPrice(id);
  return <span>${price}</span>;
}
```

## Cache Key Composition

Keys are automatically generated from:
1. Build ID
2. Function location hash
3. Serializable arguments
4. Closure variables

```tsx
async function getData(userId: string, options: { limit: number }) {
  'use cache';
  // Cache key includes: userId + options.limit
  return db.query({ userId, limit: options.limit });
}
```

## Constraints

### Runtime APIs in Cached Functions

Cannot access runtime APIs directly inside cached functions:

```tsx
// Bad - will error
async function getData() {
  'use cache';
  const cookieStore = await cookies(); // Error!
  return db.query({ userId: cookieStore.get('userId') });
}

// Good - pass as argument
async function getData(userId: string) {
  'use cache';
  return db.query({ userId });
}

// Usage
const cookieStore = await cookies();
const userId = cookieStore.get('userId');
const data = await getData(userId);
```

### Private Cache for Runtime Data

Use `'use cache: private'` for user-specific cached data:

```tsx
async function getUserData() {
  'use cache: private';
  // Can access cookies() here for compliance scenarios
  const cookieStore = await cookies();
  return db.users.findUnique({
    where: { id: cookieStore.get('userId') }
  });
}
```

## Migration from Previous Patterns

| Old Pattern | New Pattern |
|-------------|-------------|
| `experimental.ppr` | `cacheComponents: true` |
| `dynamic = 'force-static'` | `'use cache'` |
| `unstable_cache()` | `'use cache'` + `cacheLife()` |
| `revalidate` in fetch | `cacheLife()` |
| `tags` in fetch | `cacheTag()` |

```tsx
// Old (Next.js 14)
export const dynamic = 'force-static';
export const revalidate = 3600;

async function getData() {
  return fetch(url, { next: { tags: ['data'] } });
}

// New (Next.js 16)
async function getData() {
  'use cache';
  cacheLife('hours');
  cacheTag('data');

  return fetch(url);
}
```

## Limitations

- Edge runtime: Limited support
- Static export: Not compatible with PPR
- Non-deterministic operations: Cannot be cached

## Full Reference

For advanced patterns and edge cases, see `references/caching.md`.
