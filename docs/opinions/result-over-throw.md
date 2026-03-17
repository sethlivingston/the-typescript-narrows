---
id: result-over-throw
title: Prefer Result types for expected failures, throw for bugs
severity: maintenance
enforcement: skill-only
confidence: moderate
tags: [error-handling, patterns, discriminated-unions]
related: [typed-errors, error-discrimination]
---

## Stance

Use a `Result<T, E>` discriminated union for expected, recoverable failures. Reserve `throw` for unexpected bugs and programmer errors.

## Why

Thrown exceptions are invisible in function signatures -- callers have no idea a function can fail. Result types make failure explicit in the type system, forcing callers to handle both success and error cases at compile time.

## Do

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function parseConfig(raw: string): Result<Config, ParseError> {
  const parsed = tryParse(raw);
  if (!parsed) return { ok: false, error: new ParseError("Invalid JSON") };
  return { ok: true, value: parsed };
}
```

## Don't

```typescript
function parseConfig(raw: string): Config {
  const parsed = JSON.parse(raw); // Throws on invalid input
  return parsed as Config; // Caller has no idea this can fail
}
```

## Exceptions

Functions where failure is truly exceptional (out of memory, network down, corrupted state) can throw. The key question: "Should the caller be forced to handle this?" If yes, use Result.
