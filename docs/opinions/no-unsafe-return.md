---
id: no-unsafe-return
title: Do not return unsafe any-typed values
severity: bug-prevention
enforcement: both
confidence: strong
tags: [type-safety, any]
related: [no-explicit-any, prefer-unknown]
lint:
  type: existing
  rule: "@typescript-eslint/no-unsafe-return"
---

## Stance

Never return a value typed as `any` from a function with a typed return signature.

## Why

An `any` return silently poisons the calling code. The caller believes it has a typed value, but the actual data is unchecked. Bugs surface far from where they originate, making them difficult to trace. Validate and narrow the value before returning.

## Do

```typescript
interface Config {
  port: number;
  host: string;
}

function loadConfig(raw: unknown): Config {
  if (typeof raw === "object" && raw !== null
      && "port" in raw && "host" in raw) {
    return { port: Number(raw.port), host: String(raw.host) };
  }
  throw new Error("Invalid config");
}
```

## Don't

```typescript
function loadConfig(data: string): Config {
  return JSON.parse(data); // Returns any, no validation
}
```
