# Immutability and Const

## Use `const` by default

**Stance:** Declare all variables with `const`. Use `let` only when the variable will be reassigned.

**Why:** `const` signals intent -- this value does not change. It prevents accidental reassignment and makes code easier to reason about. When you see `let`, you know to look for where the value changes. When everything is `let`, that signal is lost.

**Do:**

```typescript
const items = getItems();
const maxRetries = 3;

let count = 0;
for (const item of items) {
  count++;
}
```

**Don't:**

```typescript
let items = getItems(); // never reassigned
let maxRetries = 3; // never reassigned
```

---

## Never use `var`

**Stance:** Never use `var`. Use `const` or `let`.

**Why:** `var` has function scope (not block scope) and is hoisted, creating surprising behavior. A `var` declared inside an `if` block is visible outside it. `const` and `let` have block scope and are not hoisted, making control flow predictable.

**Do:**

```typescript
const name = "Alice";
let count = 0;
```

**Don't:**

```typescript
var name = "Alice";
var count = 0;
```

---

## Mark class properties `readonly`

**Stance:** Mark class properties `readonly` if they are not reassigned after construction.

**Why:** `readonly` documents intent and prevents accidental mutation. It enables the compiler to detect unintended reassignment during refactoring. Without it, any method in the class can silently overwrite the property.

**Do:**

```typescript
class UserService {
  readonly baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }
}
```

**Don't:**

```typescript
class UserService {
  baseUrl: string; // never reassigned but not marked readonly

  constructor(url: string) {
    this.baseUrl = url;
  }
}
```

---

## Use `Readonly<T>` and `ReadonlyArray<T>` for function parameters

**Stance:** Use `Readonly<T>` for object parameters and `ReadonlyArray<T>` (or `readonly T[]`) for array parameters.

**Why:** Mutable parameters allow functions to silently modify their inputs, creating action-at-a-distance bugs. The caller passes an array expecting it unchanged, but the function mutates it. Readonly parameters make it explicit that the function does not mutate its inputs.

**Do:**

```typescript
function getTotal(items: readonly number[]): number {
  return items.reduce((sum, n) => sum + n, 0);
}
```

**Don't:**

```typescript
function getTotal(items: number[]): number {
  items.sort(); // mutates the caller's array
  return items.reduce((sum, n) => sum + n, 0);
}
```

**Exception:** Third-party types that are not readonly-compatible may need exemption. Performance-critical code that mutates in place may use mutable params with clear documentation.

---

## Do not export mutable bindings

**Stance:** Do not export `let` or `var` bindings. Only export `const`, `function`, and `class` declarations.

**Why:** Exported mutable bindings create shared mutable state across modules. Any importer can read a stale value if another module mutates the export. This makes behavior unpredictable and hard to debug.

**Do:**

```typescript
export const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} as const;
```

**Don't:**

```typescript
export let currentUser: User | null = null;

export function setCurrentUser(user: User): void {
  currentUser = user;
}
```
