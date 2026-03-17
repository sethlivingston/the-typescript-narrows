---
id: single-discriminant
title: Use a single type or kind field as discriminant
severity: maintenance
enforcement: skill-only
confidence: moderate
tags: [discriminated-unions, patterns]
related: [exhaustive-discrimination, no-destructure-before-narrow, exhaustive-switch]
---

## Stance

Use a single string literal field named `type` (or `kind` in AST contexts) as the discriminant for union types. Do not use multiple fields or boolean combinations.

## Why

A single discriminant field enables TypeScript's built-in narrowing via `switch` and `if` checks. Multiple discriminant fields require complex intersection checks that the compiler cannot narrow automatically. A single `type` field also makes the union self-documenting -- you can read the variants at a glance.

## Do

```typescript
type Shape =
  | { type: "circle"; radius: number }
  | { type: "rect"; width: number; height: number };
```

## Don't

```typescript
type Shape = {
  isCircle: boolean;
  radius?: number;
  width?: number;
  height?: number;
};
```

## Exceptions

This opinion is enforced via skill guidance only. A custom ESLint rule is not practical because detecting whether a union type uses a single discriminant field requires whole-program type analysis that static AST-based linting cannot reliably perform.
