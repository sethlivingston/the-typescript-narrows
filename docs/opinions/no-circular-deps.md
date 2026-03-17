---
id: no-circular-deps
title: Avoid circular dependencies
severity: bug-prevention
enforcement: both
confidence: strong
tags: [modules, architecture]
related: [ban-barrel-files, explicit-imports]
lint:
  type: existing
  rule: "import/no-cycle"
---

## Stance

Do not create circular dependency chains between modules.

## Why

Circular dependencies cause partially initialized modules -- a module may import from another that has not finished executing yet, resulting in `undefined` imports at runtime. They also indicate tangled architecture where responsibilities are not cleanly separated.

## Do

```typescript
// shared/types.ts -- extract shared types
export interface User { id: string; name: string; }

// user-service.ts
import { User } from "./shared/types";

// auth-service.ts
import { User } from "./shared/types";
```

## Don't

```typescript
// a.ts imports from b.ts
import { formatUser } from "./b";

// b.ts imports from a.ts -- circular!
import { getUser } from "./a";
```
