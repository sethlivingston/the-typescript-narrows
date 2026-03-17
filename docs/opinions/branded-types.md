---
id: branded-types
title: Use branded types for domain IDs and value objects
severity: maintenance
enforcement: skill-only
confidence: moderate
tags: [branded-types, domain-modeling, type-safety]
related: [constrain-generics]
---

## Stance

Use branded types to prevent accidental mixing of structurally identical but semantically different values (user IDs vs order IDs, raw strings vs sanitized strings).

## Why

TypeScript uses structural typing -- `string` is `string` regardless of what it represents. Branded types add a phantom property that makes the compiler distinguish between `UserId` and `OrderId`, catching mix-ups at compile time instead of at runtime.

## Do

```typescript
type UserId = string & { readonly __brand: "UserId" };
type OrderId = string & { readonly __brand: "OrderId" };

function getUser(id: UserId): User { /* ... */ }
function getOrder(id: OrderId): Order { /* ... */ }

const userId = "u-123" as UserId;
getOrder(userId); // Compile error -- UserId is not OrderId
```

## Don't

```typescript
function getUser(id: string): User { /* ... */ }
function getOrder(id: string): Order { /* ... */ }

const userId = "u-123";
getOrder(userId); // No error -- nothing prevents passing a user ID
```
