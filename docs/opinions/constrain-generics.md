---
id: constrain-generics
title: Always constrain generic type parameters
severity: maintenance
enforcement: skill-only
confidence: moderate
tags: [generics, type-safety]
related: [no-unnecessary-generics, prefer-generics-over-overloads]
---

## Stance

Every generic type parameter should have an `extends` constraint. Unconstrained `<T>` should be rare and intentional.

## Why

Unconstrained generics accept any type including `never`, `void`, and other edge cases. Constraints document the expected shape and catch misuse at the call site. Without a constraint, callers can pass types that compile but produce nonsensical results.

## Do

```typescript
function merge<T extends object>(a: T, b: Partial<T>): T {
  return { ...a, ...b };
}
```

## Don't

```typescript
function merge<T>(a: T, b: Partial<T>): T {
  return { ...a, ...b }; // accepts primitives, which Partial does not affect
}
```
