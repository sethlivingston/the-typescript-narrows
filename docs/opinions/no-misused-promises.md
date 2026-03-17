---
id: no-misused-promises
title: Do not pass Promises where void is expected
severity: bug-prevention
enforcement: both
confidence: strong
tags: [async, promises]
related: [no-floating-promises]
lint:
  type: existing
  rule: "@typescript-eslint/no-misused-promises"
---

## Stance

Do not pass async functions to callbacks that expect synchronous void returns (event handlers, array methods, etc.).

## Why

When an async function is passed where void is expected, the returned Promise is silently discarded. Errors in the async function vanish without any indication of failure.

## Do

```typescript
button.addEventListener("click", () => {
  save().catch((error) => console.error("Save failed:", error));
});
```

## Don't

```typescript
button.addEventListener("click", async () => {
  await save(); // Promise returned to addEventListener, which ignores it
});
```
