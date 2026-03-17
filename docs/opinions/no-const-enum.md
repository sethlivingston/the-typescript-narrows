---
id: no-const-enum
title: Never use const enum
severity: bug-prevention
enforcement: both
confidence: strong
tags: [type-declarations, enums]
related: [ban-enums]
lint:
  type: custom
---

## Stance

Never use `const enum`. Use `as const` objects instead.

## Why

`const enum` values are inlined at compile time, which breaks when declaration files are consumed by other packages. The values disappear from the bundle, causing runtime errors in consumers who import the declaration but not the inlined values. Additionally, `--isolatedModules` (required by most modern bundlers) forbids `const enum` across files.

## Do

```typescript
const Direction = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;

type Direction = (typeof Direction)[keyof typeof Direction];
```

## Don't

```typescript
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```
