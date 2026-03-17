# tsconfig and Advanced Pitfalls

## Enable `strict: true` and all strict family flags

**Stance:** Always set `strict: true` in tsconfig.json. Additionally enable `exactOptionalPropertyTypes`. Never disable individual strict flags.

**Why:** `strict: true` enables `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitAny`, `noImplicitThis`, `alwaysStrict`, and `useUnknownInCatchVariables`. Each catches a distinct class of bugs at compile time. Disabling any one opens a hole the compiler would otherwise guard. `exactOptionalPropertyTypes` goes further by distinguishing between "property is missing" and "property is `undefined`."

**Do:**

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Don't:**

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": false
  }
}
```

**Exception:** Legacy migration may disable individual flags temporarily while converting the codebase, but the goal is always full strict mode. Track disabled flags as tech debt and re-enable them incrementally.

---

## Enable `noUncheckedIndexedAccess` for safe index access

**Stance:** Enable `noUncheckedIndexedAccess` in tsconfig.json.

**Why:** Without this flag, `array[0]` returns `T` instead of `T | undefined`, and `record["key"]` returns `V` instead of `V | undefined`. This hides potential undefined access that causes runtime crashes. With the flag enabled, the compiler forces you to handle the possibility that an index access returns `undefined`.

**Do:**

```json
{
  "compilerOptions": {
    "noUncheckedIndexedAccess": true
  }
}
```

```typescript
const items = ["a", "b", "c"];
const first = items[0];
if (first !== undefined) {
  console.log(first.toUpperCase());
}
```

**Don't:**

```typescript
const items = ["a", "b", "c"];
const first = items[0];
console.log(first.toUpperCase()); // crashes if array is empty
```

---

## Wrap conditional types in `[T]` to prevent unintended distribution

**Stance:** Wrap both sides of a conditional type in `[T]` (tuple) to prevent distributive behavior when it is not intended.

**Why:** Conditional types distribute over unions by default: `IsString<"a" | 1>` becomes `IsString<"a"> | IsString<1>` instead of evaluating the union as a whole. This causes unexpected results when the intent is to check the union itself, not each member individually.

**Do:**

```typescript
type IsString<T> = [T] extends [string] ? true : false;

type Test = IsString<"a" | 1>; // false (evaluates the full union)
```

**Don't:**

```typescript
type IsString<T> = T extends string ? true : false;

type Test = IsString<"a" | 1>; // boolean (distributes: true | false)
```
