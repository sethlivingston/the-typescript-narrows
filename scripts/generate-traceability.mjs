import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// ---------------------------------------------------------------------------
// 1. Parse opinion frontmatter
// ---------------------------------------------------------------------------

function parseFrontmatter(content) {
  const parts = content.split(/^---$/m);
  if (parts.length < 3) return null;

  const yaml = parts[1];
  const result = {};
  let currentNested = null;

  for (const line of yaml.split('\n')) {
    if (line.trim() === '') continue;

    // Nested key (indented under lint:)
    if (/^\s+\w/.test(line) && currentNested) {
      const match = line.match(/^\s+(\w+):\s*(.+)/);
      if (match) {
        result[currentNested][match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
      continue;
    }

    // Top-level key
    const topMatch = line.match(/^(\w[\w-]*):\s*(.*)/);
    if (topMatch) {
      const key = topMatch[1];
      let value = topMatch[2].trim();

      // Check if this is a nested block (value is empty = block start)
      if (value === '') {
        currentNested = key;
        result[key] = {};
        continue;
      }

      currentNested = null;

      // Array value
      if (value.startsWith('[') && value.endsWith(']')) {
        result[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        continue;
      }

      // Strip quotes
      value = value.replace(/^["']|["']$/g, '');
      result[key] = value;
    }
  }

  return result;
}

function loadOpinions() {
  const opinionsDir = join(ROOT, 'docs', 'opinions');
  const files = readdirSync(opinionsDir).filter(
    f => f.endsWith('.md') && f !== 'INDEX.md' && f !== 'README.md'
  );

  const opinions = [];
  for (const file of files) {
    const content = readFileSync(join(opinionsDir, file), 'utf-8');
    const fm = parseFrontmatter(content);
    if (fm && fm.id) {
      opinions.push({
        id: fm.id,
        title: fm.title || fm.id,
        severity: fm.severity || 'unknown',
        enforcement: fm.enforcement || 'unknown',
        lint: fm.lint || null,
        file,
      });
    }
  }

  opinions.sort((a, b) => a.id.localeCompare(b.id));
  return opinions;
}

// ---------------------------------------------------------------------------
// 2. Extract rules from strict.ts
// ---------------------------------------------------------------------------

function loadStrictRules() {
  const strictPath = join(ROOT, 'eslint-plugin', 'src', 'configs', 'strict.ts');
  const content = readFileSync(strictPath, 'utf-8');

  const rules = new Set();
  // Match rule names: 'rule-name': 'error' or 'rule-name': ['error', ...] or 'rule-name': [\n  'error', ...]
  const rulePattern = /['"]([^'"]+)['"]\s*:\s*(?:['"]error['"]|\[[\s\n]*['"]error['"])/g;
  let match;
  while ((match = rulePattern.exec(content)) !== null) {
    rules.add(match[1]);
  }

  return rules;
}

// ---------------------------------------------------------------------------
// 3. Load skill reference files
// ---------------------------------------------------------------------------

function loadSkillReferences() {
  const refsDir = join(ROOT, 'plugin', 'the-typescript-narrows', 'skills', 'the-typescript-narrows', 'references');
  const files = readdirSync(refsDir).filter(f => f.endsWith('.md'));

  const refs = [];
  for (const file of files) {
    const content = readFileSync(join(refsDir, file), 'utf-8');
    refs.push({ file, content: content.toLowerCase() });
  }

  return refs;
}

function stripMarkdown(text) {
  return text.replace(/`/g, '').replace(/\*/g, '').replace(/[[\]]/g, '').replace(/[;,()]/g, '');
}

function isSkillCovered(opinion, refs) {
  const idPattern = opinion.id.toLowerCase();
  const titleClean = stripMarkdown(opinion.title).toLowerCase();

  for (const ref of refs) {
    const contentClean = stripMarkdown(ref.content);

    // Match by opinion ID (kebab-case)
    if (contentClean.includes(idPattern)) {
      return ref.file;
    }

    // Match by cleaned title
    if (contentClean.includes(titleClean)) {
      return ref.file;
    }

    // Match by significant title words (3+ word overlap from title in a single heading)
    // Extract H2 headings from the reference
    const headings = ref.content.match(/^## .+$/gm) || [];
    for (const heading of headings) {
      const headingClean = stripMarkdown(heading.replace(/^## /, '')).toLowerCase();
      // Check if the heading and title share enough content
      // Strategy: check if key words from opinion title appear in heading
      const titleTokens = titleClean.split(/\s+/).filter(w => w.length > 2);
      const matchCount = titleTokens.filter(t => headingClean.includes(t)).length;
      if (titleTokens.length > 0 && matchCount >= Math.min(3, titleTokens.length)) {
        return ref.file;
      }
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// 4. Validate coverage
// ---------------------------------------------------------------------------

function validateOpinion(opinion, strictRules, refs) {
  const skillRef = isSkillCovered(opinion, refs);
  const enforcement = opinion.enforcement;

  let lintRule = '--';
  let status = 'gap';

  if (enforcement === 'skill-only') {
    // Skill-only: must have skill coverage, must NOT have lint rule in strict
    if (skillRef) {
      // Verify no lint rule is configured (by checking if opinion's id maps to a rule)
      status = 'skill-only';
    } else {
      status = 'gap';
    }
    return { skillRef: skillRef || '--', lintRule: '--', status };
  }

  if (enforcement === 'both') {
    const lint = opinion.lint;
    if (!lint) {
      return { skillRef: skillRef || '--', lintRule: '--', status: 'gap' };
    }

    if (lint.type === 'existing') {
      lintRule = lint.rule;
      const ruleInStrict = strictRules.has(lint.rule);
      if (ruleInStrict && skillRef) {
        status = 'covered';
      } else {
        status = 'gap';
      }
    } else if (lint.type === 'custom') {
      // Custom rules: check for typescript-narrows/{id} in strict.ts
      // Special case: no-const-enum is enforced by ban-enums rule
      // Special case: single-discriminant and no-destructure-before-narrow
      //   are custom rules not yet implemented
      const customRuleName = `typescript-narrows/${opinion.id}`;

      if (opinion.id === 'no-const-enum') {
        // Enforced as part of ban-enums rule
        lintRule = 'typescript-narrows/ban-enums';
        if (strictRules.has('typescript-narrows/ban-enums') && skillRef) {
          status = 'covered';
        } else {
          status = 'gap';
        }
      } else if (strictRules.has(customRuleName)) {
        lintRule = customRuleName;
        if (skillRef) {
          status = 'covered';
        } else {
          status = 'gap';
        }
      } else {
        // Check if there's an existing rule that covers it
        lintRule = customRuleName;
        // For custom rules not yet implemented, they are gaps
        // unless they're covered by another mechanism
        status = 'gap';
      }
    }

    return { skillRef: skillRef || '--', lintRule, status };
  }

  return { skillRef: skillRef || '--', lintRule: '--', status: 'gap' };
}

// ---------------------------------------------------------------------------
// 5. Generate markdown
// ---------------------------------------------------------------------------

function severityInitial(severity) {
  const map = { 'bug-prevention': 'B', maintenance: 'M', style: 'S' };
  return map[severity] || severity.charAt(0).toUpperCase();
}

function generateMarkdown(opinions, results) {
  const date = new Date().toISOString().split('T')[0];
  const covered = results.filter(r => r.status === 'covered').length;
  const skillOnly = results.filter(r => r.status === 'skill-only').length;
  const gaps = results.filter(r => r.status === 'gap').length;

  let md = `# Traceability Matrix\n\n`;
  md += `Generated: ${date} | Opinions: ${opinions.length} | Covered: ${covered} | Skill-only: ${skillOnly} | Gaps: ${gaps}\n\n`;

  md += `## Coverage\n\n`;
  md += `| Opinion ID | Title | Severity | Enforcement | Skill Reference | Lint Rule(s) | Status |\n`;
  md += `|------------|-------|----------|-------------|-----------------|--------------|--------|\n`;

  for (let i = 0; i < opinions.length; i++) {
    const o = opinions[i];
    const r = results[i];
    md += `| ${o.id} | ${o.title} | ${severityInitial(o.severity)} | ${o.enforcement} | ${r.skillRef} | ${r.lintRule} | ${r.status} |\n`;
  }

  md += `\n## Gaps\n\n`;
  const gapEntries = opinions
    .map((o, i) => ({ opinion: o, result: results[i] }))
    .filter(e => e.result.status === 'gap');

  if (gapEntries.length === 0) {
    md += `(none)\n`;
  } else {
    md += `| Opinion ID | Title | Enforcement | Issue |\n`;
    md += `|------------|-------|-------------|-------|\n`;
    for (const { opinion, result } of gapEntries) {
      let issue = '';
      if (opinion.enforcement === 'both') {
        const missingLint = result.lintRule === '--' || !result.lintRule;
        const missingSkill = result.skillRef === '--';
        const parts = [];
        if (missingLint) parts.push('missing lint rule');
        if (missingSkill) parts.push('missing skill reference');
        if (!missingLint && !missingSkill) parts.push('lint rule not in strict config');
        issue = parts.join(', ');
      } else {
        issue = 'missing skill reference';
      }
      md += `| ${opinion.id} | ${opinion.title} | ${opinion.enforcement} | ${issue} |\n`;
    }
  }

  return md;
}

// ---------------------------------------------------------------------------
// 6. Main
// ---------------------------------------------------------------------------

function main() {
  const validate = process.argv.includes('--validate');

  const opinions = loadOpinions();
  const strictRules = loadStrictRules();
  const refs = loadSkillReferences();

  const results = opinions.map(o => validateOpinion(o, strictRules, refs));

  const md = generateMarkdown(opinions, results);

  const docsDir = join(ROOT, 'docs');
  mkdirSync(docsDir, { recursive: true });
  writeFileSync(join(docsDir, 'TRACEABILITY.md'), md);

  const covered = results.filter(r => r.status === 'covered').length;
  const skillOnly = results.filter(r => r.status === 'skill-only').length;
  const gaps = results.filter(r => r.status === 'gap').length;

  console.log(`Traceability matrix generated: docs/TRACEABILITY.md`);
  console.log(`  Opinions: ${opinions.length}`);
  console.log(`  Covered (both): ${covered}`);
  console.log(`  Skill-only: ${skillOnly}`);
  console.log(`  Gaps: ${gaps}`);

  if (gaps > 0) {
    const gapEntries = opinions
      .map((o, i) => ({ opinion: o, result: results[i] }))
      .filter(e => e.result.status === 'gap');

    process.stderr.write(`\nGaps found:\n`);
    for (const { opinion, result } of gapEntries) {
      process.stderr.write(`  - ${opinion.id} (${opinion.enforcement}): lint=${result.lintRule}, skill=${result.skillRef}\n`);
    }

    if (validate) {
      process.exit(1);
    }
  } else if (validate) {
    console.log('\nValidation passed: all opinions covered.');
    process.exit(0);
  }
}

main();
