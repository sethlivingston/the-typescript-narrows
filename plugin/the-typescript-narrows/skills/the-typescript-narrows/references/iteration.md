# Iteration and Transforms

## Use `for...of` over `.forEach`

**Stance:** Use `for...of` loops instead of `.forEach()`.

**Why:** `.forEach` swallows `break`, `continue`, and `return` -- the callback is a separate function scope, so `return` only exits the callback, not the enclosing function. It cannot use `await` correctly: marking the callback `async` produces fire-and-forget promises that run concurrently instead of sequentially. The closure safety myth does not hold either -- `for...of` with `const` or `let` gives a fresh binding per iteration, identical to `.forEach`.

**Do:**
```typescript
for (const item of items) {
  await process(item);
}
```

**Don't:**
```typescript
items.forEach(async (item) => {
  await process(item); // Runs all concurrently, not sequentially
});
```

---

## Ban `.reduce` entirely

**Stance:** Do not use `.reduce()`. Use `for...of` or `.map`/`.filter` combinations instead.

**Why:** `.reduce` forces the reader to mentally simulate an accumulator through every iteration. A `for...of` loop with a mutable accumulator or a `.map`/`.filter` chain expresses the same logic more directly. No "trivial case" exception -- zero ambiguity about when to use it.

**Do:**
```typescript
const totals: Record<string, number> = {};
for (const item of items) {
  totals[item.category] = (totals[item.category] ?? 0) + item.amount;
}
```

**Don't:**
```typescript
const totals = items.reduce<Record<string, number>>((acc, item) => {
  acc[item.category] = (acc[item.category] ?? 0) + item.amount;
  return acc;
}, {});
```
