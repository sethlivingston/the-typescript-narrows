# Feature Research

**Domain:** Opinionated TypeScript guidance ecosystem (Claude skill + ESLint plugin)
**Researched:** 2026-03-16
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Type vs interface opinion** | The single most asked "which should I use?" question in TS. Every opinionated guide takes a stance. | LOW | Google style guide says interfaces for objects. We should agree and provide rationale. ESLint rule: `@typescript-eslint/consistent-type-definitions` already exists -- configure it. |
| **Enum stance** | Enums are the most controversial TS feature. Users expect a clear "use X instead" opinion. | MEDIUM | Options: ban enums entirely (use `as const` objects), allow string enums only, or follow Google (plain enum, no const enum). Recommend: ban enums, prefer `as const` + type union. Needs custom rule for enforcement beyond what `no-restricted-syntax` provides. |
| **`any` elimination** | Every strict TS config bans `any`. Table stakes for anything calling itself "opinionated." | LOW | typescript-eslint strict already covers this (`no-explicit-any`, `no-unsafe-*` family). Configure and extend; do not reinvent. |
| **Type assertion restrictions** | Assertions bypass safety. Users expect guidance on when/how. | LOW | typescript-eslint has `consistent-type-assertions`, `no-non-null-assertion`, `no-unsafe-type-assertion`. Configure strictly. Skill adds nuanced guidance on the rare legitimate cases. |
| **Strict null handling** | `strictNullChecks` is baseline. Opinions on narrowing patterns are expected. | LOW | Mostly skill guidance (narrowing patterns, guard functions, exhaustive checks). Lint: `no-unnecessary-condition`, `strict-boolean-expressions`. |
| **Promise/async discipline** | Floating promises and misused async are well-known pitfalls. | LOW | typescript-eslint covers: `no-floating-promises`, `no-misused-promises`, `await-thenable`, `return-await`, `require-await`. Configure all as errors. |
| **`unknown` over `any` guidance** | Standard modern TS advice. Expected in any opinionated guide. | LOW | Skill guidance + existing lint rules. No custom rules needed. |
| **Named exports only** | Google, Airbnb, and most strict configs agree: no default exports. | LOW | `import/no-default-export` from eslint-plugin-import. Configure it. |
| **Consistent naming conventions** | camelCase, PascalCase expectations. Users expect the guide to state them. | LOW | typescript-eslint `naming-convention` rule. Configure it opinionately. |
| **`const` by default** | `const` over `let`, never `var`. Universal modern TS opinion. | LOW | ESLint `prefer-const`, `no-var`. Already standard. |
| **Strict tsconfig recommendations** | Users expect the skill to recommend tsconfig settings. | LOW | Skill-only feature (not lintable). Recommend `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, etc. |
| **Flat config support** | ESLint flat config is the current standard. Legacy `.eslintrc` is deprecated. | MEDIUM | Plugin must export flat config compatible format. Non-negotiable for a 2026 plugin. |
| **Composability with typescript-eslint** | Users run typescript-eslint already. Plugin must layer on top, not conflict. | MEDIUM | Build as extension of strict-type-checked. Never duplicate existing rules; only configure or add new ones. |
| **Autofix where possible** | Users expect ESLint rules to fix what they can automatically. | MEDIUM | Every custom rule should attempt autofix. Some opinions (like enum-to-const-object) require complex codefixes. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI-agent-native guidance (Claude skill)** | No competitor provides TypeScript opinions as an AI skill. This is the primary differentiator. AI agents consult the skill in real-time, producing consistent code across sessions. | MEDIUM | Skill format is markdown with YAML frontmatter. Must be structured so agents can find relevant opinions quickly. Sections organized by decision point, not by rule name. |
| **Error handling pattern opinions** | typescript-eslint says "only throw Errors" but has no opinion on Result types, discriminated union errors, or error hierarchy patterns. This is a major gap. | HIGH | Skill: opinionated guidance on when to throw vs return Result types, error discriminated unions, error class hierarchies. Lint: custom rule enforcing typed catch clauses (`unknown` in catch), possibly `no-throw-in-async` pattern. |
| **Discriminated union best practices** | No existing lint plugin enforces DU patterns (single discriminant, exhaustive switch, no destructuring that breaks narrowing). | HIGH | Custom rules: require `kind`/`type` discriminant field, warn on destructuring that breaks narrowing, enforce exhaustive handling. This is genuinely novel. |
| **"Why" documentation per opinion** | Existing configs say "do this." This skill explains "because X." AI agents can relay rationale to developers. | MEDIUM | Each opinion in the skill includes a rationale section. Lint rule messages link to the relevant skill section for explanation. |
| **Readonly-by-default patterns** | Immutability opinions beyond `prefer-const`: readonly arrays, readonly parameters, Readonly utility type guidance. | MEDIUM | Skill guidance + configure typescript-eslint `prefer-readonly`, `prefer-readonly-parameter-types`. Custom rule for `ReadonlyArray<T>` over `Array<T>` in function signatures. |
| **Module organization opinions** | How to structure exports, barrel files (for or against), re-export patterns. No lint plugin covers this comprehensively. | MEDIUM | Skill: opinion on barrel files (ban them -- they break tree-shaking and cause circular deps). Lint: custom rule to warn on index.ts re-export patterns, or configure `import/no-cycle`. |
| **Generic constraint patterns** | When to use generics vs overloads vs union parameters. No tooling covers this. | LOW | Skill-only guidance. Not practically lintable. Covers: prefer generics over overloads, constrain generics tightly, avoid unnecessary generic parameters. |
| **Branded/nominal type guidance** | TypeScript is structurally typed, but branded types solve real problems (UserId vs string). No lint tooling for this. | LOW | Skill-only: when to use branded types, how to create them, patterns for runtime validation at boundaries. |
| **Variance and conditional type pitfalls** | Advanced TS pitfalls that trip up even experienced devs and AI agents. | LOW | Skill-only: distribution in conditional types, variance annotations, `infer` best practices. Not lintable but critical for AI agent guidance. |
| **Pre-built strict config preset** | Single import to get all opinions as ESLint config. Zero friction adoption. | LOW | Export a `recommended` config that sets all rule options. Users do `import narrows from 'eslint-plugin-narrows'` and spread it. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Framework-specific opinions** (React, Next, Express) | Users want one-stop TypeScript guidance. | Fragments the opinion set, creates maintenance burden, conflicts with framework-specific plugins that already exist. React has `eslint-plugin-react`, Next has its own config. | Stay framework-agnostic. Provide foundational TS opinions that apply everywhere. Users layer framework plugins on top. |
| **Code generation / scaffolding** | "Give me a template that follows these opinions." | Turns a guidance tool into a generator. Different scope, different maintenance, different user expectations. | The skill shapes how AI agents generate code. The agent IS the generator; the skill is the opinion source. |
| **Runtime type validation** (custom Zod-like tooling) | Adjacent to type safety opinions. | Zod, Valibot, ArkType already exist and are excellent. Building a competing runtime validator is a distraction. | Skill provides opinions on WHEN and HOW to use Zod/Valibot at boundaries, but does not provide runtime tooling. |
| **Formatting rules** (semicolons, quotes, indentation) | "Shouldn't your config handle formatting too?" | Formatting is solved by Prettier/Biome. ESLint deprecated formatting rules. Mixing concerns creates conflicts. | State "use Prettier" in the skill. Do not include any formatting opinions in lint rules. |
| **Oxlint rules** (right now) | Oxlint is faster, gaining adoption. | Oxlint plugin API is immature and changing. ESLint ecosystem is vastly larger. Premature to invest. | Defer to v2. Prove opinions in ESLint first, then port rules if Oxlint plugin ecosystem stabilizes. |
| **Exhaustive rule configurability** | "Let me turn off individual opinions." | Defeats the purpose. If every opinion is optional, it is not opinionated. XO succeeds because it is non-negotiable by default. | Provide ONE preset. Users can override specific rules (standard ESLint), but the default is all-or-nothing. Do not provide "relaxed" or "moderate" configs. |
| **tsconfig.json management** | "Generate or validate my tsconfig." | tsconfig validation is a different tool category. `@tsconfig/strictest` already exists. | Skill documents recommended tsconfig settings. Link to `@tsconfig/strictest`. Do not build tsconfig tooling. |
| **Type-level computation rules** | Lint rules for complex generic/conditional types. | AST-level analysis of type-level code is extremely complex and fragile. TypeScript's own checker handles this. | Skill provides guidance on when type-level patterns are appropriate. No lint rules for type-level code complexity. |

## Feature Dependencies

```
[Claude Skill: Core Opinions]
    |
    +-- [ESLint Plugin: Rule Configuration]
    |       |
    |       +-- requires --> [typescript-eslint strict-type-checked as base]
    |       |
    |       +-- requires --> [Flat config plugin architecture]
    |       |
    |       +-- [Custom Rules: enum ban, DU patterns, error handling]
    |       |       |
    |       |       +-- requires --> [@typescript-eslint/utils for AST + type info]
    |       |
    |       +-- [Pre-built Config Preset]
    |               |
    |               +-- requires --> [All custom rules defined first]
    |               +-- requires --> [typescript-eslint rule configurations decided]
    |
    +-- [Skill: Error handling opinions]
    |       +-- enhances --> [ESLint: error handling rules]
    |
    +-- [Skill: DU best practices]
    |       +-- enhances --> [ESLint: DU pattern rules]
    |
    +-- [Skill: Advanced TS pitfalls]
            +-- standalone (no lint equivalent)

