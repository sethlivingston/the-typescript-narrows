---
id: consistent-type-imports
title: Use import type for type-only imports
severity: style
enforcement: both
confidence: strong
tags: [type-declarations, imports]
related: [named-exports-only]
lint:
  type: existing
  rule: "@typescript-eslint/consistent-type-imports"
---

## Stance

Use `import type` for imports that are only used as types and are erased at compile time.

## Why

`import type` makes the compile-time vs runtime distinction explicit. It enables better tree-shaking, prevents accidental side effects from type-only imports, and communicates intent: this import exists only for the type checker, not for runtime behavior.

## Do

```typescript
import type { User } from "./types";
import { createUser } from "./users";

function greet(user: User): string {
  return `Hello, ${user.name}`;
}
```

## Don't

```typescript
import { User } from "./types"; // User is only used as a type
import { createUser } from "./users";

function greet(user: User): string {
  return `Hello, ${user.name}`;
}
```
