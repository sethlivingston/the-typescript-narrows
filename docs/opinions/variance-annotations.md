---
id: variance-annotations
title: Use in/out variance annotations on generic classes
severity: maintenance
enforcement: skill-only
confidence: moderate
tags: [generics, advanced-types, variance]
related: [constrain-generics, conditional-type-safety]
---

## Stance

Use `in` and `out` variance annotations on generic class and interface type parameters to make variance explicit.

## Why

Without annotations, TypeScript infers variance from usage, which can change unexpectedly when code is modified. Explicit annotations document the intended variance and cause compile errors if the implementation violates it. This prevents subtle assignability bugs during refactoring.

## Do

```typescript
interface Producer<out T> {
  get(): T;
}

interface Consumer<in T> {
  accept(value: T): void;
}
```

## Don't

```typescript
interface Producer<T> {
  get(): T; // variance is inferred, may change silently
}

interface Consumer<T> {
  accept(value: T): void;
}
```
