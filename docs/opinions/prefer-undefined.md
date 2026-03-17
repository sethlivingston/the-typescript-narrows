---
id: prefer-undefined
title: "Prefer undefined over null"
severity: style
enforcement: skill-only
confidence: moderate
tags: [null-handling, style, consistency]
related: [prefer-nullish-coalescing, strict-null-checks]
---

## Stance

Use `undefined` over `null`. Match JavaScript's natural defaults.

## Why

JavaScript uses `undefined` for missing parameters, void returns, optional properties, and uninitialized variables. Using `null` introduces a second "nothing" value that must be checked separately. Picking one reduces the number of states to handle.

## Do

```typescript
function find(id: string): User | undefined {
  return users.get(id);
}
```

## Don't

```typescript
function find(id: string): User | null {
  return users.get(id) ?? null;
}
```

## Exceptions

When interfacing with APIs that use `null` explicitly (JSON parse results, DOM APIs like `document.getElementById`).
