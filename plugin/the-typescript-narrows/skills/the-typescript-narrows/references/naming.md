# Naming Conventions

## PascalCase types, camelCase values, UPPER_CASE constants

**Stance:** Use PascalCase for types, interfaces, classes, and enums. Use camelCase for variables, functions, methods, and parameters. Use UPPER_CASE for module-level constants.

**Why:** Consistent casing makes it immediately clear whether a symbol is a type or a value. This is the dominant convention in the TypeScript ecosystem. When the entire codebase follows the same rules, you never have to guess whether `UserProfile` is a class or a variable -- the casing tells you.

**Do:**

```typescript
interface UserProfile {
  displayName: string;
}

const maxRetries = 3;
const MAX_TIMEOUT = 5000;

function formatName(user: UserProfile): string {
  return user.displayName;
}
```

**Don't:**

```typescript
interface userProfile {
  DisplayName: string;
}

const MaxRetries = 3;
const max_timeout = 5000;
```

---

## Do not use Hungarian notation

**Stance:** Do not prefix interfaces with `I`, types with `T`, or enums with `E`.

**Why:** Hungarian notation is a C#/Java convention that adds noise in TypeScript. The language's structural type system makes prefixes redundant -- the usage context already tells you whether something is a type. Prefixes also create friction when refactoring: renaming an interface to a type alias should not require renaming every reference.

**Do:**

```typescript
interface User {
  id: string;
  name: string;
}

type Config = {
  port: number;
};
```

**Don't:**

```typescript
interface IUser {
  id: string;
  name: string;
}

type TConfig = {
  port: number;
};
```

---

## Prefix booleans with verb prefixes

**Stance:** Name boolean variables and parameters with a verb prefix: `is`, `has`, `should`, `can`, `will`, `did`.

**Why:** Boolean names without prefixes are ambiguous. `disabled` could be a verb (an action to perform) or an adjective (a current state). `isDisabled` is unambiguously a boolean state. Verb prefixes also make conditionals read like English: `if (isVisible)` reads naturally, while `if (visible)` does not clearly indicate a boolean check.

**Do:**

```typescript
const isVisible = true;
const hasPermission = user.roles.includes("admin");
const shouldRetry = attempts < maxRetries;
const canEdit = hasPermission && !isLocked;
```

**Don't:**

```typescript
const visible = true;
const permission = user.roles.includes("admin");
const retry = attempts < maxRetries;
const edit = permission && !locked;
```
