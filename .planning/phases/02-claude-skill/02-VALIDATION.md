---
phase: 2
slug: claude-skill
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Shell-based validation (no test framework needed) |
| **Config file** | none |
| **Quick run command** | `npx skills-ref validate ./skill/the-typescript-narrows` |
| **Full suite command** | `npx skills-ref validate ./skill/the-typescript-narrows && wc -l skill/the-typescript-narrows/SKILL.md && grep -ri "react\|next\|express\|angular\|vue" skill/ ; grep -c "\\*\\*Why:\\*\\*" skill/the-typescript-narrows/references/*.md` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx skills-ref validate ./skill/the-typescript-narrows && wc -l skill/the-typescript-narrows/SKILL.md`
- **After every plan wave:** Run full suite command
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 0 | SKIL-18, SKIL-21 | unit | `npx skills-ref validate ./skill/the-typescript-narrows` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 0 | SKIL-19 | unit | `wc -l skill/the-typescript-narrows/SKILL.md` (< 500) | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 0 | SKIL-20 | unit | `grep -ri "react\|next\|express\|angular\|vue" skill/` (expect 0 matches) | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 0 | SKIL-10 | unit | `grep -c "\\*\\*Why:\\*\\*" skill/the-typescript-narrows/references/*.md` (sum = 50) | ❌ W0 | ⬜ pending |
| 02-01-05 | 01 | 0 | SKIL-01 to SKIL-09, SKIL-11 to SKIL-17 | unit | `grep -c "^## " skill/the-typescript-narrows/references/*.md` (sum = 50) | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `skill/the-typescript-narrows/` directory — needs creation
- [ ] `skill/the-typescript-narrows/references/` directory — needs creation
- [ ] `skills-ref` availability — verify `npx skills-ref validate` works
- [ ] Validation script — shell commands to count opinions, check framework refs, verify line count

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Opinion content quality (imperative voice, tight prose) | SKIL-10 | Content quality can't be automated | Read each reference file, verify imperative voice and concise rationale |
| Tagline conveys core value | SKIL-18 | Subjective quality | Read preamble, confirm tagline communicates "eliminating multiple ways" |
| Each opinion has Do and Don't examples | SKIL-10 | Code example presence is checkable, quality is not | Grep for Do:/Don't: blocks, then spot-check examples |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
