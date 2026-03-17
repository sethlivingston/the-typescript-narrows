---
id: error-discrimination
title: Use discriminated union errors, not string messages
severity: maintenance
enforcement: skill-only
confidence: moderate
tags: [error-handling, discriminated-unions]
related: [result-over-throw, typed-errors, single-discriminant]
---

## Stance

Define error types as discriminated unions with a `type` field, not as strings or generic Error subclasses distinguished only by message.

## Why

String messages are fragile to match against and break with wording changes. Discriminated unions let callers switch on `error.type` with full type narrowing and exhaustive checking -- the compiler catches unhandled error cases.

## Do

```typescript
type AppError =
  | { type: "not-found"; id: string }
  | { type: "unauthorized"; reason: string }
  | { type: "validation"; fields: string[] };

function handle(error: AppError) {
  switch (error.type) {
    case "not-found": return `Missing: ${error.id}`;
    case "unauthorized": return `Denied: ${error.reason}`;
    case "validation": return `Invalid: ${error.fields.join(", ")}`;
  }
}
```

## Don't

```typescript
throw new Error("NOT_FOUND: user 123");
// Later:
if (error.message.startsWith("NOT_FOUND")) {
  // Fragile -- breaks if message wording changes
}
```
