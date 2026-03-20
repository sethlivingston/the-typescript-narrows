---
phase: quick/260317-mtj
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - README.md
  - eslint-plugin/README.md
  - skill/the-typescript-narrows/README.md
  - docs/opinions/INDEX.md
autonomous: true
requirements: []
must_haves:
  truths:
    - "No consumer-facing .md file contains a hardcoded opinion or rule count that would break when opinions are added or removed"
    - "Approximate counts (e.g. '50+', 'over 30') convey the same scale information to readers"
  artifacts:
    - path: "README.md"
      provides: "Root project README without fragile counts"
    - path: "eslint-plugin/README.md"
      provides: "ESLint plugin README without fragile counts"
    - path: "skill/the-typescript-narrows/README.md"
      provides: "Skill README without fragile counts"
    - path: "docs/opinions/INDEX.md"
      provides: "Opinion index without fragile header count"
  key_links: []
---

<objective>
Replace all fragile specific counts in consumer-facing .md files with approximate ranges or remove them entirely.

Purpose: Specific counts like "59 opinions" and "35 of the 59 opinions" break every time an opinion is added or removed. Replace with durable approximate language.
Output: Four .md files updated with approximate or removed counts.
</objective>

<execution_context>
@/Users/sethlivingston/.claude/get-shit-done/workflows/execute-plan.md
@/Users/sethlivingston/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Replace fragile counts in all consumer-facing .md files</name>
  <files>README.md, eslint-plugin/README.md, skill/the-typescript-narrows/README.md, docs/opinions/INDEX.md</files>
  <action>
Replace specific opinion/rule counts with approximate language in these four files. Do NOT touch .planning/ files (those are historical records).

**README.md** (root):
- Line 3: "59 opinions covering" -> "over 50 opinions covering"
- Line 7: "all 59 opinions" -> "all opinions"
- Line 8: "35 of the 59 opinions" -> "over half of the opinions"
- Line 16: "all 59 opinions" -> "all opinions"

**eslint-plugin/README.md**:
- Line 24: "24 typescript-eslint rules" -> "20+ typescript-eslint rules"
- Line 29: "32 rules total, enforcing 35 of the project's 59 opinions" -> "30+ rules total, enforcing over half of the project's opinions"
- Line 40: "all 59 opinions" -> "all opinions"; "the 24 opinions that cannot" -> "the opinions that cannot"

**skill/the-typescript-narrows/README.md**:
- Line 19: "59 opinionated TypeScript guidelines" -> "over 50 opinionated TypeScript guidelines"
- Line 23: "35 of these opinions" -> "over half of these opinions"

**docs/opinions/INDEX.md**:
- Line 3: "59 opinions organized by topic" -> "Opinions organized by topic" (the count adds nothing here since the reader can see the full list below)

Use judgment on exact phrasing -- the goal is to remove specific numbers while preserving the informational intent. "Over 50" conveys scale. "Over half" conveys the lint/skill split. Counts that are purely decorative should just be removed.
  </action>
  <verify>
    <automated>! grep -n '\b59 opinion' README.md eslint-plugin/README.md skill/the-typescript-narrows/README.md docs/opinions/INDEX.md && ! grep -n '\b35 of' README.md eslint-plugin/README.md skill/the-typescript-narrows/README.md docs/opinions/INDEX.md && ! grep -n '\b32 rules' eslint-plugin/README.md && ! grep -n 'the 24 opinion' eslint-plugin/README.md && echo "PASS: no fragile counts found"</automated>
  </verify>
  <done>All four consumer-facing .md files use approximate or removed counts instead of specific numbers. No hardcoded opinion or rule counts remain in consumer-facing documentation.</done>
</task>

</tasks>

<verification>
Grep all four files for patterns like "\b[0-9]{2,} opinion" and "\b[0-9]{2,} rule" to confirm no specific counts remain.
</verification>

<success_criteria>
- Zero occurrences of specific opinion/rule counts (59, 35, 32, 24) in the four consumer-facing files
- Approximate language ("over 50", "over half", "20+", "30+") preserves scale information where useful
- Prose still reads naturally
</success_criteria>

<output>
After completion, create `.planning/quick/260317-mtj-replace-fragile-specific-counts-in-md-fi/260317-mtj-SUMMARY.md`
</output>
