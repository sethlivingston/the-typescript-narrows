---
id: use-unknown-in-catch
title: Type catch clause variables as unknown
severity: bug-prevention
enforcement: both
confidence: strong
tags: [type-safety, error-handling]
related: [typed-errors, no-explicit-any]
lint:
  type: existing
  rule: "@typescript-eslint/use-unknown-in-catch-callback-variable"
---

## Stance

Treat catch clause variables as `unknown` and narrow before accessing properties.

## Why

Anything can be thrown in JavaScript -- strings, numbers, objects, `undefined`. Assuming the caught value is an `Error` instance will crash if someone throws a non-Error value. TypeScript's `useUnknownInCatchVariables` compiler option types catch variables as `unknown` by default, enforcing safe access.

## Do

```typescript
try {
  riskyOperation();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unexpected error:", String(error));
  }
}
```

## Don't

```typescript
try {
  riskyOperation();
} catch (error) {
  console.error(error.message); // Crashes if error is not an Error
}
```
