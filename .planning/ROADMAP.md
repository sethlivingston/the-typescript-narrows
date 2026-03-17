# Roadmap: The TypeScript Narrows

## Overview

The TypeScript Narrows delivers a dual-artifact TypeScript guidance ecosystem: an opinion corpus as the single source of truth, a Claude skill for AI-agent-readable guidance, and an ESLint plugin for machine-enforced rules. The build order follows the natural dependency graph: define opinions first (everything derives from them), author the skill (it becomes the spec for rule behavior), scaffold the ESLint plugin infrastructure, implement custom rules against that infrastructure, then validate coverage across both artifacts and publish.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Opinion Foundation** - Define the canonical opinion corpus that both artifacts derive from (completed 2026-03-17)
- [ ] **Phase 2: Claude Skill** - Author the complete AI-agent-readable skill from the opinion corpus
- [ ] **Phase 3: ESLint Plugin Scaffold** - Build and prove the plugin infrastructure before writing rules
- [x] **Phase 4: Custom ESLint Rules** - Implement custom rules and opinionated configs that distinguish the plugin (completed 2026-03-17)
- [ ] **Phase 5: Coverage Validation and Publishing** - Validate cross-artifact coverage and ship both artifacts

## Phase Details

### Phase 1: Opinion Foundation
**Goal**: A structured, budgeted opinion corpus exists as the single source of truth for all downstream artifacts
**Depends on**: Nothing (first phase)
**Requirements**: OPIN-01, OPIN-02, OPIN-03, OPIN-04
**Success Criteria** (what must be TRUE):
  1. A structured opinion registry exists with up to 50 opinions (as many as the enumeration warrants), each with a unique ID, clear stance, rationale, and Do/Don't code examples
  2. Every opinion is classified with a severity tier (bug prevention > maintenance > style) and tagged as skill-only, lint-enforceable, or both
  3. The project directory structure is established with the docs/opinions/ directory containing README.md, INDEX.md, and all opinion files
  4. The opinion budget allows up to 50 opinions for v1, with a clear bar for inclusion ("prevents a real, recurring problem" or "eliminates a common ambiguity")
**Plans:** 5/5 plans complete

Plans:
- [ ] 01-01-PLAN.md -- Create opinion corpus structure (README.md + INDEX.md)
- [ ] 01-02-PLAN.md -- Author Type Safety, Type Declarations, Naming, and tsconfig opinions (17)
- [ ] 01-03-PLAN.md -- Author Null Handling, Async, Error Handling, and Conditional Types opinions (16)
- [ ] 01-04-PLAN.md -- Author Immutability, Modules, Discriminated Unions, Generics, and Branded Types opinions (17)
- [ ] 01-05-PLAN.md -- Gap closure: fix INDEX.md summary stats and ROADMAP criterion scope

