Add a new opinion to The TypeScript Narrows using the 3-layer pattern: corpus file, skill reference, and index updates.

## Input

The user provides a natural-language description of the opinion as `$ARGUMENTS`. This can range from a fully detailed specification to a rough one-liner like "ban default parameters in favor of options objects" or "prefer satisfies over as const".

### Step 0: Infer opinion fields

From the user's description and your knowledge of TypeScript best practices, infer ALL of the following fields:

- **id**: kebab-case identifier (e.g., `prefer-readonly-map`). Convention: use `prefer-X` when recommending one pattern over another, `no-X` or `ban-X` when prohibiting something, `require-X` when mandating something.
- **title**: Short imperative sentence (e.g., "Use ReadonlyMap for lookup tables")
- **severity**: `bug-prevention` (can cause runtime errors or silent wrong behavior), `maintenance` (harder to understand/refactor/extend), or `style` (consistency/readability only)
- **enforcement**: `both` (has a matching ESLint rule) or `skill-only` (no lint rule exists)
- **topic group**: One of the existing SKILL.md sections (read SKILL.md to get current list), or propose a new section name
- **tags**: 1-4 kebab-case tags
- **related**: 0+ existing opinion ids that relate (read INDEX.md to find candidates)
- **stance**: 1-2 sentence position statement
- **why**: 2-4 sentence rationale
- **do example**: 3-8 lines of TypeScript
- **don't example**: 3-8 lines of TypeScript
- **exception** (optional): When this opinion doesn't apply
- **SKILL.md bullet**: Concise imperative restatement for the SKILL.md index (match voice of existing bullets)

If enforcement is `both`, also infer:
- **lint.type**: `existing` or `custom`
- **lint.rule**: ESLint rule name (e.g., `@typescript-eslint/no-explicit-any`)

If enforcement is `both` AND lint.type is `custom`, also infer:
- **lint.requiresTypeChecking**: boolean (does the rule need type information from the TypeScript compiler?)
- **lint.messageId**: short camelCase identifier for the error message (e.g., `"banned"`, `"preferUnknown"`)
- **lint.message**: the error message string shown to the developer

### Step 0b: Ask for clarification (only if needed)

If the description is too ambiguous to confidently infer severity, enforcement, or topic group, ask the user a focused question. Do NOT ask about fields you can reasonably infer.

### Step 0c: Present for review

Before writing any files, present the inferred fields to the user for review using AskUserQuestion. Show a preview with all fields formatted clearly:

```
id: {id}
title: {title}
severity: {severity}
enforcement: {enforcement}
topic group: {topic_group}
tags: {tags}
related: {related}
SKILL.md bullet: {bullet} [{severity_tag}]

Stance: {stance}
Why: {why}

Do:
  {do_example}

Don't:
  {dont_example}

Exception: {exception or "None"}


{if enforcement is "both" and lint.type is "custom":}
lint.requiresTypeChecking: {lint.requiresTypeChecking}
lint.messageId: {lint.messageId}
lint.message: {lint.message}
{end if}
```

Options: "Looks good" (proceed), "Edit" (user provides corrections in text). If the user provides corrections, update the fields and present again. Only proceed to Step 1 when the user approves.

## Execution

### Step 1: Create corpus file

Write `docs/opinions/{id}.md`:

```markdown
---
id: {id}
title: "{title}"
severity: {severity}
enforcement: {enforcement}
confidence: strong
tags: [{tags}]
related: [{related}]
{if enforcement is "both":}
lint:
  type: {lint.type}
  rule: "{lint.rule}"
{end if}
---

## Stance

{stance}

## Why

{why}

## Do

```typescript
{do_example}
```

## Don't

```typescript
{dont_example}
```

{if exception:}
## Exceptions

{exception}
{end if}
```

### Step 2: Update INDEX.md

Edit `docs/opinions/INDEX.md`:

1. Add entry under the matching topic group section:
   ```
   - [{id}]({id}.md) -- {title} [{severity_tag}] [{enforcement}]
   ```
   Severity tags: bug-prevention = `[B]`, maintenance = `[M]`, style = `[S]`

2. Update the opinion count on line 1 and in the Summary section at the bottom. Increment total and the appropriate severity/enforcement counters.

### Step 3: Update skill reference file

Determine the reference file from the topic group → reference file mapping:

| SKILL.md Section | Reference File |
|---|---|
| Type Safety | references/type-safety.md |
| Type Declarations | references/type-declarations.md |
| Null Handling and Narrowing | references/null-handling.md |
| Async and Promises | references/async-promises.md |
| Iteration and Transforms | references/iteration.md |
| Error Handling | references/error-handling.md |
| Control Flow | references/control-flow.md |
| Functions | references/functions.md |
| Immutability and Const | references/immutability.md |
| Module Organization | references/modules.md |
| Naming Conventions | references/naming.md |
| Discriminated Unions | references/discriminated-unions.md |
| Generics and Advanced Types | references/generics.md |
| Resource Management | references/resource-management.md |
| tsconfig and Advanced Pitfalls | references/tsconfig-advanced.md |