[Autofix support] -- enhances --> [Every custom rule]

[Documentation / "why" per opinion] -- enhances --> [Claude Skill] AND [ESLint rule messages]
```

### Dependency Notes

- **ESLint plugin requires skill opinions first:** The skill defines what the opinions ARE. The plugin enforces the automatable subset. Write opinions before writing rules.
- **Custom rules require typescript-eslint/utils:** All custom rules use `@typescript-eslint/utils` for AST traversal and type information access. This is a hard dependency.
- **Pre-built config requires all rules:** The config preset bundles all custom rules plus typescript-eslint rule configurations. It must be built last.
- **Autofix enhances every rule:** Autofix is not a blocker for any rule but significantly increases adoption. Add incrementally.

## MVP Definition

### Launch With (v1)

Minimum viable product -- what is needed to validate the concept.

- [ ] **Claude skill with comprehensive opinions** -- The core product. Covers: type vs interface, enum stance, error handling, async patterns, null handling, naming, module organization, readonly patterns, generics, branded types, advanced pitfalls (variance, conditional distribution). This is the primary value delivery.
- [ ] **ESLint plugin with configured typescript-eslint strict-type-checked rules** -- Opinionated configuration of existing rules (naming-convention, consistent-type-definitions, no-explicit-any, consistent-type-assertions, etc.) bundled as a single preset.
- [ ] **3-5 custom lint rules for gaps** -- The rules that existing plugins cannot provide: enum ban (prefer const object + type), DU discriminant enforcement, catch clause typing. These prove the plugin has unique value.
- [ ] **Flat config export** -- Single-import config for users.
- [ ] **npm package** -- Published and installable.

### Add After Validation (v1.x)

Features to add once core is working and receiving feedback.

- [ ] **Autofix for all custom rules** -- Start with error-only rules, add codefixes based on user demand.
- [ ] **Additional custom rules** -- Barrel file detection, readonly parameter enforcement, advanced DU patterns (exhaustive switch enforcement).
- [ ] **Skill registry publication** -- Publish to Claude skill marketplace once format stabilizes.
- [ ] **Rule documentation site** -- Each rule with examples, rationale, links to skill sections.
- [ ] **Error handling pattern rules** -- More sophisticated: Result type enforcement, no-throw-in-async, typed error hierarchies.

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Oxlint rule ports** -- Port proven rules to Oxlint once its plugin API stabilizes.
- [ ] **IDE extension** -- VS Code extension that surfaces skill opinions inline (beyond what ESLint already shows).
- [ ] **Migration codemods** -- Automated migration from "unopinionated" codebases to narrows-compliant code.
- [ ] **Skill variants for other AI platforms** -- Adapt the skill format for Cursor, Copilot, or other AI coding tools if they adopt skill-like standards.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Claude skill: core opinions | HIGH | MEDIUM | P1 |
| ESLint: configured typescript-eslint preset | HIGH | LOW | P1 |
| ESLint: enum ban custom rule | HIGH | MEDIUM | P1 |
| ESLint: flat config export | HIGH | LOW | P1 |
| npm publication | HIGH | LOW | P1 |
| ESLint: DU discriminant rule | MEDIUM | HIGH | P2 |
| ESLint: catch clause typing rule | MEDIUM | MEDIUM | P2 |
| Autofix for custom rules | MEDIUM | HIGH | P2 |
| Skill registry publication | MEDIUM | LOW | P2 |
| Rule documentation site | MEDIUM | MEDIUM | P2 |
| Barrel file lint rule | LOW | MEDIUM | P3 |
| Oxlint ports | LOW | HIGH | P3 |
| Migration codemods | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | typescript-eslint strict | XO | Google TS Style Guide | ts-reset | Our Approach |
|---------|------------------------|-----|----------------------|----------|--------------|
| Type vs interface opinion | `consistent-type-definitions` (configurable, no default stance) | Inherits typescript-eslint | Interfaces for objects | N/A (type definitions, not guidance) | Interfaces for object shapes, types for unions/intersections/utilities. Lint enforced. |
| Enum stance | `no-mixed-enums` (allows enums) | No specific rule | Plain enum, no const enum | N/A | Ban all enums. Prefer `as const` + type union. Custom rule. |
| `any` handling | `no-explicit-any` + `no-unsafe-*` family | Inherits typescript-eslint | Avoid `any`, prefer `unknown` | Makes `JSON.parse` return `unknown`, `.catch` takes `unknown` | All typescript-eslint strict rules as errors + skill guidance on migration strategies. |
| Error handling | Only "use Error objects" | No specific rules | Only throw Error subclasses | N/A | Comprehensive: Result type guidance, discriminated union errors, typed catches, error hierarchies. Skill + lint. |
| Discriminated unions | No rules | No rules | No rules | N/A | DU best practices with custom lint rules. Novel territory. |
| Module organization | No opinion | No opinion | Named exports, relative imports, no namespaces | N/A | Named exports, ban barrel files, opinion on re-export patterns. Skill + lint. |
| Async discipline | Comprehensive rules | Inherits typescript-eslint | No specific rules | N/A | Configure all typescript-eslint async rules as errors + skill guidance on async patterns. |
| Readonly patterns | `prefer-readonly` available | No specific config | `readonly` for non-reassigned | N/A | Aggressive readonly-by-default: readonly params, ReadonlyArray in signatures, Readonly utility type guidance. |
| AI agent integration | None | None | None | None | **Primary differentiator.** Claude skill format for real-time AI guidance. |
| Rationale per opinion | Rule docs explain "why" | Minimal | Explains rationale inline | Explains each fix | Every opinion includes "because X" rationale in skill. Rule messages link to rationale. |

## Sources

- [typescript-eslint Shared Configs](https://typescript-eslint.io/users/configs/)
- [typescript-eslint Rules Overview](https://typescript-eslint.io/rules/)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [XO - ESLint Wrapper](https://github.com/xojs/xo)
- [eslint-config-xo-typescript](https://www.npmjs.com/package/eslint-config-xo-typescript)
- [ts-reset by Matt Pocock](https://github.com/mattpocock/ts-reset)
- [Effect TypeScript](https://effect.website/)
- [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)
- [Custom Rules - typescript-eslint](https://typescript-eslint.io/developers/custom-rules/)
- [Claude Skills Documentation](https://code.claude.com/docs/en/skills)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)
- [ESLint Custom Rule Tutorial](https://eslint.org/docs/latest/extend/custom-rule-tutorial)

---
*Feature research for: Opinionated TypeScript guidance ecosystem*
*Researched: 2026-03-16*
