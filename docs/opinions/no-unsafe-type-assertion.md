---
id: no-unsafe-type-assertion
title: Permit only safe type assertion patterns
severity: bug-prevention
enforcement: both
confidence: strong
tags: [type-safety, assertions]
related: [no-type-assertions, use-type-narrowing, prefer-unknown]
lint:
  type: custom
  rule: "typescript-narrows/no-unsafe-type-assertion"
---

## Stance

Only the following type assertion forms are permitted:

| Pattern | Reason |
|---------|--------|
| `x as unknown` | Safe upcast — always valid |
| `x as unknown as T` | Explicit type boundary crossing — intent is clear |
| `x as const` | Const assertion — unrelated semantics |
| `x as never` | Exhaustiveness-check helper — `assertNever(x as never)` |

All other `as` assertions (`x as string`, `{} as Foo`, etc.) are banned.

## Why

Bare `as T` assertions silently override the compiler. A union member can be asserted away without any runtime check:

```typescript
const result: { kind: 'success' } | { kind: 'error' } = getResult();
const ok = result as { kind: 'success' }; // compiles; crashes at runtime
```

The `as unknown as T` double-cast makes the intent explicit: you are knowingly crossing a type boundary. It reads as a deliberate choice, not an accidental shortcut, and is easy to grep for in a codebase.

## Do

```typescript
// Safe upcast
const raw = value as unknown;

// Explicit type boundary (opaque/branded type construction)
const userId = (rawId as unknown) as UserId;

// Const assertion
const config = { host: 'localhost', port: 3000 } as const;

// Exhaustiveness helper
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x as never}`);
}
```

## Don't

```typescript
// Bare assertion — bypasses the compiler silently
const user = data as User;

// Object literal assertion — TypeScript skips excess-property checks
const req = {} as Request;

// Chained unsafe assertion
const typed = (value as Foo) as Bar;
```

## Exceptions

`as unknown` is always allowed and is the correct first step when a double-cast is needed. Test fixtures may use `as unknown as T` for controlled stubs.
