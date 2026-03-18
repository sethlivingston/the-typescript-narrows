# Module Organization

## Use named exports

**Stance:** Use named exports exclusively. Do not use default exports.

**Why:** Default exports have no canonical name -- importers can name them anything, making it impossible to grep for usages. Named exports enforce a single name, improving discoverability and refactoring. Renaming a named export produces compile errors at every import site; renaming a default export produces nothing.

**Do:**

```typescript
export function createUser(name: string): User {
  return { id: generateId(), name };
}

// consumer
import { createUser } from "./user";
```

**Don't:**

```typescript
export default function (name: string): User {
  return { id: generateId(), name };
}

// consumer -- name is arbitrary
import whatever from "./user";
```

**Exception:** Frameworks that require default exports (Next.js pages, Storybook stories) at specific file paths.

---

## Do not use barrel files

**Stance:** Do not create `index.ts` files that re-export from other modules (barrel files).

**Why:** Barrel files defeat tree-shaking -- importing one symbol pulls in all re-exports. They create circular dependency risks, slow down IDE auto-imports, and hide the actual module structure. A barrel that re-exports from 20 files forces the bundler and type checker to load all 20 even when you need one.

**Do:**

```typescript
import { User } from "./models/user";
import { Order } from "./models/order";
```

**Don't:**

```typescript
// models/index.ts -- barrel file
export { User } from "./user";
export { Order } from "./order";
export { Product } from "./product";

// consumer -- imports through barrel
import { User } from "./models";
```

---

## Import from the source module

**Stance:** Import directly from the module that defines the symbol. Do not import through intermediate re-export files.

**Why:** Direct imports create a clear dependency graph -- you can trace exactly where each symbol comes from. Re-export chains obscure the actual source and create unnecessary coupling between modules. When a re-export file changes, all consumers are affected even if the source module did not change.

**Do:**

```typescript
import { validateEmail } from "./validators/email";
import { validatePhone } from "./validators/phone";
```

**Don't:**

```typescript
// Imports through a re-export barrel
import { validateEmail } from "./validators";
import { validatePhone } from "./validators";
```

---

## Avoid circular dependencies

**Stance:** Do not create circular dependency chains between modules.

**Why:** Circular dependencies cause partially initialized modules -- a module may import from another that has not finished executing yet, resulting in `undefined` imports at runtime. They also indicate tangled architecture where responsibilities are not cleanly separated.

**Do:**

```typescript
// shared/types.ts -- extract shared types
export interface User { id: string; name: string; }

// user-service.ts
import { User } from "./shared/types";

// auth-service.ts
import { User } from "./shared/types";
```

**Don't:**

```typescript
// a.ts imports from b.ts
import { formatUser } from "./b";

// b.ts imports from a.ts -- circular!
import { getUser } from "./a";
```
