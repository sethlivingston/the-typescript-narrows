---
id: prefer-for-of
title: "Use for...of over .forEach"
severity: maintenance
enforcement: skill-only
confidence: strong
tags: [iteration, loops, async]
related: [no-reduce, prefer-async-await]
---

## Stance

Use `for...of` loops instead of `.forEach()`.

## Why

`.forEach` swallows `break`, `continue`, and `return` -- the callback is a separate function scope, so `return` only exits the callback, not the enclosing function. It cannot use `await` correctly: marking the callback `async` produces fire-and-forget promises that run concurrently instead of sequentially. The closure safety myth does not hold either -- `for...of` with `const` or `let` gives a fresh binding per iteration, identical to `.forEach`.

## Do

```typescript
for (const item of items) {
  await process(item);
}
```

## Don't

```typescript
items.forEach(async (item) => {
  await process(item); // Runs all concurrently, not sequentially
});
```
