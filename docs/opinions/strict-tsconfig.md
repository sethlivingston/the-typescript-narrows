---
id: strict-tsconfig
title: "Enable strict: true and all strict family flags"
severity: bug-prevention
enforcement: skill-only
confidence: strong
tags: [tsconfig, strictness, configuration]
related: [no-unchecked-index, strict-null-checks]
---

## Stance

Always set `strict: true` in tsconfig.json. Additionally enable `exactOptionalPropertyTypes`. Never disable individual strict flags.

## Why

`strict: true` enables `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitAny`, `noImplicitThis`, `alwaysStrict`, and `useUnknownInCatchVariables`. Each of these catches a distinct class of bugs at compile time. Disabling any one of them opens a hole the compiler would otherwise guard. `exactOptionalPropertyTypes` goes further by distinguishing between "property is missing" and "property is `undefined`."

## Do

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Don't

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": false
  }
}
```

## Exceptions

Legacy migration may disable individual flags temporarily while converting the codebase, but the goal is always full strict mode. Track disabled flags as tech debt and re-enable them incrementally.
