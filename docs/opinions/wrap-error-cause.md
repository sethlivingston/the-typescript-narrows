---
id: wrap-error-cause
title: "Wrap errors with cause when rethrowing"
severity: maintenance
enforcement: skill-only
confidence: strong
tags: [error-handling, debugging, error-cause]
related: [typed-errors, no-empty-catch]
---

## Stance

When catching and rethrowing errors, wrap with `new Error('context', { cause: err })`. Never rethrow bare or discard the original.

## Why

Go-inspired error wrapping (`fmt.Errorf` with `%w`). The cause chain preserves the full error trail for debugging while each layer adds context about what operation failed. Without cause, you lose the original stack trace and error details. ES2022 Error cause is the standard mechanism -- no custom classes needed.

## Do

```typescript
try {
  await db.query(sql);
} catch (err) {
  throw new Error(`Failed to execute query: ${sql}`, { cause: err });
}
```

## Don't

```typescript
try {
  await db.query(sql);
} catch (err) {
  throw err; // No context added
  // or worse:
  throw new Error("Query failed"); // Original error lost
}
```
