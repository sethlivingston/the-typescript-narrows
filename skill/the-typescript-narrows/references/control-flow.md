# Control Flow

## Fail fast with early returns

**Stance:** Return early for preconditions and error cases. Keep the happy path left-aligned.

**Why:** Deeply nested if/else blocks obscure the main logic path. Guard clauses at the top of a function handle edge cases first, letting the reader focus on the happy path without tracking nesting levels. This is the Go-style guard clause pattern -- handle errors at the gate, not in the basement.

**Do:**
```typescript
function processOrder(order: Order): Result {
  if (!order.items.length) return { error: "empty-order" };
  if (!order.customer) return { error: "no-customer" };
  if (order.total <= 0) return { error: "invalid-total" };

  const receipt = generateReceipt(order);
  return { data: receipt };
}
```

**Don't:**
```typescript
function processOrder(order: Order): Result {
  if (order.items.length) {
    if (order.customer) {
      if (order.total > 0) {
        const receipt = generateReceipt(order);
        return { data: receipt };
      } else {
        return { error: "invalid-total" };
      }
    } else {
      return { error: "no-customer" };
    }
  } else {
    return { error: "empty-order" };
  }
}
```
