---
id: prefer-using-declarations
title: "Use `using` declarations to tie resource lifetimes to scope"
severity: bug-prevention
enforcement: skill-only
confidence: strong
tags: [resource-management, disposable, using]
related: []
---

## Stance

Use `using` and `await using` declarations to bind resource lifetimes to scope. The runtime calls `[Symbol.dispose]()` or `[Symbol.asyncDispose]()` automatically when the block exits, even on exceptions.

## Why

Manual cleanup with try/finally is error-prone — developers forget cleanup, add early returns before it, or fail to dispose on throw. `using` makes disposal deterministic and exception-safe by tying it to scope exit, eliminating an entire class of resource-leak bugs. TypeScript 5.2+ supports the TC39 Explicit Resource Management proposal.

## Do

```typescript
async function readConfig(path: string): Promise<Config> {
  await using file = await openFile(path);
  const text = await file.readAll();
  return parseConfig(text);
  // file.[Symbol.asyncDispose]() called automatically
}
```

## Don't

```typescript
async function readConfig(path: string): Promise<Config> {
  const file = await openFile(path);
  try {
    const text = await file.readAll();
    return parseConfig(text);
  } finally {
    await file.close();
  }
}
```

## Exceptions

When targeting runtimes that lack `Symbol.dispose` polyfills, or when the resource does not implement the `Disposable` / `AsyncDisposable` protocol.
