---
id: no-destructure-before-narrow
title: Do not destructure discriminated unions before narrowing
severity: bug-prevention
enforcement: skill-only
confidence: strong
tags: [discriminated-unions, narrowing]
related: [single-discriminant, exhaustive-switch]
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

## Exceptions

This opinion is enforced via skill guidance only. A custom ESLint rule is not practical because reliably detecting destructuring of discriminated unions before narrowing requires type-aware analysis of union relationships that goes beyond what AST-level linting can accomplish.
