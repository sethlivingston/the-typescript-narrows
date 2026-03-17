---
id: strict-boolean-expressions
title: Require explicit boolean comparisons
severity: bug-prevention
enforcement: both
confidence: moderate
tags: [type-safety, conditionals]
related: [no-unnecessary-condition]
lint:
  type: existing
  rule: "@typescript-eslint/strict-boolean-expressions"
---

## Stance

Use explicit comparisons (`=== null`, `!== undefined`, `.length > 0`) instead of truthy/falsy checks.

## Why

Truthy/falsy checks silently coerce `0`, `""`, and `NaN` to `false`, causing subtle bugs. A count of zero is falsy but valid. An empty string is falsy but may be a legitimate value. Explicit comparisons make the intent clear and prevent accidental coercion.

## Do

```typescript
if (items.length > 0) {
  processItems(items);
}

if (name !== "") {
  greet(name);
}
```

## Don't

```typescript
if (items.length) {
  processItems(items); // Skips when length is 0 -- intentional?
}

if (name) {
  greet(name); // Skips empty string -- intentional?
}
```

## Exceptions

Boolean variables themselves are fine without explicit comparison: `if (isReady)` is clear and unambiguous.