If the topic group is new, create a new reference file at `plugin/the-typescript-narrows/skills/typescript-narrows/references/{new-topic}.md` with a `# {Topic Name}` heading.

Append to the reference file (with `---` separator before it):

```markdown
---

## {title}

**Stance:** {stance}

**Why:** {why}

**Do:**
```typescript
{do_example}
```

**Don't:**
```typescript
{dont_example}
```

{if exception:}
**Exception:** {exception}
{end if}
```

### Step 4: Update SKILL.md

Edit `plugin/the-typescript-narrows/skills/typescript-narrows/SKILL.md`:

1. Add bullet under the matching section (before the "For rationale and examples" line):
   ```
   - {SKILL.md bullet text}. [{severity_tag}]
   ```
   The bullet text should be a concise imperative restatement of the stance (match the voice of existing bullets).

2. If the topic group is new, add a new section in logical order with the bullet and a "For rationale and examples" link.

### Step 5: Add rule to strict config (conditional)

**Condition:** Only run when `enforcement: both` AND `lint.type: existing`. Skip this step for `skill-only` opinions or `lint.type: custom` opinions (those are handled in Step 6).

1. Read `eslint-plugin/src/configs/strict.ts`
2. Add the ESLint rule (from `lint.rule` field) to the appropriate section in the rules object:
   - If rule starts with `@typescript-eslint/` and is already in `tseslint.configs.strictTypeChecked`, add to the "@typescript-eslint rules already in strict-type-checked" section with explicit `'error'` override
   - If rule starts with `@typescript-eslint/` and is NOT in strictTypeChecked, add to the "@typescript-eslint rules NOT in strict-type-checked" section
   - If rule starts with `import/`, add to the import plugin rules section
   - If rule has no prefix, add to the "ESLint core rules" section
3. If the rule requires configuration options (from the opinion's lint field or known rule documentation), include the options array. Otherwise use just `'error'`.
4. Update the comment counts in the section headers (e.g., "ESLint core rules (3)" becomes "(4)")

### Step 6: Create custom ESLint rule (conditional)

**Condition:** Only run when `enforcement: both` AND `lint.type: custom`. Skip this step for `skill-only` opinions or `lint.type: existing` opinions (those are handled in Step 5).

1. **Create rule file** at `eslint-plugin/src/rules/{id}.ts`:
   - Follow the exact pattern from `ban-enums.ts`: import `createRule`, export a named constant (camelCase version of the id), define `meta` with type/docs/messages/schema, implement `create()` visitor
   - Set `docs.opinionId` to the opinion id
   - Set `docs.requiresTypeChecking` based on `lint.requiresTypeChecking`
   - Use `lint.messageId` and `lint.message` for the messages object
   - Write the AST visitor logic based on the opinion's stance and examples

2. **Create test file** at `eslint-plugin/tests/rules/{id}.test.ts`:
   - Follow the exact pattern from `ban-enums.test.ts` (vitest + `@typescript-eslint/rule-tester`)
   - Include at least 2x as many valid cases as invalid cases
   - Valid cases should cover normal usage that the rule should NOT flag
   - Invalid cases should cover the patterns the opinion bans/requires, with `messageId` assertions

3. **Wire into rules index** at `eslint-plugin/src/rules/index.ts`:
   - Add import statement following existing pattern (import from `./{id}.js`)
   - Add entry to the rules object: `'{id}': {camelCaseName}`

4. **Add to strict config** at `eslint-plugin/src/configs/strict.ts`:
   - Add `'typescript-narrows/{id}': 'error'` to the typescript-narrows custom rules section
   - Update the comment count (e.g., "(2)" becomes "(3)")

5. **Run tests** to verify: `cd eslint-plugin && npx vitest run tests/rules/{id}.test.ts`

### Step 7: Commit

Stage all changed files and commit:
```
feat(opinions): add {id} opinion
```

If Steps 5 or 6 were executed, also stage the ESLint plugin files that were modified.

Report what was created/updated.

## Notes

- Always read the target files before editing to get current state
- Match the exact formatting patterns of existing entries
- Keep code examples within 3-8 lines
- If adding to an existing topic group, place the new entry in a logical position among siblings (typically at the end, unless there's a clear ordering reason)
- When creating custom rules (Step 6), reference existing rules in `eslint-plugin/src/rules/` for patterns
- Custom rule tests must have at least 2x valid cases compared to invalid cases
- Run `cd eslint-plugin && npx vitest run` after all changes to verify nothing is broken
