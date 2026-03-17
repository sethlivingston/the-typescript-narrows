---
id: no-unnecessary-condition
title: Do not write conditions that are always true or false
severity: bug-prevention
enforcement: both
confidence: strong
tags: [null-handling, type-safety, dead-code]
related: [strict-boolean-expressions]
lint:
  type: existing
  rule: "@typescript-eslint/no-unnecessary-condition"
---

## Stance

Do not write conditions the type system can prove are always true or always false.

## Why

An always-true condition is dead code that misleads readers. An always-false condition hides unreachable code. Both indicate a mismatch between what the developer believes and what the compiler knows -- often a sign of a real bug elsewhere.

## Do

```typescript
function greet(name: string | null) {
  if (name !== null) {
    console.log(`Hello, ${name}`);
  }
}
```

## Don't

```typescript
function greet(name: string) {
  if (name !== null) { // Always true -- string cannot be null
    console.log(`Hello, ${name}`);
  }
}
```
