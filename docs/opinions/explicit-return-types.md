---
id: explicit-return-types
title: "Require explicit return types on exported functions"
severity: maintenance
enforcement: both
confidence: strong
tags: [type-safety, api-stability, declarations]
related: []
lint:
  type: existing
  rule: "@typescript-eslint/explicit-function-return-type"
---

## Stance

Annotate explicit return types on all exported functions. Internal functions can rely on inference.

## Why

Inferred return types change silently when implementation changes, breaking consumers. Explicit return types on exports lock the API contract -- the compiler will catch unintended changes before they ship.

## Do

```typescript
export const fetchUser = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
```

## Don't

```typescript
export const fetchUser = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data; // Inferred return type changes if implementation changes
};
```

## Exceptions

Internal/private functions where type inference is sufficient and the function is not part of a public API.
