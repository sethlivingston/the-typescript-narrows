---
id: accept-interfaces
title: "Accept interfaces, return concrete types"
severity: maintenance
enforcement: skill-only
confidence: strong
tags: [functions, parameters, return-types, dependency-inversion]
related: [prefer-interface, explicit-return-types]
---

## Stance

Accept interfaces in function parameters; return concrete types. Keep inputs narrow and outputs concrete.

## Why

Go-inspired "accept interfaces, return structs." Narrow input interfaces make functions testable (pass a mock that satisfies only the interface) and reusable (any conforming type works). Concrete return types give callers full type information without casting. This is dependency inversion at the type level.

## Do

```typescript
interface Readable {
  read(size: number): Buffer;
}

const processStream = (source: Readable): ProcessedData => {
  const raw = source.read(1024);
  return { bytes: raw.length, content: raw.toString() };
};
```

## Don't

```typescript
import { ReadStream } from "fs";

const processStream = (source: ReadStream): Record<string, unknown> => {
  const raw = source.read(1024);
  return { bytes: raw.length, content: raw.toString() };
};
```
