---
id: prefer-const
title: Use const by default; let only when reassigned
severity: style
enforcement: both
confidence: strong
tags: [immutability, variables]
related: [no-var, no-mutable-exports]
lint:
  type: existing
  rule: "prefer-const"
---

## Stance

Declare all variables with `const`. Use `let` only when the variable will be reassigned.

## Why

`const` signals intent -- this value does not change. It prevents accidental reassignment and makes code easier to reason about. When you see `let`, you know to look for where the value changes. When everything is `let`, that signal is lost.

## Do

```typescript
const items = getItems();
const maxRetries = 3;

let count = 0;
for (const item of items) {
  count++;
}
```

## Don't

```typescript
let items = getItems(); // never reassigned
let maxRetries = 3; // never reassigned
```
