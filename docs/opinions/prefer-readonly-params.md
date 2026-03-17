---
id: prefer-readonly-params
title: Use Readonly<T> and ReadonlyArray<T> in function params
severity: maintenance
enforcement: both
confidence: moderate
tags: [immutability, functions, generics]
related: [prefer-readonly, prefer-const]
lint:
  type: existing
  rule: "@typescript-eslint/prefer-readonly-parameter-types"
---

## Stance

Use `Readonly<T>` for object parameters and `ReadonlyArray<T>` (or `readonly T[]`) for array parameters.

## Why

Mutable parameters allow functions to silently modify their inputs, creating action-at-a-distance bugs. The caller passes an array expecting it unchanged, but the function mutates it. Readonly parameters make it explicit that the function does not mutate its inputs.

## Do

```typescript
function getTotal(items: readonly number[]): number {
  return items.reduce((sum, n) => sum + n, 0);
}
```

## Don't

```typescript
function getTotal(items: number[]): number {
  items.sort(); // mutates the caller's array
  return items.reduce((sum, n) => sum + n, 0);
}
```

## Exceptions

Third-party types that are not readonly-compatible may need exemption. Performance-critical code that mutates in place may use mutable params with clear documentation.
