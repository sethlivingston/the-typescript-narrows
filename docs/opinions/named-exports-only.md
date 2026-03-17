---
id: named-exports-only
title: Use named exports; ban default exports
severity: maintenance
enforcement: both
confidence: strong
tags: [modules, imports, exports]
related: [consistent-type-imports, ban-barrel-files]
lint:
  type: existing
  rule: "import/no-default-export"
---

## Stance

Use named exports exclusively. Do not use default exports.

## Why

Default exports have no canonical name -- importers can name them anything, making it impossible to grep for usages. Named exports enforce a single name, improving discoverability and refactoring. Renaming a named export produces compile errors at every import site; renaming a default export produces nothing.

## Do

```typescript
export function createUser(name: string): User {
  return { id: generateId(), name };
}

// consumer
import { createUser } from "./user";
```

## Don't

```typescript
export default function (name: string): User {
  return { id: generateId(), name };
}

// consumer -- name is arbitrary
import whatever from "./user";
```

## Exceptions

Frameworks that require default exports (Next.js pages, Storybook stories) at specific file paths.
