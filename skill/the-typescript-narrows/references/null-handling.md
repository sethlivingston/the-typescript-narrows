# Null Handling and Narrowing

## Handle all cases in discriminated union switches

**Stance:** Every switch on a discriminated union must handle all variants. Use a `default: never` check to catch unhandled cases at compile time.

**Why:** Adding a new variant to a union without updating all switch statements causes silent bugs -- the new case falls through or hits a wrong default. A `default: never` assignment turns this into a compile-time error.

**Do:**
```typescript
type Shape =
  | { type: "circle"; radius: number }
  | { type: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.type) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
    default: { const _exhaustive: never = shape; return _exhaustive; }
  }
}
```

**Don't:**
```typescript
function area(shape: Shape): number {
  switch (shape.type) {
    case "circle": return Math.PI * shape.radius ** 2;
    default: return 0; // Swallows new variants silently
  }
}
```

---

## Use optional chaining over manual null checks

**Stance:** Use `?.` optional chaining instead of manual `&&` null checks.

**Why:** Optional chaining is more readable, less error-prone, and avoids the truthy/falsy pitfalls of `&&` chains. A single `?.` replaces multiple guard clauses and communicates intent clearly.

**Do:**
```typescript
const name = user?.profile?.name;
const result = callback?.();
```

**Don't:**
```typescript
const name = user && user.profile && user.profile.name;
const result = callback ? callback() : undefined;
```

---

## Do not write conditions that are always true or false

**Stance:** Do not write conditions the type system can prove are always true or always false.

**Why:** An always-true condition is dead code that misleads readers. An always-false condition hides unreachable code. Both indicate a mismatch between what the developer believes and what the compiler knows -- often a sign of a real bug elsewhere.

**Do:**
```typescript
function greet(name: string | null) {
  if (name !== null) {
    console.log(`Hello, ${name}`);
  }
}
```

**Don't:**
```typescript
function greet(name: string) {
  if (name !== null) { // Always true -- string cannot be null
    console.log(`Hello, ${name}`);
  }
}
```

---

## Use `??` instead of `||` for nullish fallbacks

**Stance:** Use `??` (nullish coalescing) instead of `||` (logical OR) for default values.

**Why:** `||` falls through on `0`, `""`, and `false`, which are often valid values. `??` only falls through on `null` and `undefined`, preserving intentional falsy values.

**Do:**
```typescript
const port = config.port ?? 3000;
const name = user.name ?? "Anonymous";
```

**Don't:**
```typescript
const port = config.port || 3000; // Treats 0 as missing
const name = user.name || "Anonymous"; // Treats "" as missing
```

---

## Narrow types with guards instead of assertions

**Stance:** Use type guard functions, `typeof`, `instanceof`, and `in` checks to narrow types. Do not use `as` assertions to "narrow."

**Why:** Type guards are checked at runtime -- if the check fails, you handle it. Assertions are unchecked -- if wrong, you get a runtime crash that the compiler promised would not happen.

**Do:**
```typescript
function isUser(value: unknown): value is User {
  return typeof value === "object"
    && value !== null && "id" in value;
}

if (isUser(data)) {
  console.log(data.id); // Safely narrowed
}
```

**Don't:**
```typescript
const user = data as User; // No runtime check
console.log(user.id); // Crashes if data is not a User
```

---

## Enable `strictNullChecks` (never disable)

**Stance:** Never set `strictNullChecks: false`. This flag is included in `strict: true` and must remain enabled.

**Why:** Without `strictNullChecks`, every type implicitly includes `null` and `undefined`. The compiler cannot catch null dereference bugs, which are the most common source of runtime crashes in JavaScript and TypeScript applications.

**Do:**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**Don't:**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strictNullChecks": false // Disables null safety
  }
}
```
