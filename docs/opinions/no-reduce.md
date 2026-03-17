---
id: no-reduce
title: "Ban .reduce entirely"
severity: maintenance
enforcement: skill-only
confidence: strong
tags: [iteration, functional, readability]
related: [prefer-for-of]
---

## Stance

Do not use `.reduce()`. Use `for...of` or `.map`/`.filter` combinations instead.

## Why

`.reduce` forces the reader to mentally simulate an accumulator through every iteration. A `for...of` loop with a mutable accumulator or a `.map`/`.filter` chain expresses the same logic more directly. No "trivial case" exception -- zero ambiguity about when to use it.

## Do

```typescript
const totals: Record<string, number> = {};
for (const item of items) {
  totals[item.category] = (totals[item.category] ?? 0) + item.amount;
}
```

## Don't

```typescript
const totals = items.reduce<Record<string, number>>((acc, item) => {
  acc[item.category] = (acc[item.category] ?? 0) + item.amount;
  return acc;
}, {});
```
