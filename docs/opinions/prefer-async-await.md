---
id: prefer-async-await
title: Use async/await over .then() chains
severity: maintenance
enforcement: skill-only
confidence: moderate
tags: [async, promises, readability]
related: [no-floating-promises, return-await]
---

## Stance

Use async/await for asynchronous control flow. Reserve `.then()` for simple one-step transformations.

## Why

Async/await reads top-to-bottom like synchronous code. `.then()` chains nest, making error handling and debugging harder. Stack traces are clearer with await.

## Do

```typescript
const data = await fetchData();
const result = process(data);
return result;
```

## Don't

```typescript
fetchData()
  .then((data) => process(data))
  .then((result) => handleResult(result))
  .catch((error) => handleError(error));
```

## Exceptions

`.then()` is fine for simple transforms like `promise.then((r) => r.json())` where a full async function would add unnecessary boilerplate.
