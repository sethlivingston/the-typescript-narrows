---
id: prefer-unknown
title: Use unknown for values of uncertain type
severity: bug-prevention
enforcement: both
confidence: strong
tags: [type-safety, unknown]
related: [no-explicit-any, use-type-narrowing]
lint:
  type: existing
  rule: "@typescript-eslint/no-unsafe-assignment"
---

## Stance

Default to `unknown` for values whose type is not known at compile time.

## Why

`unknown` forces you to narrow before use, catching type errors at compile time instead of runtime. Any value can be assigned to `unknown`, but `unknown` cannot be used until narrowed -- the compiler ensures you verify the shape before operating on it.

## Do

```typescript
function parseResponse(raw: unknown): string {
  if (typeof raw === "object" && raw !== null && "name" in raw) {
    return String((raw as { name: unknown }).name);
  }
  throw new Error("Invalid response shape");
}
```

## Don't

```typescript
function parseResponse(raw: any): string {
  return raw.name; // No check, crashes if shape is wrong
}
```
