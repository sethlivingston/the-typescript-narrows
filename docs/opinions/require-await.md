---
id: require-await
title: Do not mark functions async unless they use await
severity: maintenance
enforcement: both
confidence: moderate
tags: [async, promises]
related: [no-floating-promises]
lint:
  type: existing
  rule: "@typescript-eslint/require-await"
---

## Stance

Do not mark a function `async` unless it contains `await`. If it just returns a Promise, return it directly.

## Why

`async` without `await` wraps the return value in an extra Promise layer unnecessarily. It also misleads readers into thinking the function has asynchronous operations that need awaiting.

## Do

```typescript
function fetchData(): Promise<Data> {
  return api.get("/data");
}
```

## Don't

```typescript
async function fetchData(): Promise<Data> {
  return api.get("/data"); // No await -- async is misleading
}
```

## Exceptions

When implementing an interface or abstract method that requires an async signature, the `async` keyword is acceptable even without `await`.
