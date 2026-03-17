# Type Declarations

## Use interfaces for object shapes, types for unions/intersections/utilities

**Stance:** Use `interface` for object shapes (data contracts, props, configs). Use `type` for unions, intersections, mapped types, and utility types.

**Why:** Interfaces are extendable and produce better error messages. Types are required for unions and intersections. Consistent usage eliminates the daily "type or interface?" decision. The keyword itself communicates intent: `interface` means "this is a shape," `type` means "this is a combination or transformation."

**Do:**
```typescript
interface User {
  id: string;
  name: string;
}

type Result = Success | Failure;
type Nullable<T> = T | null;
```

**Don't:**
```typescript
type User = {
  id: string;
  name: string;
}; // Plain object shape -- use interface
```

---

## Ban enums; use `as const` objects with type unions

**Stance:** Do not use TypeScript enums. Use `as const` objects with derived type unions instead.

**Why:** Enums generate runtime code, have surprising behaviors (reverse mappings on numeric enums, `const enum` inlining issues), and cannot be tree-shaken. `as const` objects are plain JavaScript with full type safety, work with every bundler, and produce predictable output.

**Do:**
```typescript
const Status = {
  Active: "active",
  Inactive: "inactive",
} as const;

type Status = (typeof Status)[keyof typeof Status];
```

**Don't:**
```typescript
enum Status {
  Active = "active",
  Inactive = "inactive",
}
```

---

## Do not use TypeScript namespaces

**Stance:** Never use `namespace`. Use ES modules for code organization.

**Why:** Namespaces are a legacy TypeScript feature that predates ES modules. They create unnecessary indirection, do not work with tree-shaking, and confuse developers who expect standard module semantics.

**Do:**
```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// consumer.ts
import { add } from "./math";
```

**Don't:**
```typescript
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b;
  }
}
```

---

## Use `import type` for type-only imports

**Stance:** Use `import type` for imports that are only used as types and erased at compile time.

**Why:** `import type` makes the compile-time vs runtime distinction explicit. It enables better tree-shaking, prevents accidental side effects from type-only imports, and communicates intent.

**Do:**
```typescript
import type { User } from "./types";
import { createUser } from "./users";

function greet(user: User): string {
  return `Hello, ${user.name}`;
}
```

**Don't:**
```typescript
import { User } from "./types"; // User is only a type
import { createUser } from "./users";

function greet(user: User): string {
  return `Hello, ${user.name}`;
}
```

---

## Never use `const enum`

**Stance:** Never use `const enum`. Use `as const` objects instead.

**Why:** `const enum` values are inlined at compile time, which breaks when declaration files are consumed by other packages. The values disappear from the bundle, causing runtime errors in consumers. Additionally, `--isolatedModules` (required by most modern bundlers) forbids `const enum` across files.

**Do:**
```typescript
const Direction = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;

type Direction = (typeof Direction)[keyof typeof Direction];
```

**Don't:**
```typescript
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```
