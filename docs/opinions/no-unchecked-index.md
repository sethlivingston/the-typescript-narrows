---
id: no-unchecked-index
title: Enable noUncheckedIndexedAccess
severity: bug-prevention
enforcement: skill-only
confidence: strong
tags: [tsconfig, strictness, configuration]
related: [strict-tsconfig]
---

## Stance

Enable `noUncheckedIndexedAccess` in tsconfig.json.

## Why

Without this flag, `array[0]` returns `T` instead of `T | undefined`, and `record["key"]` returns `V` instead of `V | undefined`. This hides potential undefined access that causes runtime crashes. With the flag enabled, the compiler forces you to handle the possibility that an index access returns `undefined`.

## Do

```json
{
  "compilerOptions": {
    "noUncheckedIndexedAccess": true
  }
}
```

```typescript
const items = ["a", "b", "c"];
const first = items[0];
if (first !== undefined) {
  console.log(first.toUpperCase());
}
```

## Don't

```typescript
const items = ["a", "b", "c"];
const first = items[0];
console.log(first.toUpperCase()); // Crashes if array is empty
```
