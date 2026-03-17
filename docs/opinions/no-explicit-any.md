---
id: no-explicit-any
title: Never use explicit any
severity: bug-prevention
enforcement: both
confidence: strong
tags: [type-safety, any]
related: [prefer-unknown, no-unsafe-return]
lint:
  type: existing
  rule: "@typescript-eslint/no-explicit-any"
---

## Stance

Never use `any` as a type annotation. Use `unknown` instead and narrow the type before use.

## Why

`any` disables TypeScript's type checker for that value. It silently accepts every operation -- property access, function calls, arithmetic -- without verifying any of them. If the runtime value does not match what the code assumes, you get a crash with no compile-time warning. `unknown` preserves type safety by requiring you to narrow before use.

## Do

```typescript
function processInput(input: unknown): string {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  throw new TypeError("Expected a string");
}
```

## Don't

```typescript
function processInput(input: any): string {
  return input.toUpperCase(); // No error, no safety
}
```

## Exceptions

Third-party libraries with incomplete type definitions may require `any` at integration boundaries. Prefer `as unknown as ExpectedType` over `as any` when a type assertion is unavoidable.
