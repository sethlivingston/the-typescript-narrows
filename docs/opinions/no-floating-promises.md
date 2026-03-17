---
id: no-floating-promises
title: Always handle Promise rejections
severity: bug-prevention
enforcement: both
confidence: strong
tags: [async, promises]
related: [no-misused-promises, return-await]
lint:
  type: existing
  rule: "@typescript-eslint/no-floating-promises"
---

## Stance

Every Promise must be awaited, returned, or explicitly voided. Never leave a Promise floating.

## Why

A floating Promise silently swallows rejections. The error vanishes, leaving the application in a corrupted state with no indication of failure.

## Do

```typescript
await sendEmail(user);
// or, if intentionally fire-and-forget:
void sendEmail(user);
```

## Don't

```typescript
sendEmail(user); // Floating -- rejection is lost
```
