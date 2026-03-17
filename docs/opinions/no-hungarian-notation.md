---
id: no-hungarian-notation
title: "Do not prefix type names (no IUser, TConfig, EStatus)"
severity: style
enforcement: both
confidence: strong
tags: [naming, conventions]
related: [naming-convention]
lint:
  type: existing
  rule: "@typescript-eslint/naming-convention"
---

## Stance

Do not prefix interfaces with `I`, types with `T`, or enums with `E`.

## Why

Hungarian notation is a C#/Java convention that adds noise in TypeScript. The language's structural type system makes prefixes redundant -- the usage context already tells you whether something is a type. Prefixes also create friction when refactoring: renaming an interface to a type alias should not require renaming every reference.

## Do

```typescript
interface User {
  id: string;
  name: string;
}

type Config = {
  port: number;
};
```

## Don't

```typescript
interface IUser {
  id: string;
  name: string;
}

type TConfig = {
  port: number;
};
```
