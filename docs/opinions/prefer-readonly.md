---
id: prefer-readonly
title: Mark class properties readonly when not reassigned
severity: maintenance
enforcement: both
confidence: moderate
tags: [immutability, classes]
related: [prefer-const, prefer-readonly-params]
lint:
  type: existing
  rule: "@typescript-eslint/prefer-readonly"
---

## Stance

Mark class properties `readonly` if they are not reassigned after construction.

## Why

`readonly` documents intent and prevents accidental mutation. It also enables the compiler to detect unintended reassignment during refactoring. Without it, any method in the class can silently overwrite the property.

## Do

```typescript
class UserService {
  readonly baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }
}
```

## Don't

```typescript
class UserService {
  baseUrl: string; // never reassigned but not marked readonly

  constructor(url: string) {
    this.baseUrl = url;
  }
}
```
