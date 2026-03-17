---
id: boolean-naming
title: "Prefix booleans with is, has, should, can"
severity: style
enforcement: skill-only
confidence: moderate
tags: [naming, conventions, readability]
related: [naming-convention]
---

## Stance

Name boolean variables and parameters with a verb prefix: `is`, `has`, `should`, `can`, `will`, `did`.

## Why

Boolean names without prefixes are ambiguous. `disabled` could be a verb (an action to perform) or an adjective (a current state). `isDisabled` is unambiguously a boolean state. Verb prefixes also make conditionals read like English: `if (isVisible)` reads naturally, while `if (visible)` does not clearly indicate a boolean check.

## Do

```typescript
const isVisible = true;
const hasPermission = user.roles.includes("admin");
const shouldRetry = attempts < maxRetries;
const canEdit = hasPermission && !isLocked;
```

## Don't

```typescript
const visible = true;
const permission = user.roles.includes("admin");
const retry = attempts < maxRetries;
const edit = permission && !locked;
```
