---
id: no-empty-catch
title: Do not silently swallow errors with empty catch blocks
severity: bug-prevention
enforcement: both
confidence: strong
tags: [error-handling]
related: [typed-errors, use-unknown-in-catch]
lint:
  type: existing
  rule: "no-empty"
---

## Stance

Never leave a catch block empty. At minimum, log the error. Prefer explicit handling.

## Why

An empty catch block silently swallows errors, making failures invisible. The application continues in a corrupted state with no indication of what went wrong. Silent failures are harder to debug than loud ones.

## Do

```typescript
try {
  await saveData(record);
} catch (error) {
  logger.error("Failed to save record:", error);
}
```

## Don't

```typescript
try {
  await saveData(record);
} catch (error) { }
```

## Exceptions

If intentionally ignoring an error, add a comment explaining why:

```typescript
try {
  await cache.delete(key);
} catch {
  /* Intentionally ignored: cache miss is not an error */
}
```
