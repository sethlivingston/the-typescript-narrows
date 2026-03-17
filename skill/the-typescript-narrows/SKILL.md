---
name: the-typescript-narrows
description: Provides a single, well-reasoned TypeScript opinion for every common decision point. Eliminates the "multiple ways to do it" problem when writing, refactoring, or reviewing TypeScript code. Use when generating TypeScript, performing TypeScript code review, or deciding between multiple valid TypeScript patterns.
---

# The TypeScript Narrows

One opinion per decision point. When TypeScript gives you five valid ways, this skill picks one and tells you why.

## How to use this skill

Apply these opinions when writing new TypeScript code, refactoring existing code, or reviewing pull requests. Each opinion has a stance (what to do), a rationale (why), and do/don't examples in the reference files.

**Severity tiers** indicate impact level:

| Tag | Tier | Meaning |
|-----|------|---------|
| [B] | Bug prevention | Can cause runtime errors, data corruption, or silent wrong behavior |
| [M] | Maintenance | Makes code harder to understand, refactor, or extend over time |
| [S] | Style | Consistency and readability with no functional impact |

**Exception clause:** All opinions allow exceptions when there is no other viable alternative. If you must deviate, document why in a code comment. Convenience alone is not a valid exception.

## Type Safety

- Never use explicit `any`; use `unknown` and narrow before use. [B]
- Use `unknown` for values of uncertain type to force callers to narrow. [B]
- Restrict type assertions to proven-safe patterns only. [B]
- Do not use the `!` non-null assertion operator; use proper null checks. [B]
- Require explicit boolean comparisons; no truthy/falsy shortcuts. [B]
- Type catch clause variables as `unknown`; never assume error shape. [B]
- Do not return unsafe `any`-typed values from functions. [B]

For rationale and examples: [references/type-safety.md](references/type-safety.md)

## Type Declarations

- Use interfaces for object shapes; use type aliases for unions, intersections, and utilities. [M]
- Ban enums (including `const enum`); use `as const` objects with type unions instead. [B]
- Do not use TypeScript namespaces; use ES modules. [M]
- Use `import type` for type-only imports. [S]
- Require explicit return types on exported functions; internal functions can rely on inference. [M]

For rationale and examples: [references/type-declarations.md](references/type-declarations.md)

## Null Handling and Narrowing

- Use optional chaining over manual null checks. [S]
- Do not write conditions that are always true or always false. [B]
- Use `??` instead of `||` for nullish fallbacks. [B]
- Narrow types with type guards instead of type assertions. [B]
- Enable `strictNullChecks` and never disable it. [B]
- Prefer `undefined` over `null`; match JavaScript's natural defaults. [S]

For rationale and examples: [references/null-handling.md](references/null-handling.md)

## Async and Promises

- Always handle Promise rejections; never leave a Promise floating. [B]
- Do not pass Promises where void callbacks are expected. [B]
- Do not mark functions `async` unless they use `await`. [M]
- Always `return await` inside try/catch blocks. [B]
- Use async/await over `.then()` chains. [M]

For rationale and examples: [references/async-promises.md](references/async-promises.md)

## Iteration and Transforms

- Use `for...of` over `.forEach()`; forEach swallows break/continue/return/await. [M]
- Do not use `.reduce()`; use `for...of` or `.map`/`.filter` combinations. [M]

For rationale and examples: [references/iteration.md](references/iteration.md)

## Error Handling

- Throw only Error subclasses; never throw primitives or plain objects. [B]
- Prefer Result types for expected failures; reserve throw for bugs. [M]
- Use discriminated union errors for error categories, not string messages. [M]
- Never swallow errors with empty catch blocks. [B]
- Wrap errors with `{ cause: err }` when rethrowing; never discard the original error. [M]

For rationale and examples: [references/error-handling.md](references/error-handling.md)

## Control Flow

- Return early for preconditions; keep the happy path left-aligned. [M]

For rationale and examples: [references/control-flow.md](references/control-flow.md)

## Functions

- Use arrow functions by default; use function declarations only when hoisting is needed. [S]
- Accept interfaces in function parameters; return concrete types. [M]

For rationale and examples: [references/functions.md](references/functions.md)

## Immutability and Const

- Use `const` by default; use `let` only when reassignment is required. [S]
- Never use `var`. [S]
- Mark class properties `readonly` when they are not reassigned. [M]
- Use `Readonly<T>` and `ReadonlyArray<T>` for function parameters. [M]
- Do not export mutable bindings. [M]

For rationale and examples: [references/immutability.md](references/immutability.md)

## Module Organization

- Use named exports; ban default exports. [M]
- Do not use barrel files (index.ts re-exports). [M]
- Import from the source module, not through re-exports. [M]
- Avoid circular dependencies between modules. [B]

For rationale and examples: [references/modules.md](references/modules.md)

## Naming Conventions

- Use PascalCase for types, camelCase for values, UPPER_CASE for constants. [S]
- Do not prefix type names with `I`, `T`, or `E` (no Hungarian notation). [S]
- Prefix boolean variables with `is`, `has`, `should`, or `can`. [S]

For rationale and examples: [references/naming.md](references/naming.md)

## Discriminated Unions

- Use a single `type` or `kind` field as the discriminant property. [M]
- Do not destructure discriminated unions before narrowing. [B]
- Always handle all variants of a discriminated union exhaustively. [B]

For rationale and examples: [references/discriminated-unions.md](references/discriminated-unions.md)

## Generics and Advanced Types

- Always constrain generic type parameters with `extends`. [M]
- Do not add type parameters that are used only once. [M]
- Use generics instead of function overloads when possible. [M]
- Use `in`/`out` variance annotations on generic classes and interfaces. [M]
- Use branded types for domain IDs and value objects. [M]

For rationale and examples: [references/generics.md](references/generics.md)

## Resource Management

- Use `using` and `await using` to bind resource lifetimes to scope; never rely on manual try/finally cleanup. [B]

For rationale and examples: [references/resource-management.md](references/resource-management.md)

## tsconfig and Advanced Pitfalls

- Enable `strict: true` and all strict family flags. [B]
- Enable `noUncheckedIndexedAccess` for safe index access. [B]
- Wrap conditional types in `[T]` to prevent unintended distribution over unions. [B]

For rationale and examples: [references/tsconfig-advanced.md](references/tsconfig-advanced.md)
