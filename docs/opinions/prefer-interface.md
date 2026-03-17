---
id: prefer-interface
title: Use interfaces for object shapes, types for unions/intersections/utilities
severity: maintenance
enforcement: both
confidence: moderate
tags: [type-declarations, interface, type-alias]
related: [no-namespace]
lint:
  type: existing
  rule: "@typescript-eslint/consistent-type-definitions"
---

## Stance

Use `interface` for object shapes (data contracts, props, configs). Use `type` for unions, intersections, mapped types, and utility types.

## Why

Interfaces are extendable and produce better error messages. Types are required for unions and intersections. Consistent usage eliminates the daily "type or interface?" decision. When everyone follows the same rule, the keyword itself communicates intent: `interface` means "this is a shape," `type` means "this is a combination or transformation."

## Do

```typescript
interface User {
  id: string;
  name: string;
}

type Result = Success | Failure;
type Nullable<T> = T | null;
```

## Don't

```typescript
type User = {
  id: string;
  name: string;
}; // Plain object shape -- use interface
```
