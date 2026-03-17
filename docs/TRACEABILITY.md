# Traceability Matrix

Generated: 2026-03-17 | Opinions: 59 | Covered: 35 | Skill-only: 22 | Gaps: 2

## Coverage

| Opinion ID | Title | Severity | Enforcement | Skill Reference | Lint Rule(s) | Status |
|------------|-------|----------|-------------|-----------------|--------------|--------|
| accept-interfaces | Accept interfaces, return concrete types | M | skill-only | functions.md | -- | skill-only |
| ban-barrel-files | Do not use barrel files (index.ts re-exports) | M | both | modules.md | typescript-narrows/ban-barrel-files | covered |
| ban-enums | Ban enums; use as const objects with type unions | M | both | generics.md | typescript-narrows/ban-enums | covered |
| boolean-naming | Prefix booleans with is, has, should, can | S | skill-only | naming.md | -- | skill-only |
| branded-types | Use branded types for domain IDs and value objects | M | skill-only | generics.md | -- | skill-only |
| conditional-type-safety | Wrap conditional types to prevent unintended distribution | B | skill-only | tsconfig-advanced.md | -- | skill-only |
| consistent-type-imports | Use import type for type-only imports | S | both | generics.md | @typescript-eslint/consistent-type-imports | covered |
| constrain-generics | Always constrain generic type parameters | M | skill-only | generics.md | -- | skill-only |
| error-discrimination | Use discriminated union errors, not string messages | M | skill-only | discriminated-unions.md | -- | skill-only |
| exhaustive-discrimination | Always handle all variants of a discriminated union | B | both | discriminated-unions.md | @typescript-eslint/switch-exhaustiveness-check | covered |
| exhaustive-switch | Handle all cases in discriminated union switches | B | both | discriminated-unions.md | @typescript-eslint/switch-exhaustiveness-check | covered |
| explicit-imports | Import from the source module, not through re-exports | M | skill-only | modules.md | -- | skill-only |
| explicit-return-types | Require explicit return types on exported functions | M | both | type-declarations.md | @typescript-eslint/explicit-function-return-type | covered |
| named-exports-only | Use named exports; ban default exports | M | both | modules.md | import/no-default-export | covered |
| naming-convention | PascalCase types, camelCase values, UPPER_CASE constants | S | both | naming.md | @typescript-eslint/naming-convention | covered |
| no-circular-deps | Avoid circular dependencies | B | both | modules.md | import/no-cycle | covered |
| no-const-enum | Never use const enum | B | both | type-declarations.md | typescript-narrows/ban-enums | covered |
| no-destructure-before-narrow | Do not destructure discriminated unions before narrowing | B | both | discriminated-unions.md | typescript-narrows/no-destructure-before-narrow | gap |
| no-empty-catch | Do not silently swallow errors with empty catch blocks | B | both | error-handling.md | no-empty | covered |
| no-explicit-any | Never use explicit any | B | both | type-safety.md | @typescript-eslint/no-explicit-any | covered |
| no-floating-promises | Always handle Promise rejections | B | both | async-promises.md | @typescript-eslint/no-floating-promises | covered |
| no-hungarian-notation | Do not prefix type names (no IUser, TConfig, EStatus) | S | both | type-declarations.md | @typescript-eslint/naming-convention | covered |
| no-misused-promises | Do not pass Promises where void is expected | B | both | async-promises.md | @typescript-eslint/no-misused-promises | covered |
| no-mutable-exports | Do not export mutable bindings | M | both | immutability.md | import/no-mutable-exports | covered |
| no-namespace | Do not use TypeScript namespaces | M | both | type-declarations.md | @typescript-eslint/no-namespace | covered |
| no-non-null-assertion | Do not use the ! postfix operator | B | both | async-promises.md | @typescript-eslint/no-non-null-assertion | covered |
| no-reduce | Ban .reduce entirely | M | skill-only | iteration.md | -- | skill-only |
| no-type-assertions | Restrict type assertions to proven-safe patterns | B | both | type-safety.md | @typescript-eslint/consistent-type-assertions | covered |
| no-unchecked-index | Enable noUncheckedIndexedAccess | B | skill-only | tsconfig-advanced.md | -- | skill-only |
| no-unnecessary-condition | Do not write conditions that are always true or false | B | both | generics.md | @typescript-eslint/no-unnecessary-condition | covered |
| no-unnecessary-generics | Do not add type parameters used only once | M | both | generics.md | @typescript-eslint/no-unnecessary-type-parameters | covered |
| no-unsafe-return | Do not return unsafe any-typed values | B | both | type-safety.md | @typescript-eslint/no-unsafe-return | covered |
| no-var | Never use var | S | both | immutability.md | no-var | covered |
| prefer-arrow-functions | Use arrow functions by default | S | skill-only | functions.md | -- | skill-only |
| prefer-async-await | Use async/await over .then() chains | M | skill-only | async-promises.md | -- | skill-only |
| prefer-const | Use const by default; let only when reassigned | S | both | immutability.md | prefer-const | covered |
| prefer-early-return | Fail fast with early returns | M | skill-only | control-flow.md | -- | skill-only |
| prefer-for-of | Use for...of over .forEach | M | skill-only | iteration.md | -- | skill-only |
| prefer-generics-over-overloads | Use generics instead of function overloads when possible | M | skill-only | generics.md | -- | skill-only |
| prefer-interface | Use interfaces for object shapes, types for unions/intersections/utilities | M | both | error-handling.md | @typescript-eslint/consistent-type-definitions | covered |
| prefer-nullish-coalescing | Use ?? instead of || for nullish fallbacks | B | both | null-handling.md | @typescript-eslint/prefer-nullish-coalescing | covered |
| prefer-optional-chaining | Use optional chaining over manual null checks | S | both | null-handling.md | @typescript-eslint/prefer-optional-chain | covered |
| prefer-readonly | Mark class properties readonly when not reassigned | M | both | immutability.md | @typescript-eslint/prefer-readonly | covered |
| prefer-readonly-params | Use Readonly<T> and ReadonlyArray<T> in function params | M | both | immutability.md | @typescript-eslint/prefer-readonly-parameter-types | covered |
| prefer-undefined | Prefer undefined over null | S | skill-only | null-handling.md | -- | skill-only |
| prefer-unknown | Use unknown for values of uncertain type | B | both | generics.md | @typescript-eslint/no-unsafe-assignment | covered |
| prefer-using-declarations | Use `using` declarations to tie resource lifetimes to scope | B | skill-only | resource-management.md | -- | skill-only |
| require-await | Do not mark functions async unless they use await | M | both | async-promises.md | @typescript-eslint/require-await | covered |
| result-over-throw | Prefer Result types for expected failures, throw for bugs | M | skill-only | error-handling.md | -- | skill-only |
| return-await | Always return await in try/catch blocks | B | both | async-promises.md | @typescript-eslint/return-await | covered |
| single-discriminant | Use a single type or kind field as discriminant | M | both | discriminated-unions.md | typescript-narrows/single-discriminant | gap |
| strict-boolean-expressions | Require explicit boolean comparisons | B | both | type-safety.md | @typescript-eslint/strict-boolean-expressions | covered |
| strict-null-checks | Enable strictNullChecks (never disable) | B | skill-only | null-handling.md | -- | skill-only |
| strict-tsconfig | Enable strict: true and all strict family flags | B | skill-only | tsconfig-advanced.md | -- | skill-only |
| typed-errors | Throw only Error subclasses, never primitives | B | both | error-handling.md | @typescript-eslint/only-throw-error | covered |
| use-type-narrowing | Narrow types with guards instead of assertions | B | skill-only | null-handling.md | -- | skill-only |
| use-unknown-in-catch | Type catch clause variables as unknown | B | both | type-safety.md | @typescript-eslint/use-unknown-in-catch-callback-variable | covered |
| variance-annotations | Use in/out variance annotations on generic classes | M | skill-only | generics.md | -- | skill-only |
| wrap-error-cause | Wrap errors with cause when rethrowing | M | skill-only | error-handling.md | -- | skill-only |

## Gaps

| Opinion ID | Title | Enforcement | Issue |
|------------|-------|-------------|-------|
| no-destructure-before-narrow | Do not destructure discriminated unions before narrowing | both | lint rule not in strict config |
| single-discriminant | Use a single type or kind field as discriminant | both | lint rule not in strict config |
