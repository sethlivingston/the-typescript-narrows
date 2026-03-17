# The TypeScript Narrows - Opinions

## Philosophy

This corpus provides a single, well-reasoned opinion for every common TypeScript decision point. When two reasonable developers would do it differently, we pick a side and explain why.

Opinions are self-contained. Each one stands on its own without requiring external documentation, blog posts, or specification references. You should be able to read an opinion, understand the stance, and apply it immediately.

The inclusion bar is simple: an opinion earns its place if it **prevents a real, recurring problem** or **eliminates a common ambiguity**. Niche edge cases that rarely occur in practice are excluded even if they technically qualify.

## How Opinions Are Structured

Each opinion file has two parts: YAML frontmatter (machine-readable metadata) and a markdown body (human-readable content).

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Slug-based identifier matching the filename (e.g., `no-explicit-any`) |
| `title` | Yes | Short imperative title (e.g., "Never use explicit any") |
| `severity` | Yes | One of `bug-prevention`, `maintenance`, `style` |
| `enforcement` | Yes | One of `skill-only`, `lint-enforceable`, `both` |
| `confidence` | Yes | One of `strong`, `moderate` |
| `tags` | Yes | Freeform array of topic tags (e.g., `[type-safety, any]`) |
| `related` | No | Array of related opinion IDs (e.g., `[prefer-unknown]`) |
| `lint` | Conditional | Required if enforcement is not `skill-only`. Contains `type` (`existing` or `custom`) and `rule` (required if type is `existing`) |

### Body Sections

| Section | Required | Description |
|---------|----------|-------------|
| **Stance** | Yes | The opinion in one clear sentence |
| **Why** | Yes | The rationale -- what goes wrong without this opinion |
| **Do** | Yes | Code showing the preferred pattern (one or more blocks) |
| **Don't** | Yes | Code showing the discouraged pattern (one or more blocks) |
| **Exceptions** | No | When the opinion does not apply |

Code examples are minimal 3-8 line snippets. Opinions may include multiple Do and/or Don't blocks when the pattern has distinct variations that benefit from separate examples.

## Severity Tiers

| Tier | Meaning |
|------|---------|
| bug-prevention | Can cause runtime errors, data corruption, or silent wrong behavior |
| maintenance | Makes code harder to understand, refactor, or extend over time |
| style | Consistency and readability with no functional impact |

When an opinion spans multiple tiers, it is classified at the highest applicable tier.

## Global Exception Clause

All opinions allow exceptions when there is no other viable alternative. If you must deviate, document why in a code comment. The goal is consistency, not dogma.

An exception is valid when:

- A third-party library forces a pattern the opinion discourages.
- A performance-critical path requires a trade-off the opinion would not normally permit.
- The team has a documented, project-specific reason to diverge.

The key word is "viable." Convenience alone is not a valid exception.

## For AI Agents

When consulted about a TypeScript decision point, provide the opinion's stance and rationale. Lead with what to do, not what to avoid.

If the developer asks why, explain using the Why section. Ground the explanation in concrete consequences -- what breaks, what becomes harder, what gets confusing.

If they push back with a valid exception, acknowledge it. These opinions are strong defaults, not absolute rules. An exception backed by a real constraint is fine; an exception backed by habit is not.

The frontmatter is machine-readable. Parse it for severity, enforcement type, related opinions, and lint rule mappings. Use the `tags` field to find topically related opinions across the corpus.
