---
id: conditional-type-safety
title: Wrap conditional types to prevent unintended distribution
severity: bug-prevention
enforcement: skill-only
confidence: moderate
tags: [advanced-types, conditional-types, generics]
related: [constrain-generics, variance-annotations]
---

## Stance

Wrap both sides of a conditional type in `[T]` (tuple) to prevent distributive behavior when it is not intended.

## Why

Conditional types distribute over unions by default: `IsString<"a" | 1>` becomes `IsString<"a"> | IsString<1>` instead of evaluating the union as a whole. This causes unexpected results when the intent is to check the union itself, not each member individually.

## Do

```typescript
type IsString<T> = [T] extends [string] ? true : false;

type Test = IsString<"a" | 1>; // false (evaluates the full union)
```

## Don't

```typescript
type IsString<T> = T extends string ? true : false;

type Test = IsString<"a" | 1>; // boolean (distributes: true | false)
```
