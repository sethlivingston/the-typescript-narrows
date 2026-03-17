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
| tsconfig and Advanced Pitfalls | references/tsconfig-advanced.md |

If the topic group is new, create a new reference file at `skill/the-typescript-narrows/references/{new-topic}.md` with a `# {Topic Name}` heading.

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

Edit `skill/the-typescript-narrows/SKILL.md`:

1. Add bullet under the matching section (before the "For rationale and examples" line):
   ```
   - {SKILL.md bullet text}. [{severity_tag}]
   ```
   The bullet text should be a concise imperative restatement of the stance (match the voice of existing bullets).

2. If the topic group is new, add a new section in logical order with the bullet and a "For rationale and examples" link.

### Step 5: Commit

Stage all changed files and commit:
```
feat(opinions): add {id} opinion
```

Report what was created/updated.

## Notes

- Always read the target files before editing to get current state
- Match the exact formatting patterns of existing entries
- Keep code examples within 3-8 lines
- If adding to an existing topic group, place the new entry in a logical position among siblings (typically at the end, unless there's a clear ordering reason)
