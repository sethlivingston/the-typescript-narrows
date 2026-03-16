# Pitfalls Research

**Domain:** Opinionated TypeScript guidance skill + ESLint plugin
**Researched:** 2026-03-16
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Opinion Sprawl -- Covering Everything Instead of What Matters

**What goes wrong:**
The skill and plugin try to have an opinion on every possible TypeScript decision point. The result is a bloated skill that burns context window tokens, an ESLint config with 80+ custom rules nobody can remember, and developers who disable the whole thing rather than learn it. The project becomes a wall of opinions rather than a curated guide.

**Why it happens:**
The project's stated goal -- "a single, well-reasoned opinion for every common decision point" -- naturally incentivizes completionism. Each opinion feels justified individually, but collectively they create cognitive overload and maintenance burden. The temptation is to keep adding opinions because "while we're at it, we should also cover X."

**How to avoid:**
- Define a hard ceiling: start with 15-25 core opinions, not 60+. Each opinion must clear a bar: "Does this prevent a real, recurring problem or does it just express a preference?"
- Categorize opinions into tiers: (1) prevent bugs/type unsafety, (2) prevent maintenance problems, (3) stylistic consistency. Tier 3 is deprioritized or omitted.
- For the Claude skill specifically, stay under 500 lines in SKILL.md (official Anthropic guidance) and use progressive disclosure with reference files for deeper topics.
- For ESLint rules, each rule must have a clear "why" beyond "I prefer this." If the justification is purely aesthetic, it probably belongs in the skill guidance (soft) rather than lint enforcement (hard).

**Warning signs:**
- SKILL.md exceeds 500 lines without progressive disclosure
- ESLint config takes more than 2 minutes to explain to a new developer
- More than 30% of rules are stylistic rather than correctness-oriented
- Frequent requests to disable rules or add exceptions

**Phase to address:**
Phase 1 (Opinion Curation). Establish the opinion taxonomy and selection criteria before writing any rules or skill content. The opinion list is the foundation -- getting it wrong means rework across both the skill and plugin.

---

### Pitfall 2: Skill-Plugin Opinion Drift

**What goes wrong:**
The Claude skill says one thing ("prefer type aliases over interfaces for object shapes") but the ESLint plugin either does not enforce it, enforces the opposite, or enforces a subtly different interpretation. Users get contradictory guidance: the AI writes code one way, the linter flags it. Trust in both tools collapses.

**Why it happens:**
The skill (markdown prose) and plugin (AST-based rules) are authored in different formats, possibly at different times, potentially by different contributors. Prose opinions are nuanced ("prefer X except when Y") while lint rules are binary (error or no error). The gap between "what I meant" and "what the AST can detect" creates drift. Additionally, updating one without updating the other is easy to forget.

**How to avoid:**
- Maintain a single source of truth: a structured opinion registry (e.g., a YAML or JSON file) that both the skill prose and ESLint rule metadata derive from. Each opinion has an ID, rationale, skill guidance text, and lint rule reference (or "not automatable" flag).
- Automated checks: a CI test that verifies every enforceable opinion in the registry has a corresponding ESLint rule, and every ESLint rule maps back to a registered opinion.
- Clear "not automatable" markers for opinions that belong only in the skill (e.g., "prefer composition over inheritance" -- no lint rule can enforce this reliably).

**Warning signs:**
- AI-generated code that passes all lint rules but violates skill guidance
- Lint errors on code that follows skill recommendations
- No clear mapping between skill sections and lint rules
- Opinions added to the skill without checking if they are lint-enforceable

**Phase to address:**
Phase 1 (Opinion Curation) and enforced throughout all phases. The registry pattern should be established before any content is written.

---

### Pitfall 3: False Positive Erosion of Trust

**What goes wrong:**
Custom ESLint rules flag legitimate, correct TypeScript code as violations. Developers encounter false positives, lose trust in the plugin, and either disable rules broadly or stop using the plugin entirely. This is the number one reason opinionated linting tools fail adoption. Research consistently shows that "warning fatigue" from false positives causes developers to ignore linter output entirely.

**Why it happens:**
ESLint rules operate on AST patterns, not semantic understanding. Behavioral rules (as opposed to textual/syntactic rules) are inherently imperfect -- they must approximate intent from structure. Type-aware rules are more accurate but slower and harder to write correctly. Custom rule authors often test against their mental model of "bad code" without sufficient "valid code that looks similar to bad code" test cases.

