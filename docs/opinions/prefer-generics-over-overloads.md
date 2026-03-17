---
id: prefer-generics-over-overloads
title: Use generics instead of function overloads when possible
severity: maintenance
enforcement: skill-only
confidence: moderate
tags: [generics, functions]
related: [constrain-generics, no-unnecessary-generics]
---

## Stance

Prefer a single generic signature over multiple function overloads when the overloads differ only in type.

## Why

Overloads create maintenance burden -- each signature must be kept in sync. Generic signatures express the relationship once. Overloads are also harder for callers to understand when there are many variants.

## Do

```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((k) => { result[k] = obj[k]; });
  return result;
}
```

## Don't

```typescript
function pick(obj: User, keys: ("name" | "email")[]): Pick<User, "name" | "email">;
function pick(obj: Order, keys: ("id" | "total")[]): Pick<Order, "id" | "total">;
function pick(obj: any, keys: string[]): any {
  // repeated for each type
}
```

## Exceptions

Overloads are appropriate when the return type changes based on input in ways generics cannot express, or when the implementations are genuinely different.
