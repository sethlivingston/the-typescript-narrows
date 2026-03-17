# Discriminated Unions

## Use a single `type` or `kind` field as the discriminant

**Stance:** Use a single string literal field named `type` (or `kind` in AST contexts) as the discriminant for union types. Do not use multiple fields or boolean combinations.

**Why:** A single discriminant field enables TypeScript's built-in narrowing via `switch` and `if` checks. Multiple discriminant fields require complex intersection checks the compiler cannot narrow automatically. A single `type` field also makes the union self-documenting -- you can read all variants at a glance.

**Do:**

```typescript
type Shape =
  | { type: "circle"; radius: number }
  | { type: "rect"; width: number; height: number };

function describe(shape: Shape): string {
  switch (shape.type) {
    case "circle": return `circle r=${shape.radius}`;
    case "rect": return `rect ${shape.width}x${shape.height}`;
  }
}
```

**Don't:**

```typescript
type Shape = {
  isCircle: boolean;
  radius?: number;
  width?: number;
  height?: number;
};
```

Using booleans or optional fields forces manual checks and TypeScript cannot narrow to the correct variant.

---

## Do not destructure discriminated unions before narrowing

**Stance:** Always narrow a discriminated union via `switch` or `if` on the discriminant before destructuring its properties.

**Why:** Destructuring before narrowing severs the type connection between the discriminant and variant-specific fields. TypeScript cannot narrow destructured variables -- only the original object retains the union relationship. Accessing variant fields on the destructured rest object produces type errors or `any`.

**Do:**

```typescript
function handle(result: Result) {
  if (result.type === "success") {
    const { value } = result; // narrowed to SuccessResult
    console.log(value);
  }
}
```

**Don't:**

```typescript
function handle(result: Result) {
  const { type, ...rest } = result;
  if (type === "success") {
    console.log(rest.value); // rest is not narrowed
  }
}
```

---

## Always handle all variants of a discriminated union

**Stance:** When processing a discriminated union, handle every variant. Use `switch` with a `default: never` guard, or `if`/`else` chains the compiler can verify are exhaustive.

**Why:** Unhandled variants are silent bugs -- the code path falls through or hits a catch-all that does the wrong thing. Adding a new variant to the union should cause compile errors everywhere it is not handled, making it impossible to forget.

**Do:**

```typescript
function area(shape: Shape): number {
  switch (shape.type) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rect": return shape.width * shape.height;
    default: {
      const _exhaustive: never = shape;
      throw new Error("Unhandled shape");
    }
  }
}
```

**Don't:**

```typescript
function area(shape: Shape): number {
  switch (shape.type) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rect": return shape.width * shape.height;
    default: return 0; // silently ignores new variants
  }
}
```
