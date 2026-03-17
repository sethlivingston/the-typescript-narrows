---
id: typed-errors
title: Throw only Error subclasses, never primitives
severity: bug-prevention
enforcement: both
confidence: strong
tags: [error-handling, type-safety]
related: [use-unknown-in-catch, result-over-throw]
lint:
  type: existing
  rule: "@typescript-eslint/only-throw-error"
---

## Stance

Only throw instances of `Error` or its subclasses. Never throw strings, numbers, or plain objects.

## Why

Non-Error throwables lack stack traces, making debugging impossible. `catch` handlers that expect `error.message` or `error.stack` crash on primitives. Error subclasses also enable `instanceof` checks for typed error handling.

## Do

```typescript
throw new Error("User not found");
// or with a custom subclass:
throw new NotFoundError("User", id);
```

## Don't

```typescript
throw "User not found";
throw 404;
throw { code: "NOT_FOUND" };
```
