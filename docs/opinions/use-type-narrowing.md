---
id: use-type-narrowing
title: Narrow types with guards instead of assertions
severity: bug-prevention
enforcement: skill-only
confidence: strong
tags: [null-handling, narrowing, type-safety]
related: [no-type-assertions, exhaustive-switch]
---

## Stance

Use type guard functions, `typeof`, `instanceof`, and `in` checks to narrow types. Do not use `as` assertions to "narrow."

## Why

Type guards are checked at runtime -- if the check fails, you handle it. Assertions are unchecked -- if wrong, you get a runtime crash that the compiler promised would not happen.

## Do

```typescript
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value;
}

if (isUser(data)) {
  console.log(data.id); // Safely narrowed
}
```

## Don't

```typescript
const user = data as User; // No runtime check
console.log(user.id); // Crashes if data is not a User
```
