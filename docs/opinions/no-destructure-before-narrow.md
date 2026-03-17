---
id: no-destructure-before-narrow
title: Do not destructure discriminated unions before narrowing
severity: bug-prevention
enforcement: both
confidence: strong
tags: [discriminated-unions, narrowing]
related: [single-discriminant, exhaustive-switch]
lint:
  type: custom
---

## Stance

Always narrow a discriminated union (via `switch` or `if` on the discriminant) before destructuring its properties.

## Why

Destructuring before narrowing loses the type connection between the discriminant and the variant-specific fields. TypeScript cannot narrow destructured variables -- only the original object retains the union relationship.

## Do

```typescript
function handle(result: Result) {
  if (result.type === "success") {
    const { value } = result; // narrowed to SuccessResult
    console.log(value);
  }
}
```

## Don't

```typescript
function handle(result: Result) {
  const { type, ...rest } = result;
  if (type === "success") {
    console.log(rest.value); // rest is not narrowed
  }
}
```