**How to avoid:**
- Every rule must have extensive "valid" test cases -- not just the happy path, but edge cases that resemble violations but are correct code. Aim for 2-3x more valid cases than invalid cases.
- Use type-aware linting (typescript-eslint's type checker integration) for rules that need semantic understanding, accepting the performance trade-off.
- Ship rules as "warn" severity initially. Promote to "error" only after real-world validation with zero false positive reports.
- Provide clear, actionable error messages that explain WHY the code is flagged and WHAT to do instead. If users understand the rationale, they tolerate occasional false positives better.
- Include an escape hatch: document the approved way to suppress each rule when the user genuinely has a valid exception.

**Warning signs:**
- Users reporting "but this code is correct" in issues
- High volume of eslint-disable comments in codebases using the plugin
- Rules with fewer valid test cases than invalid test cases
- Rules that trigger on standard library patterns or common third-party library usage

**Phase to address:**
Phase 2 (ESLint Plugin Development). Build the testing infrastructure and false-positive detection pipeline before writing rules. Every rule PR must include a false-positive analysis.

---

### Pitfall 4: Context Window Toxicity in the Skill

**What goes wrong:**
The Claude skill consumes so many tokens that it degrades the AI agent's ability to reason about the actual coding task. The agent becomes worse at coding because it is spending its context budget on guidance instead of understanding the user's codebase. Paradoxically, the "helpful" skill makes the AI less helpful.

**Why it happens:**
Skill authors think more guidance equals better output. But Claude's context window is a shared, finite resource (200K tokens). The skill competes with: the system prompt, conversation history, file contents the agent has read, other skills, and the user's actual request. Anthropic's official guidance warns that "every line needs to justify its token cost." A 2000-line skill with exhaustive examples leaves less room for the agent to hold the user's actual code in context.

**How to avoid:**
- SKILL.md body under 500 lines (Anthropic's recommendation). Use progressive disclosure: SKILL.md provides the overview and links to reference files that Claude loads only when relevant.
- Structure by topic area (type patterns, error handling, async, etc.) in separate files. Claude loads only the relevant section for the current task.
- Do not explain things Claude already knows. "TypeScript has union types" wastes tokens. "Prefer discriminated unions over type guards for exhaustiveness checking" adds value.
- Test with all target models (Haiku, Sonnet, Opus) -- smaller models need more guidance but have the same context constraints.
- Measure: run coding tasks with and without the skill and compare output quality. If quality drops on complex tasks, the skill is too heavy.

**Warning signs:**
- Skill SKILL.md exceeds 500 lines without progressive disclosure
- AI agent starts "forgetting" earlier parts of conversation after skill loads
- Agent produces lower quality code on complex tasks with skill than without
- Skill includes explanations of basic TypeScript concepts

**Phase to address:**
Phase 1 (Skill Authoring). Establish the progressive disclosure architecture from the start. Retrofitting a monolithic skill into a modular one is painful.

---

### Pitfall 5: Building for ESLint 9 Legacy Instead of ESLint 10+ Future

**What goes wrong:**
The plugin targets ESLint 9's flat config but does not account for ESLint 10's breaking changes (released February 2026). Users on ESLint 10 encounter compatibility issues. Worse, the plugin uses deprecated APIs that will be removed in ESLint 11, creating a ticking time bomb.

**Why it happens:**
Most ESLint plugin tutorials and examples still reference ESLint 9 patterns. ESLint 10 dropped Node.js < 20.19.0, fully removed the legacy eslintrc configuration system, and continued the language-agnostic architecture rewrite. Plugin authors who learned from pre-2026 materials build on already-deprecated foundations.

**How to avoid:**
- Target ESLint 10 as the minimum. Do not support ESLint 9 or the legacy eslintrc format. This is a new plugin with no backward-compatibility obligation.
- Use typescript-eslint v8+ which has full flat config and ESLint 9+ support.
- Test against ESLint 10 in CI. Track the ESLint and typescript-eslint changelogs for deprecation notices.
- Use the `@typescript-eslint/rule-tester` with flat config options (not the legacy RuleTester format).
- Watch for the ESLint core rewrite progress -- the language-agnostic architecture may change how plugins register.

**Warning signs:**
- Plugin uses `context.getScope()` or other APIs deprecated in ESLint 9+
- RuleTester configuration uses legacy format instead of flat config
- No ESLint 10 in CI matrix
- Users reporting "TypeError: context.getScope is not a function" or similar

**Phase to address:**
Phase 2 (ESLint Plugin Development). Pin the ESLint/typescript-eslint version targets on day one.

---

### Pitfall 6: Type-Aware Rules Without Performance Budgeting

**What goes wrong:**
The plugin includes multiple type-aware rules (rules that call TypeScript's type checking APIs). Each type-aware rule adds significant overhead because TypeScript must analyze the entire project, not just the current file. With 10+ type-aware rules, linting becomes painfully slow -- 30+ seconds for a single file in large projects. Developers disable the plugin or skip linting.

**Why it happens:**
Type-aware rules are more powerful and accurate than AST-only rules. They can check actual types, resolve generics, understand type narrowing, etc. The temptation is to make every rule type-aware "because we can." But each rule that calls `checker.getTypeAtLocation()` or similar APIs pays the TypeScript type-checking tax.

**How to avoid:**
- Classify each rule as AST-only or type-aware during design. Default to AST-only. A rule needs type information only if it genuinely cannot work without it (e.g., "don't use `any` as a return type" needs type info; "prefer `const` over `let` for never-reassigned variables" does not).
- Set a performance budget: lint time for a 500-file project should stay under 10 seconds with all rules enabled. Profile with `TIMING=1 npx eslint .` during development.
- Offer two rule configurations: a "fast" config (AST-only rules) and a "full" config (includes type-aware rules). Let users choose based on their performance tolerance.
- Document the performance cost of each type-aware rule so users can make informed decisions.

**Warning signs:**
- More than 40% of rules are type-aware
- Lint times exceed 2x the TypeScript type-check time for the same project
- Users complaining about editor lag or CI lint timeout
- No performance benchmarks in the project's test suite

**Phase to address:**
Phase 2 (ESLint Plugin Development). Establish performance benchmarks and the AST-only/type-aware classification system before writing rules.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding opinion text in both skill and rule metadata | Ship faster without building a registry | Drift between skill and plugin; double-maintenance for every opinion change | Never -- registry is low effort and prevents a class of bugs |
| Skipping type-aware testing in RuleTester | Faster test suite, simpler setup | Rules may behave differently with real type information vs. test stubs; false positives in production | Never for type-aware rules; acceptable for pure AST rules |
| Using `any` in the plugin's own source code | Faster development when wrestling ESLint/TS APIs | Ironic credibility damage -- an opinionated TS tool with `any` in its source; real type bugs | Never -- this is a TypeScript guidance tool |
| Monolithic SKILL.md with all opinions inline | Simpler initial authoring | Context window bloat; must rewrite to progressive disclosure later | Only for initial prototype; refactor before first release |
| Testing only against current TS version | Simpler CI matrix | Breaks silently when users are on older/newer TS; type-aware rules are especially sensitive | Never -- test against supported TS version range |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| typescript-eslint strict config | Duplicating rules already in strict config | Extend strict config; only add rules for gaps not covered by typescript-eslint |
| Prettier / formatting tools | Writing lint rules that conflict with formatters | Explicitly declare: no formatting opinions. Defer all formatting to Prettier/dprint |
| Other ESLint plugins (import, etc.) | Rule conflicts causing contradictory errors | Test the plugin alongside common configs (eslint-config-prettier, eslint-plugin-import) in CI |
| Claude skill registry | Skill metadata not triggering on relevant queries | Write description with specific trigger terms: "TypeScript", "type patterns", "ESLint"; test discovery with real queries |
| Editor integrations (VS Code) | Rules that work in CLI but cause editor performance issues | Type-aware rules must be tested in editor context; provide "fast" config recommendation for editor use |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Too many type-aware rules | Editor lag, CI lint timeout, developers disabling plugin | Performance budget, AST-only default, profile with TIMING=1 | Projects with 200+ files |
| Rule that traverses full AST on every node visit | Single rule consuming 60%+ of lint time | Use specific node selectors, not Program:exit with full traversal | Projects with files > 500 lines |
| Skill loads all reference files eagerly | Context window filled before user's code is loaded | Progressive disclosure; verify Claude loads files on-demand, not all at once | Complex coding tasks requiring large code context |
| Redundant type resolution | Multiple rules independently resolving the same types | Share type resolution results via rule metadata or caching patterns | Projects with complex type hierarchies |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Cryptic error messages ("Prefer narrow types") | User does not understand what is wrong or how to fix it | "Use `string \| number` instead of `any`. See: [link to opinion rationale]" |
| No autofix for fixable rules | User must manually fix every violation across entire codebase | Implement ESLint autofixes for every rule where the fix is unambiguous |
| All-or-nothing rule config | User wants 80% of opinions but that remaining 20% is a dealbreaker | Ship rules individually configurable; provide recommended config but let users override |
| Skill provides guidance but no examples | AI agent understands the rule but generates awkward code | Include before/after code examples for each opinion in the skill |
| No migration path for existing codebases | Turning on the plugin produces 500 errors on day one | Provide a "warn-all" starter config and a migration guide for incremental adoption |

## "Looks Done But Isn't" Checklist

- [ ] **Opinion list:** Often missing the "not automatable" classification -- verify each opinion is tagged as lint-enforceable or skill-only
- [ ] **ESLint rules:** Often missing autofix implementation -- verify every fixable rule has a working fixer
- [ ] **Rule testing:** Often missing "valid edge case" tests -- verify each rule has 2-3x more valid than invalid test cases
- [ ] **Skill testing:** Often missing multi-model testing -- verify the skill works on Haiku, Sonnet, and Opus
- [ ] **Performance:** Often missing benchmarks -- verify lint time is measured on a representative project (500+ files)
- [ ] **Documentation:** Often missing the "why" for each opinion -- verify every opinion has a rationale, not just a directive
- [ ] **Compatibility:** Often missing cross-config testing -- verify plugin works alongside typescript-eslint strict, prettier, and common plugin combos
- [ ] **Error messages:** Often missing fix suggestions -- verify every error message tells the user what to do instead

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Opinion sprawl (too many rules) | MEDIUM | Audit rules by usage/disable rate; deprecate low-value rules; communicate the "less is more" philosophy in changelog |
| Skill-plugin drift | LOW | Build the opinion registry retroactively; write sync-check CI test; reconcile all differences in a single PR |
| False positive epidemic | HIGH | Triage all reported false positives; downgrade affected rules to "warn"; add missing valid test cases; consider removing rules that cannot be fixed |
| Context window toxicity | MEDIUM | Refactor monolithic skill into progressive disclosure structure; cut explanatory prose; measure before/after token usage |
| ESLint version incompatibility | HIGH | Rewrite affected rules against current API; may require major version bump; users stuck on old version until migration |
| Performance degradation | MEDIUM | Profile with TIMING=1; convert type-aware rules to AST-only where possible; offer "fast" config; optimize hot-path rules |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Opinion sprawl | Phase 1: Opinion Curation | Opinion count stays within budget; each opinion passes the "prevents real harm" bar |
| Skill-plugin drift | Phase 1: Opinion Registry Design | CI test confirms 1:1 mapping between registry and both skill content and lint rules |
| False positives | Phase 2: ESLint Plugin Development | Every rule has 2-3x more valid than invalid test cases; zero false positives on typescript-eslint test corpus |
| Context window toxicity | Phase 1: Skill Architecture | SKILL.md under 500 lines; progressive disclosure verified; before/after quality comparison |
| ESLint version targeting | Phase 2: Plugin Scaffolding | CI tests pass on ESLint 10 and typescript-eslint v8+; no deprecated API usage |
| Type-aware performance | Phase 2: Rule Development | TIMING=1 benchmark on 500-file project stays under 10 seconds; each type-aware rule justified |

## Sources

- [Anthropic Skill Authoring Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) -- official guidance on context window budgets, progressive disclosure, SKILL.md limits
- [typescript-eslint Custom Rules](https://typescript-eslint.io/developers/custom-rules/) -- official docs on writing type-aware rules
- [typescript-eslint Typed Linting Performance](https://typescript-eslint.io/troubleshooting/typed-linting/performance/) -- performance profiling guidance
- [ESLint v9.0.0 Retrospective](https://eslint.org/blog/2025/05/eslint-v9.0.0-retrospective/) -- lessons from ESLint's own breaking change mistakes
- [ESLint v10.0.0 Release](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/) -- current API surface and deprecations
- [typescript-eslint Dependency Versions](https://typescript-eslint.io/users/dependency-versions/) -- TypeScript version support policy
- [Why Developers Hate Linters (CodeRabbit)](https://www.coderabbit.ai/blog/why-developers-hate-linters) -- false positive erosion and warning fatigue research
- [Agoda Engineering: Making Lint Rules Work](https://medium.com/agoda-engineering/how-to-make-linting-rules-work-from-enforcement-to-education-be7071d2fcf0) -- adoption strategies

---
*Pitfalls research for: Opinionated TypeScript guidance skill + ESLint plugin*
*Researched: 2026-03-16*
