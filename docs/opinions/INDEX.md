# Opinion Index

56 opinions organized by topic. Each links to its opinion file. Severity and enforcement shown per opinion.

Severity: B = bug-prevention, M = maintenance, S = style | Enforcement: both, skill-only

## Type Safety

- [no-explicit-any](no-explicit-any.md) -- Never use explicit `any` [B] [both]
- [prefer-unknown](prefer-unknown.md) -- Use `unknown` for values of uncertain type [B] [both]
- [no-type-assertions](no-type-assertions.md) -- Restrict type assertions to proven-safe patterns [B] [both]
- [no-non-null-assertion](no-non-null-assertion.md) -- Do not use the `!` postfix operator [B] [both]
- [strict-boolean-expressions](strict-boolean-expressions.md) -- Require explicit boolean comparisons [B] [both]
- [use-unknown-in-catch](use-unknown-in-catch.md) -- Type catch clause variables as `unknown` [B] [both]
- [no-unsafe-return](no-unsafe-return.md) -- Do not return unsafe `any`-typed values [B] [both]

## Type Declarations

- [prefer-interface](prefer-interface.md) -- Use interfaces for object shapes, types for unions/intersections/utilities [M] [both]
- [ban-enums](ban-enums.md) -- Ban enums; use `as const` objects with type unions [M] [both]
- [no-namespace](no-namespace.md) -- Do not use TypeScript namespaces [M] [both]
- [consistent-type-imports](consistent-type-imports.md) -- Use `import type` for type-only imports [S] [both]
- [no-const-enum](no-const-enum.md) -- Never use `const enum` [B] [both]
- [explicit-return-types](explicit-return-types.md) -- Require explicit return types on exported functions [M] [both]

## Null Handling & Narrowing

- [exhaustive-switch](exhaustive-switch.md) -- Handle all cases in discriminated union switches [B] [both]
- [prefer-optional-chaining](prefer-optional-chaining.md) -- Use optional chaining over manual null checks [S] [both]
- [no-unnecessary-condition](no-unnecessary-condition.md) -- Do not write conditions that are always true or false [B] [both]
- [prefer-nullish-coalescing](prefer-nullish-coalescing.md) -- Use `??` instead of `||` for nullish fallbacks [B] [both]
- [use-type-narrowing](use-type-narrowing.md) -- Narrow types with guards instead of assertions [B] [skill-only]
- [strict-null-checks](strict-null-checks.md) -- Enable `strictNullChecks` (never disable) [B] [skill-only]
- [prefer-undefined](prefer-undefined.md) -- Prefer `undefined` over `null` [S] [skill-only]

## Async & Promises

- [no-floating-promises](no-floating-promises.md) -- Always handle Promise rejections [B] [both]
- [no-misused-promises](no-misused-promises.md) -- Do not pass Promises where void is expected [B] [both]
- [require-await](require-await.md) -- Do not mark functions `async` unless they use `await` [M] [both]
- [return-await](return-await.md) -- Always `return await` in try/catch blocks [B] [both]
- [prefer-async-await](prefer-async-await.md) -- Use async/await over `.then()` chains [M] [skill-only]

## Iteration and Transforms

- [prefer-for-of](prefer-for-of.md) -- Use `for...of` over `.forEach` [M] [skill-only]
- [no-reduce](no-reduce.md) -- Ban `.reduce` entirely [M] [skill-only]

## Error Handling

- [typed-errors](typed-errors.md) -- Throw only Error subclasses, never primitives [B] [both]
- [result-over-throw](result-over-throw.md) -- Prefer Result types for expected failures, throw for bugs [M] [skill-only]
- [error-discrimination](error-discrimination.md) -- Use discriminated union errors, not string messages [M] [skill-only]
- [no-empty-catch](no-empty-catch.md) -- Do not silently swallow errors with empty catch blocks [B] [both]

## Control Flow

- [prefer-early-return](prefer-early-return.md) -- Fail fast with early returns [M] [skill-only]

## Functions

- [prefer-arrow-functions](prefer-arrow-functions.md) -- Use arrow functions by default [S] [skill-only]

## Immutability & Const

- [prefer-const](prefer-const.md) -- Use `const` by default; `let` only when reassigned [S] [both]
- [no-var](no-var.md) -- Never use `var` [S] [both]
- [prefer-readonly](prefer-readonly.md) -- Mark class properties `readonly` when not reassigned [M] [both]
- [prefer-readonly-params](prefer-readonly-params.md) -- Use `Readonly<T>` and `ReadonlyArray<T>` in function params [M] [both]
- [no-mutable-exports](no-mutable-exports.md) -- Do not export mutable bindings [M] [both]

## Module Organization

- [named-exports-only](named-exports-only.md) -- Use named exports; ban default exports [M] [both]
- [ban-barrel-files](ban-barrel-files.md) -- Do not use barrel files (index.ts re-exports) [M] [both]
- [explicit-imports](explicit-imports.md) -- Import from the source module, not through re-exports [M] [skill-only]
- [no-circular-deps](no-circular-deps.md) -- Avoid circular dependencies [B] [both]

## Naming Conventions

- [naming-convention](naming-convention.md) -- PascalCase types, camelCase values, UPPER_CASE constants [S] [both]
- [no-hungarian-notation](no-hungarian-notation.md) -- Do not prefix type names (no `IUser`, `TConfig`, `EStatus`) [S] [both]
- [boolean-naming](boolean-naming.md) -- Prefix booleans with `is`, `has`, `should`, `can` [S] [skill-only]

## Discriminated Unions

- [single-discriminant](single-discriminant.md) -- Use a single `type` or `kind` field as discriminant [M] [both]
- [no-destructure-before-narrow](no-destructure-before-narrow.md) -- Do not destructure discriminated unions before narrowing [B] [both]
- [exhaustive-discrimination](exhaustive-discrimination.md) -- Always handle all variants of a discriminated union [B] [both]

## Generics & Advanced Types

- [constrain-generics](constrain-generics.md) -- Always constrain generic type parameters [M] [skill-only]
- [no-unnecessary-generics](no-unnecessary-generics.md) -- Do not add type parameters used only once [M] [both]
- [prefer-generics-over-overloads](prefer-generics-over-overloads.md) -- Use generics instead of function overloads when possible [M] [skill-only]
- [variance-annotations](variance-annotations.md) -- Use `in`/`out` variance annotations on generic classes [M] [skill-only]

## Branded & Nominal Types

- [branded-types](branded-types.md) -- Use branded types for domain IDs and value objects [M] [skill-only]

## tsconfig Strictness

- [strict-tsconfig](strict-tsconfig.md) -- Enable `strict: true` and all strict family flags [B] [skill-only]
- [no-unchecked-index](no-unchecked-index.md) -- Enable `noUncheckedIndexedAccess` [B] [skill-only]

## Conditional Types & Advanced Pitfalls

- [conditional-type-safety](conditional-type-safety.md) -- Wrap conditional types to prevent unintended distribution [B] [skill-only]

## Summary

- **Total opinions:** 56
- **Bug prevention:** 24 | **Maintenance:** 23 | **Style:** 9
- **Both (skill + lint):** 37 | **Skill-only:** 19
