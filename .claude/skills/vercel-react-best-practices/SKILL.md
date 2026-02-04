---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. Use when writing, reviewing, or refactoring React/Next.js code. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, re-render fixes, or performance improvements. Contains 40+ rules across 8 categories prioritized by impact.
license: MIT (Vercel Labs)
---

# Vercel React Best Practices

Performance optimization guide for React and Next.js applications. Reference these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

## Rule Categories by Priority

| Priority | Category | Impact | When to Apply |
|----------|----------|--------|---------------|
| 1 | Eliminating Waterfalls | CRITICAL | Async operations, data fetching |
| 2 | Bundle Size | CRITICAL | Imports, dynamic loading |
| 3 | Server-Side Performance | HIGH | RSC, caching, serialization |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | SWR, event listeners |
| 5 | Re-render Optimization | MEDIUM | State, effects, memoization |
| 6 | Rendering Performance | MEDIUM | DOM, animations, hydration |
| 7 | JavaScript Performance | LOW-MEDIUM | Loops, lookups, caching |
| 8 | Advanced Patterns | LOW | Refs, initialization |

## Critical Rules Quick Reference

### 1. Eliminating Waterfalls (CRITICAL)

**Use Promise.all() for independent operations:**
```typescript
// Bad - sequential (2x latency)
const user = await getUser(id);
const posts = await getPosts(id);

// Good - parallel
const [user, posts] = await Promise.all([
  getUser(id),
  getPosts(id)
]);
```

**Defer await until needed:**
```typescript
// Bad - blocks all paths
const data = await fetchData();
if (condition) return cached;
return data;

// Good - only await when used
const dataPromise = fetchData();
if (condition) return cached;
return await dataPromise;
```

**Use Suspense to stream content:**
```typescript
// Show wrapper immediately while data loads
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>
```

### 2. Bundle Size (CRITICAL)

**Import directly, avoid barrel files:**
```typescript
// Bad - loads ~1,583 modules
import { Check, X } from 'lucide-react';

// Good - direct import
import Check from 'lucide-react/dist/esm/icons/check';
```

**Use next/dynamic for heavy components:**
```typescript
const Monaco = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <Skeleton />
});
```

**Defer analytics after hydration:**
```typescript
const Analytics = dynamic(() => import('./Analytics'), { ssr: false });
```

### 3. Server-Side Performance (HIGH)

**Authenticate server actions (they're public endpoints):**
```typescript
'use server';
export async function updateUser(data: FormData) {
  const session = await auth(); // Always verify inside
  if (!session) throw new Error('Unauthorized');
  // ...
}
```

**Use React.cache() for per-request deduplication:**
```typescript
import { cache } from 'react';
export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } });
});
```

**Minimize RSC→client serialization:**
```typescript
// Bad - serializes entire object
<ClientComponent user={user} />

// Good - only pass needed fields
<ClientComponent name={user.name} avatar={user.avatar} />
```

### 4. Re-render Optimization (MEDIUM)

**Use functional setState:**
```typescript
// Bad - stale closure, recreates on items change
const addItem = useCallback((item) => {
  setItems([...items, item]);
}, [items]);

// Good - stable callback
const addItem = useCallback((item) => {
  setItems(curr => [...curr, item]);
}, []);
```

**Calculate derived state during render:**
```typescript
// Bad - extra state + effect
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);

// Good - compute during render
const fullName = `${first} ${last}`;
```

**Don't memo simple expressions:**
```typescript
// Bad - useMemo overhead exceeds computation
const isValid = useMemo(() => a && b, [a, b]);

// Good - just compute
const isValid = a && b;
```

### 5. JavaScript Performance (LOW-MEDIUM)

**Use Set/Map for O(1) lookups:**
```typescript
// Bad - O(n) on every check
if (items.includes(id)) { }

// Good - O(1) lookup
const itemSet = new Set(items);
if (itemSet.has(id)) { }
```

**Use toSorted() for immutability:**
```typescript
// Bad - mutates original
const sorted = items.sort((a, b) => a - b);

// Good - immutable
const sorted = items.toSorted((a, b) => a - b);
```

## Full Reference

For detailed explanations and all 40+ rules, see `references/rules.md`.
