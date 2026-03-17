---
id: no-var
title: Never use var
severity: style
enforcement: both
confidence: strong
tags: [immutability, variables]
related: [prefer-const]
lint:
  type: existing
  rule: "no-var"
---

## Stance

Never use `var`. Use `const` or `let`.

## Why

`var` has function scope (not block scope) and is hoisted, creating surprising behavior. A `var` declared inside an `if` block is visible outside it. `const` and `let` have block scope and are not hoisted, making control flow predictable.

## Do

```typescript
const name = "Alice";
let count = 0;
```

## Don't

```typescript
var name = "Alice";
var count = 0;
```
