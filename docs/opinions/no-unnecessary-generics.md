---
id: no-unnecessary-generics
title: Do not add type parameters used only once
severity: maintenance
enforcement: both
confidence: strong
tags: [generics, simplicity]
related: [constrain-generics]
lint:
  type: existing
  rule: "@typescript-eslint/no-unnecessary-type-parameters"
---

## Stance

Do not introduce a generic type parameter that appears only once in the function signature. If a type parameter is not used to relate two or more values, it adds complexity without benefit.

## Why

A type parameter used once is equivalent to its constraint. `<T extends string>(x: T): void` is the same as `(x: string): void` -- the generic adds cognitive overhead without enabling anything. Generics should relate inputs to outputs or inputs to each other.

## Do

```typescript
function identity<T>(value: T): T {
  return value; // T relates input to output
}
```

## Don't

```typescript
function log<T extends string>(message: T): void {
  console.log(message); // T used once -- just use string
}
```
