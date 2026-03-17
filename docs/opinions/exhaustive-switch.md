---
id: exhaustive-switch
title: Handle all cases in discriminated union switches
severity: bug-prevention
enforcement: both
confidence: strong
tags: [null-handling, narrowing, discriminated-unions]
related: [exhaustive-discrimination, single-discriminant]
lint:
  type: existing
  rule: "@typescript-eslint/switch-exhaustiveness-check"
---

## Stance

Every switch on a discriminated union must handle all variants. Use a `default: never` check to catch unhandled cases at compile time.

## Why

Adding a new variant to a union without updating all switch statements causes silent bugs -- the new case falls through or hits a wrong default. A `default: never` assignment turns this into a compile-time error the moment a variant is added.

## Do

```typescript
type Shape = { type: "circle"; radius: number } | { type: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.type) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
    default: { const _exhaustive: never = shape; return _exhaustive; }
  }
}
```

## Don't

```typescript
function area(shape: Shape): number {
  switch (shape.type) {
    case "circle": return Math.PI * shape.radius ** 2;
    default: return 0; // Swallows new variants silently
  }
}
```
