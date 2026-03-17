---
id: no-namespace
title: Do not use TypeScript namespaces
severity: maintenance
enforcement: both
confidence: strong
tags: [type-declarations, modules]
related: [named-exports-only]
lint:
  type: existing
  rule: "@typescript-eslint/no-namespace"
---

## Stance

Never use `namespace`. Use ES modules for code organization.

## Why

Namespaces are a legacy TypeScript feature that predates ES modules. They create unnecessary indirection, do not work with tree-shaking, and confuse developers who expect standard module semantics. ES modules are the universal standard for JavaScript code organization.

## Do

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// consumer.ts
import { add } from "./math";
```

## Don't

```typescript
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b;
  }
}
```