### Phase 2: Claude Skill
**Goal**: A complete, publishable Claude skill delivers all TypeScript opinions in an AI-agent-optimized format
**Depends on**: Phase 1
**Requirements**: SKIL-01, SKIL-02, SKIL-03, SKIL-04, SKIL-05, SKIL-06, SKIL-07, SKIL-08, SKIL-09, SKIL-10, SKIL-11, SKIL-12, SKIL-13, SKIL-14, SKIL-15, SKIL-16, SKIL-17, SKIL-18, SKIL-19, SKIL-20, SKIL-21
**Success Criteria** (what must be TRUE):
  1. SKILL.md exists with valid YAML frontmatter, is under 500 lines, and serves as a concise index with progressive disclosure into references/*.md files
  2. An AI agent loading the skill receives a clear, single opinion for every covered TypeScript decision point (type vs interface, enum stance, error handling, async, null handling, naming, modules, generics, branded types, variance)
  3. Every opinion includes a "why" rationale that the AI agent can relay to the developer when questioned
  4. The skill is framework and platform agnostic -- no React, Next.js, Express, or other framework-specific opinions appear anywhere
  5. The skill is structured for Claude skill registry publication (correct frontmatter, file layout, activation triggers)
**Plans:** 4/5 plans executed

Plans:
- [ ] 02-01-PLAN.md -- Create SKILL.md with frontmatter, preamble, and 50-opinion index
- [ ] 02-02-PLAN.md -- Author reference files: Type Safety, Type Declarations, Null Handling, Async (23 opinions)
- [ ] 02-03-PLAN.md -- Author reference files: Error Handling, Immutability, Modules, Naming (16 opinions)
- [ ] 02-04-PLAN.md -- Author reference files: Discriminated Unions, Generics, tsconfig/Advanced (11 opinions)
- [ ] 02-05-PLAN.md -- Validate coverage, format compliance, and fix issues

### Phase 3: ESLint Plugin Scaffold
**Goal**: A working ESLint plugin package exists with build tooling, test infrastructure, and flat config exports proven before any rules are written
**Depends on**: Phase 1
**Requirements**: LINT-01, LINT-02, LINT-03, LINT-04, LINT-05
**Success Criteria** (what must be TRUE):
  1. Running `npm install eslint-plugin-typescript-narrows` (or local equivalent) and adding a single import to eslint.config.ts activates the plugin with zero additional configuration
  2. The plugin exports a strict config preset that extends typescript-eslint strict-type-checked with opinionated rule configurations
  3. The plugin composes cleanly alongside existing typescript-eslint configs and other custom ESLint rules without conflicts
  4. The build produces both CJS and ESM outputs with type declarations, and the test suite runs with Vitest and @typescript-eslint/rule-tester against ESLint 10
  5. The package is structured for npm publication with correct peer dependencies (eslint ^9 || ^10, @typescript-eslint/parser ^8)
**Plans:** 3 plans

Plans:
- [ ] 03-01-PLAN.md -- Scaffold package with build tooling and test infrastructure
- [ ] 03-02-PLAN.md -- Implement plugin source: strict preset, placeholder rule, RuleCreator
- [ ] 03-03-PLAN.md -- Create test suite: rule tests, config validation, integration smoke test

### Phase 4: Custom ESLint Rules
**Goal**: Custom rules covering gaps that no existing plugin addresses are implemented, tested, and integrated into the preset configs
**Depends on**: Phase 2, Phase 3
**Requirements**: LINT-06, LINT-07, LINT-08
**Success Criteria** (what must be TRUE):
  1. Each custom rule addresses a genuine gap -- something that existing typescript-eslint rules cannot enforce (enum ban with as-const alternative, typed catch clauses, discriminated union enforcement)
  2. Every custom rule has a comprehensive test suite with 2-3x more valid (should-pass) cases than invalid cases, preventing false positive erosion of trust
  3. Custom rules are integrated into the plugin's preset configs and activate automatically when a user imports the recommended config
  4. Rule error messages reference the opinion rationale, telling the developer WHY the pattern is problematic
**Plans:** 2/2 plans complete

Plans:
- [ ] 04-01-PLAN.md -- Implement ban-enums and ban-barrel-files rules with TDD test suites
- [ ] 04-02-PLAN.md -- Wire rules into plugin registry, update strict preset and smoke tests

### Phase 5: Coverage Validation and Publishing
**Goal**: Both artifacts are verified to cover all enumerated TypeScript ambiguities, and both are published to their respective registries
**Depends on**: Phase 4
**Requirements**: COVR-01, COVR-02, COVR-03
**Success Criteria** (what must be TRUE):
  1. A traceability matrix exists mapping every item in the 50-item ambiguity/gotcha list to the skill section, lint rule, or both that address it -- with no gaps
  2. Lint rules exist only where static analysis makes sense -- guidance-only opinions are clearly marked as skill-only with no forced automation
  3. The ESLint plugin is published on npm and installable by external users
  4. The Claude skill is deployable to .claude/skills/ or the Claude skill registry
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5
Note: Phases 2 and 3 depend only on Phase 1, not on each other.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Opinion Foundation | 5/5 | Complete   | 2026-03-17 |
| 2. Claude Skill | 4/5 | In Progress|  |
| 3. ESLint Plugin Scaffold | 0/3 | Not started | - |
| 4. Custom ESLint Rules | 2/2 | Complete   | 2026-03-17 |
| 5. Coverage Validation and Publishing | 0/? | Not started | - |
