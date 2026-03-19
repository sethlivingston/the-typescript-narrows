# Generics and Advanced Types

## Always constrain generic type parameters with `extends`

**Stance:** Every generic type parameter should have an `extends` constraint. Unconstrained `<T>` should be rare and intentional.

**Why:** Unconstrained generics accept any type including `never`, `void`, and other edge cases. Constraints document the expected shape and catch misuse at the call site. Without a constraint, callers can pass types that compile but produce nonsensical results.

**Do:**

```typescript
function merge<T extends object>(a: T, b: Partial<T>): T {
  return { ...a, ...b };
}
```

**Don't:**

```typescript
function merge<T>(a: T, b: Partial<T>): T {
  return { ...a, ...b }; // accepts primitives, which Partial does not affect
}
```

---

## Do not add type parameters that are used only once

**Stance:** Do not introduce a generic type parameter that appears only once in the function signature. If a type parameter does not relate two or more values, it adds complexity without benefit.

**Why:** A type parameter used once is equivalent to its constraint. `<T extends string>(x: T): void` is the same as `(x: string): void` -- the generic adds cognitive overhead without enabling anything. Generics should relate inputs to outputs or inputs to each other.

**Do:**

```typescript
function identity<T>(value: T): T {
  return value; // T relates input to output
}
```

**Don't:**

```typescript
function log<T extends string>(message: T): void {
  console.log(message); // T used once -- just use string
}
```

---

## Use generics instead of function overloads when possible

**Stance:** Prefer a single generic signature over multiple function overloads when the overloads differ only in type.

**Why:** Overloads create maintenance burden -- each signature must be kept in sync. Generic signatures express the relationship once. Overloads are also harder for callers to understand when there are many variants.

**Do:**

```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((k) => { result[k] = obj[k]; });
  return result;
}
```

**Don't:**

```typescript
function pick(obj: User, keys: ("name" | "email")[]): Pick<User, "name" | "email">;
function pick(obj: Order, keys: ("id" | "total")[]): Pick<Order, "id" | "total">;
function pick(obj: any, keys: string[]): any {
  // repeated for each type
}
```

**Exception:** Overloads are appropriate when the return type changes based on input in ways generics cannot express, or when the implementations are genuinely different.

---

## Use `in`/`out` variance annotations on generic classes and interfaces

**Stance:** Use `in` and `out` variance annotations on generic class and interface type parameters to make variance explicit.

**Why:** Without annotations, TypeScript infers variance from usage, which can change unexpectedly when code is modified. Explicit annotations document the intended variance and cause compile errors if the implementation violates it. This prevents subtle assignability bugs during refactoring.

**Do:**

```typescript
interface Producer<out T> {
  get(): T;
}

interface Consumer<in T> {
  accept(value: T): void;
}
```

**Don't:**

```typescript
interface Producer<T> {
  get(): T; // variance is inferred, may change silently
}

interface Consumer<T> {
  accept(value: T): void;
}
```

---

## Use branded types for domain IDs and value objects

**Stance:** Use branded types to prevent accidental mixing of structurally identical but semantically different values (user IDs vs order IDs, raw strings vs sanitized strings).

**Why:** TypeScript uses structural typing -- `string` is `string` regardless of what it represents. Branded types add a phantom property that makes the compiler distinguish between `UserId` and `OrderId`, catching mix-ups at compile time instead of at runtime.

**Do:**

```typescript
type UserId = string & { readonly __brand: "UserId" };
type OrderId = string & { readonly __brand: "OrderId" };

function getUser(id: UserId): User { /* ... */ }
function getOrder(id: OrderId): Order { /* ... */ }

const userId = "u-123" as UserId;
getOrder(userId); // Compile error -- UserId is not OrderId
```

**Don't:**

```typescript
function getUser(id: string): User { /* ... */ }
function getOrder(id: string): Order { /* ... */ }

const userId = "u-123";
getOrder(userId); // No error -- nothing prevents passing a user ID
```
