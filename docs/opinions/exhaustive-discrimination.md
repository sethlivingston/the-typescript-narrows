---
id: exhaustive-discrimination
title: Always handle all variants of a discriminated union
severity: bug-prevention
enforcement: both
confidence: strong
tags: [discriminated-unions, narrowing, exhaustiveness]
related: [exhaustive-switch, single-discriminant]
lint:
  type: existing
  rule: "@typescript-eslint/switch-exhaustiveness-check"
---

## Stance

When processing a discriminated union, handle every variant. Use `switch` with a `default: never` guard, or if/else chains that the compiler can verify are exhaustive.

## Why

Unhandled variants are silent bugs -- the code path falls through or hits a catch-all that does the wrong thing. Adding a new variant to the union should cause compile errors everywhere it is not handled, making it impossible to forget.

## Do

```typescript
function area(shape: Shape): number {
  switch (shape.type) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rect": return shape.width * shape.height;
    default: { const _exhaustive: never = shape; throw new Error("Unhandled"); }
  }
}
```

## Don't

```typescript
function area(shape: Shape): number {
  switch (shape.type) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rect": return shape.width * shape.height;
    default: return 0; // silently ignores new variants
  }
}
```
