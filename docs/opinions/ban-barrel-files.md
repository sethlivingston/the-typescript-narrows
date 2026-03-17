---
id: ban-barrel-files
title: Do not use barrel files (index.ts re-exports)
severity: maintenance
enforcement: both
confidence: moderate
tags: [modules, imports, performance]
related: [named-exports-only, explicit-imports]
lint:
  type: custom
---

## Stance

Do not create `index.ts` files that re-export from other modules (barrel files).

## Why

Barrel files defeat tree-shaking -- importing one symbol pulls in all re-exports. They create circular dependency risks, slow down IDE auto-imports, and hide the actual module structure. A barrel that re-exports from 20 files forces the bundler and type checker to load all 20 even when you need one.

## Do

```typescript
import { User } from "./models/user";
import { Order } from "./models/order";
```

## Don't

```typescript
// models/index.ts -- barrel file
export { User } from "./user";
export { Order } from "./order";
export { Product } from "./product";

// consumer -- imports through barrel
import { User } from "./models";
```
