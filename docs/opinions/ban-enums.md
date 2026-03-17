---
id: ban-enums
title: "Ban enums; use as const objects with type unions"
severity: maintenance
enforcement: both
confidence: strong
tags: [type-declarations, enums]
related: [no-const-enum]
lint:
  type: custom
---

## Stance

Do not use TypeScript enums. Use `as const` objects with derived type unions instead.

## Why

Enums generate runtime code, have surprising behaviors (reverse mappings on numeric enums, `const enum` inlining issues in declaration files), and cannot be tree-shaken. `as const` objects are plain JavaScript with full type safety. They work with every bundler, produce predictable output, and the derived union type provides exhaustive checking.

## Do

```typescript
const Status = {
  Active: "active",
  Inactive: "inactive",
} as const;

type Status = (typeof Status)[keyof typeof Status];
```

## Don't

```typescript
enum Status {
  Active = "active",
  Inactive = "inactive",
}
```
