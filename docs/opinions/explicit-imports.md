---
id: explicit-imports
title: Import from the source module, not through re-exports
severity: maintenance
enforcement: skill-only
confidence: moderate
tags: [modules, imports]
related: [ban-barrel-files, named-exports-only]
---

## Stance

Import directly from the module that defines the symbol. Do not import through intermediate re-export files.

## Why

Direct imports create a clear dependency graph -- you can trace exactly where each symbol comes from. Re-export chains obscure the actual source and create unnecessary coupling between modules. When a re-export file changes, all consumers are affected even if the source module did not change.

## Do

```typescript
import { validateEmail } from "./validators/email";
import { validatePhone } from "./validators/phone";
```

## Don't

```typescript
// Imports through a re-export barrel
import { validateEmail } from "./validators";
import { validatePhone } from "./validators";
```
