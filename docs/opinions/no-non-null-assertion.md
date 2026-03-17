---
id: no-non-null-assertion
title: Do not use the ! postfix operator
severity: bug-prevention
enforcement: both
confidence: strong
tags: [type-safety, null-handling]
related: [prefer-optional-chaining, prefer-nullish-coalescing]
lint:
  type: existing
  rule: "@typescript-eslint/no-non-null-assertion"
---

## Stance

Never use the `!` non-null assertion operator.

## Why

`!` tells the compiler to trust you that a value is not `null` or `undefined`. If you are wrong, the program crashes at runtime. Unlike an `if` check or optional chaining, `!` produces no runtime guard -- it is erased during compilation.

## Do

```typescript
const element = document.getElementById("app");
if (element !== null) {
  element.textContent = "Ready";
}
```

## Don't

```typescript
const element = document.getElementById("app");
element!.textContent = "Ready"; // Crashes if element is null
```
