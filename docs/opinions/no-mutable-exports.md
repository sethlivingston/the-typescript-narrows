---
id: no-mutable-exports
title: Do not export mutable bindings
severity: maintenance
enforcement: both
confidence: strong
tags: [immutability, modules]
related: [prefer-const, named-exports-only]
lint:
  type: existing
  rule: "import/no-mutable-exports"
---

## Stance

Do not export `let` or `var` bindings. Only export `const`, `function`, and `class` declarations.

## Why

Exported mutable bindings create shared mutable state across modules. Any importer can read a stale value if another module mutates the export. This makes behavior unpredictable and hard to debug.

## Do

```typescript
export const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} as const;
```

## Don't

```typescript
export let currentUser: User | null = null;

export function setCurrentUser(user: User): void {
  currentUser = user;
}
```
