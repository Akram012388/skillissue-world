---
name: vercel-composition-patterns
description: React composition patterns that scale. Use when refactoring components with boolean prop proliferation, building flexible component libraries, or designing reusable APIs. Triggers on tasks involving compound components, render props, context providers, component architecture, or React 19 API changes. Helps avoid prop drilling and boolean flag accumulation.
license: MIT (Vercel Labs)
---

# React Composition Patterns

Composition patterns for building flexible, maintainable React components. Avoid boolean prop proliferation by using compound components, lifting state, and composing internals.

## When to Apply

- Refactoring components with many boolean props
- Building reusable component libraries
- Designing flexible component APIs
- Reviewing component architecture
- Working with compound components or context providers

## Rule Categories

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Component Architecture | HIGH |
| 2 | State Management | MEDIUM |
| 3 | Implementation Patterns | MEDIUM |
| 4 | React 19 APIs | MEDIUM |

## 1. Component Architecture (HIGH)

### Avoid Boolean Props

Don't add boolean props to customize behavior - use composition:

```tsx
// Bad - boolean prop accumulation
<Card
  showHeader={true}
  showFooter={false}
  isCompact={true}
  hasBorder={true}
  isClickable={true}
/>

// Good - composition
<Card compact bordered>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

### Compound Components

Structure complex components with shared context:

```tsx
const CardContext = createContext<CardContextValue | null>(null);

function Card({ children, ...props }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <CardContext.Provider value={{ expanded, setExpanded }}>
      <div {...props}>{children}</div>
    </CardContext.Provider>
  );
}

Card.Header = function Header({ children }) {
  const { expanded, setExpanded } = useContext(CardContext);
  return (
    <div onClick={() => setExpanded(!expanded)}>
      {children}
    </div>
  );
};

Card.Body = function Body({ children }) {
  const { expanded } = useContext(CardContext);
  return expanded ? <div>{children}</div> : null;
};
```

## 2. State Management (MEDIUM)

### Decouple Implementation

Provider is the only place that knows how state is managed:

```tsx
// Bad - leaking implementation
<MyContext.Provider value={{ state, setState, dispatch }}>

// Good - clean interface
<MyContext.Provider value={{ value, onChange, reset }}>
```

### Context Interface Pattern

Define generic interface with state, actions, meta:

```tsx
interface ContextValue<T> {
  // State
  value: T;

  // Actions
  onChange: (value: T) => void;
  reset: () => void;

  // Meta
  isDirty: boolean;
  isValid: boolean;
}
```

### Lift State for Sibling Access

Move state into provider components:

```tsx
// Bad - prop drilling
function Parent() {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <Sidebar selected={selected} onSelect={setSelected} />
      <Content selected={selected} />
    </>
  );
}

// Good - context provider
function Parent() {
  return (
    <SelectionProvider>
      <Sidebar />
      <Content />
    </SelectionProvider>
  );
}
```

## 3. Implementation Patterns (MEDIUM)

### Explicit Variants Over Boolean Modes

Create explicit variant components:

```tsx
// Bad - boolean mode
<Button primary />
<Button secondary />
<Button danger />

// Good - explicit variants
<Button variant="primary" />
<Button variant="secondary" />
<Button variant="danger" />

// Or separate components
<PrimaryButton />
<SecondaryButton />
<DangerButton />
```

### Children Over Render Props

Use children for composition:

```tsx
// Bad - render props
<Modal
  renderHeader={() => <h2>Title</h2>}
  renderBody={() => <p>Content</p>}
  renderFooter={() => <button>Close</button>}
/>

// Good - children composition
<Modal>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>
    <button>Close</button>
  </Modal.Footer>
</Modal>
```

## 4. React 19 APIs (MEDIUM)

> **React 19+ only** - Skip if using React 18 or earlier.

### No forwardRef

React 19 passes ref as a regular prop:

```tsx
// React 18 - forwardRef required
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input ref={ref} {...props} />
));

// React 19 - ref is a regular prop
function Input({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}
```

### use() Instead of useContext()

```tsx
// React 18
const value = useContext(MyContext);

// React 19
const value = use(MyContext);
```

### use() for Promises

```tsx
// React 19 - use() with promises
function UserProfile({ userPromise }) {
  const user = use(userPromise); // Suspends until resolved
  return <div>{user.name}</div>;
}
```

## Anti-Patterns to Avoid

### Prop Explosion

```tsx
// Anti-pattern - too many boolean props
<DataTable
  showPagination
  showSearch
  showFilters
  showExport
  showColumnToggle
  isStriped
  isCompact
  isBordered
  isHoverable
  isSortable
  isSelectable
/>

// Better - composition + sensible defaults
<DataTable>
  <DataTable.Toolbar>
    <DataTable.Search />
    <DataTable.Filters />
    <DataTable.Export />
  </DataTable.Toolbar>
  <DataTable.Body striped hoverable />
  <DataTable.Pagination />
</DataTable>
```

### Deeply Nested Props

```tsx
// Anti-pattern
<Component
  header={{ title: 'x', subtitle: 'y', icon: 'z' }}
  footer={{ left: 'a', right: 'b' }}
/>

// Better
<Component>
  <Component.Header title="x" subtitle="y" icon="z" />
  <Component.Footer>
    <span>a</span>
    <span>b</span>
  </Component.Footer>
</Component>
```

## Full Reference

For detailed examples and edge cases, see `references/patterns.md`.
