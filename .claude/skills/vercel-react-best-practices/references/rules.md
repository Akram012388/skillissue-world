# React Best Practices - Complete Rules Reference

## Table of Contents
1. [Eliminating Waterfalls](#1-eliminating-waterfalls-critical)
2. [Bundle Size Optimization](#2-bundle-size-optimization-critical)
3. [Server-Side Performance](#3-server-side-performance-high)
4. [Client-Side Data Fetching](#4-client-side-data-fetching-medium-high)
5. [Re-render Optimization](#5-re-render-optimization-medium)
6. [Rendering Performance](#6-rendering-performance-medium)
7. [JavaScript Performance](#7-javascript-performance-low-medium)
8. [Advanced Patterns](#8-advanced-patterns-low)

---

## 1. Eliminating Waterfalls (CRITICAL)

Waterfalls multiply network latency - the #1 performance killer.

### async-parallel
Use Promise.all() for independent operations:
```typescript
// 2-10x improvement
const [user, posts, comments] = await Promise.all([
  getUser(id),
  getPosts(id),
  getComments(id)
]);
```

### async-defer-await
Move await into branches where actually used:
```typescript
const dataPromise = fetchData();
if (cachedResult) return cachedResult;
return await dataPromise;
```

### async-dependencies
Use better-all for partial dependencies:
```typescript
import { all } from 'better-all';
const { user, posts } = await all({
  user: getUser(id),
  posts: (deps) => getPosts(deps.user.id) // waits for user
});
```

### async-suspense-boundaries
Stream content with Suspense:
```typescript
<Suspense fallback={<Skeleton />}>
  <AsyncDataComponent />
</Suspense>
```

---

## 2. Bundle Size Optimization (CRITICAL)

### bundle-barrel-imports
Import directly, avoid barrel files (can save 200-800ms):
```typescript
// Bad
import { Check } from 'lucide-react';

// Good
import Check from 'lucide-react/dist/esm/icons/check';
```

Affected: lucide-react, @mui/material, @radix-ui/*, lodash, date-fns

Alternative: Use `optimizePackageImports` in next.config.js

### bundle-dynamic-imports
Use next/dynamic for heavy components:
```typescript
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <EditorSkeleton />
});
```

### bundle-defer-third-party
Load analytics/logging after hydration:
```typescript
const Analytics = dynamic(() => import('./Analytics'), { ssr: false });
```

### bundle-conditional
Load modules only when feature activated:
```typescript
const loadFeature = async () => {
  const { Feature } = await import('./Feature');
  return Feature;
};
```

### bundle-preload
Preload on hover for perceived speed:
```typescript
<Link
  href="/dashboard"
  onMouseEnter={() => import('./Dashboard')}
>
```

---

## 3. Server-Side Performance (HIGH)

### server-auth-actions
Server Actions are public endpoints - always authenticate inside:
```typescript
'use server';
export async function updateProfile(data: FormData) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
}
```

### server-cache-react
Use React.cache() for per-request deduplication:
```typescript
import { cache } from 'react';
export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } });
});
```

### server-cache-lru
Use LRU cache for cross-request caching:
```typescript
import { LRUCache } from 'lru-cache';
const cache = new LRUCache({ max: 100, ttl: 1000 * 60 });
```

### server-serialization
Minimize data passed to client components:
```typescript
// Bad
<ClientComp user={user} />

// Good - only needed fields
<ClientComp name={user.name} />
```

### server-dedup-props
Avoid duplicate serialization - perform transforms client-side:
```typescript
// Bad - creates new reference
<Client data={user.posts.map(transform)} />

// Good - transform on client
<Client posts={user.posts} />
```

### server-parallel-fetching
Restructure components to parallelize:
```typescript
// Parallel fetching components
<Suspense><UserData /></Suspense>
<Suspense><PostsData /></Suspense>
```

### server-after-nonblocking
Use after() for non-blocking operations:
```typescript
import { after } from 'next/server';
after(() => {
  analytics.track('page_view');
});
```

---

## 4. Client-Side Data Fetching (MEDIUM-HIGH)

### client-swr-dedup
Use SWR for automatic request deduplication:
```typescript
const { data } = useSWR('/api/user', fetcher);
```

### client-event-listeners
Deduplicate global event listeners:
```typescript
// Module-level listener map
const listeners = new Map();
```

### client-passive-event-listeners
Use passive listeners for scroll:
```typescript
element.addEventListener('wheel', handler, { passive: true });
```

### client-localstorage-schema
Version and minimize localStorage:
```typescript
const key = 'app_v2_user';
try {
  localStorage.setItem(key, JSON.stringify({ id, name }));
} catch (e) { /* quota or private mode */ }
```

---

## 5. Re-render Optimization (MEDIUM)

### rerender-functional-setstate
Use functional setState for stable callbacks:
```typescript
const addItem = useCallback((item) => {
  setItems(curr => [...curr, item]);
}, []); // No dependencies needed
```

### rerender-derived-state-no-effect
Derive state during render, not effects:
```typescript
// Bad
useEffect(() => setFull(`${first} ${last}`), [first, last]);

// Good
const full = `${first} ${last}`;
```

### rerender-memo
Extract expensive work into memoized components:
```typescript
const ExpensiveList = memo(({ items }) => (
  items.map(item => <ExpensiveItem key={item.id} {...item} />)
));
```

### rerender-memo-with-default-value
Hoist default non-primitive props:
```typescript
const DEFAULT_OPTIONS = { sort: 'asc' };
const Component = memo(({ options = DEFAULT_OPTIONS }) => {});
```

### rerender-defer-reads
Don't subscribe to state only used in callbacks:
```typescript
// Bad - re-renders on every searchParams change
const params = useSearchParams();
const onClick = () => track(params.get('id'));

// Good - read on demand
const onClick = () => {
  const params = new URLSearchParams(window.location.search);
  track(params.get('id'));
};
```

### rerender-dependencies
Use primitive dependencies in effects:
```typescript
// Bad
useEffect(() => {}, [user]);

// Good
useEffect(() => {}, [user.id]);
```

### rerender-derived-state
Subscribe to derived booleans, not raw values:
```typescript
const isLoggedIn = useStore(state => !!state.user);
```

### rerender-lazy-state-init
Pass function to useState for expensive values:
```typescript
const [data] = useState(() => expensiveComputation());
```

### rerender-simple-expression-in-memo
Don't memo simple expressions:
```typescript
// Bad
const isValid = useMemo(() => a && b, [a, b]);

// Good
const isValid = a && b;
```

### rerender-transitions
Use startTransition for non-urgent updates:
```typescript
startTransition(() => {
  setSearchResults(results);
});
```

### rerender-use-ref-transient-values
Use refs for frequent non-rendering values:
```typescript
const mousePos = useRef({ x: 0, y: 0 });
```

---

## 6. Rendering Performance (MEDIUM)

### rendering-animate-svg-wrapper
Animate div wrapper, not SVG:
```typescript
<div className="animate-spin">
  <SVGIcon />
</div>
```

### rendering-content-visibility
Use content-visibility for long lists (10x faster):
```css
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 50px;
}
```

### rendering-hoist-jsx
Extract static JSX outside components:
```typescript
const StaticHeader = <header>Title</header>;
const Component = () => <>{StaticHeader}<Content /></>;
```

### rendering-hydration-no-flicker
Use inline script for client-only data:
```typescript
<script dangerouslySetInnerHTML={{
  __html: `document.documentElement.dataset.theme =
    localStorage.getItem('theme') || 'light'`
}} />
```

### rendering-conditional-render
Use ternary, not && for conditionals:
```typescript
// Bad - renders "0" if count is 0
{count && <Items />}

// Good
{count > 0 ? <Items /> : null}
```

### rendering-activity
Use Activity for show/hide (preserves state):
```typescript
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <ExpensiveComponent />
</Activity>
```

---

## 7. JavaScript Performance (LOW-MEDIUM)

### js-set-map-lookups
Use Set/Map for O(1) lookups:
```typescript
const idSet = new Set(items.map(i => i.id));
if (idSet.has(targetId)) { }
```

### js-index-maps
Build Map for repeated lookups:
```typescript
const userMap = new Map(users.map(u => [u.id, u]));
const user = userMap.get(id);
```

### js-tosorted-immutable
Use toSorted() for immutability:
```typescript
const sorted = items.toSorted((a, b) => a.name.localeCompare(b.name));
```

### js-combine-iterations
Combine filter/map into single loop:
```typescript
const result = [];
for (const item of items) {
  if (item.active) result.push(transform(item));
}
```

### js-cache-property-access
Cache object properties in loops:
```typescript
const len = items.length;
for (let i = 0; i < len; i++) { }
```

### js-early-exit
Return early from functions:
```typescript
if (!data) return null;
if (cached) return cached;
// main logic
```

### js-length-check-first
Check array length before expensive operations:
```typescript
if (a.length !== b.length) return false;
// then deep compare
```

---

## 8. Advanced Patterns (LOW)

### advanced-init-once
Initialize app once per load:
```typescript
let initialized = false;
export function initApp() {
  if (initialized) return;
  initialized = true;
  // setup
}
```

### advanced-event-handler-refs
Store handlers in refs for stable effects:
```typescript
const handlerRef = useRef(handler);
handlerRef.current = handler;

useEffect(() => {
  element.addEventListener('click', handlerRef.current);
}, []); // No re-subscribe
```

### advanced-use-latest
useLatest for stable callback refs:
```typescript
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
```
