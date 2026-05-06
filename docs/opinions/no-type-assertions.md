---
id: no-type-assertions
title: Restrict type assertions to proven-safe patterns
severity: bug-prevention
enforcement: both
confidence: strong
tags: [type-safety, assertions]
related: [no-unsafe-type-assertion, use-type-narrowing, no-explicit-any]
lint:
  type: existing
  rule: "@typescript-eslint/consistent-type-assertions"
---

## Stance

Do not use `as` type assertions unless narrowing is impossible and the assertion is provably safe. When an assertion is necessary, use the `as unknown as T` double-cast pattern — see [no-unsafe-type-assertion](no-unsafe-type-assertion.md).

## Why

Type assertions bypass the compiler. If the assertion is wrong, you get a runtime error with no warning. Unlike type guards, assertions are not checked -- they simply tell the compiler to trust you.

## Do

```typescript
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value;
}

const data: unknown = fetchData();
if (isUser(data)) {
  console.log(data.id); // Narrowed safely
}
```

## Don't

```typescript
const data: unknown = fetchData();
const user = data as User; // No validation
console.log(user.id); // Crashes if data is not a User
```

## Exceptions

Test fixtures where the shape is controlled by the test. Interop with untyped APIs where validation happens externally and cannot be expressed as a type guard.
