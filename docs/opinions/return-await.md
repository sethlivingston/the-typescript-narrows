---
id: return-await
title: Always return await in try/catch blocks
severity: bug-prevention
enforcement: both
confidence: strong
tags: [async, promises, error-handling]
related: [no-floating-promises, typed-errors]
lint:
  type: existing
  rule: "@typescript-eslint/return-await"
---

## Stance

Always use `return await` inside try/catch blocks. Outside try/catch, return the Promise directly.

## Why

`return promise` inside try/catch exits the try block before the Promise settles -- the catch block never fires on rejection. `return await promise` settles the Promise inside the try block, allowing catch to handle errors.

## Do

```typescript
async function getData() {
  try {
    return await fetchData(); // Settles inside try
  } catch (error) {
    handleError(error); // Catches rejections
  }
}
```

## Don't

```typescript
async function getData() {
  try {
    return fetchData(); // Exits try before settling
  } catch (error) {
    handleError(error); // Never runs on rejection
  }
}
```
