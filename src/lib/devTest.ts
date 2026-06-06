/**
 * Development-only self-test for the full pipeline.
 *
 * This file is NOT imported by the application at runtime.
 * Import it in the browser console or a test runner for manual verification.
 *
 * Usage (in browser console or Node):
 *   import { runDevTest } from '@/lib/devTest';
 *   await runDevTest();
 */

import { laughHistorySample } from '@/data/samples/laughHistorySample';
import { parseChapters } from './chapterParser';
import { mockGenerateScriptYaml } from './mockGenerateScriptYaml';
import { validateScriptYaml } from './schema';
import { scriptYamlToYamlString } from './yamlExport';

interface DevTestReport {
  step: string;
  passed: boolean;
  details: string;
}

export async function runDevTest(): Promise<DevTestReport[]> {
  const reports: DevTestReport[] = [];

  // ---- Step 1: Parse chapters ----
  try {
    const chapters = parseChapters(laughHistorySample, 3);
    if (chapters.length < 3) {
      reports.push({
        step: 'parseChapters',
        passed: false,
        details: `Expected ≥3 chapters, got ${chapters.length}`,
      });
    } else {
      reports.push({
        step: 'parseChapters',
        passed: true,
        details: `Parsed ${chapters.length} chapters: ${chapters.map((c) => c.title).join(', ')}`,
      });
    }
  } catch (err) {
    reports.push({
      step: 'parseChapters',
      passed: false,
      details: `Threw: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  // ---- Step 2: Generate mock YAML ----
  let chapters: ReturnType<typeof parseChapters>;
  try {
    chapters = parseChapters(laughHistorySample, 3);
    const scriptYaml = mockGenerateScriptYaml(laughHistorySample, chapters);
    if (!scriptYaml || !scriptYaml.script) {
      reports.push({
        step: 'mockGenerateScriptYaml',
        passed: false,
        details: 'Returned undefined or missing script root.',
      });
    } else {
      const sceneCount = scriptYaml.script.scenes?.length ?? 0;
      const charCount = scriptYaml.script.characters?.length ?? 0;
      reports.push({
        step: 'mockGenerateScriptYaml',
        passed: true,
        details: `Generated ${sceneCount} scenes, ${charCount} characters.`,
      });
    }
  } catch (err) {
    reports.push({
      step: 'mockGenerateScriptYaml',
      passed: false,
      details: `Threw: ${err instanceof Error ? err.message : String(err)}`,
    });
    return reports; // can't continue without this data
  }

  // ---- Step 3: Validate ----
  try {
    const scriptYaml = mockGenerateScriptYaml(laughHistorySample, chapters);
    const result = validateScriptYaml(scriptYaml);
    if (result.success) {
      reports.push({
        step: 'validateScriptYaml',
        passed: true,
        details: 'Schema validation passed.',
      });
    } else {
      reports.push({
        step: 'validateScriptYaml',
        passed: false,
        details: `Validation failed: ${result.errors.issues.length} issues.`,
      });
    }
  } catch (err) {
    reports.push({
      step: 'validateScriptYaml',
      passed: false,
      details: `Threw: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  // ---- Step 4: YAML export ----
  try {
    const scriptYaml = mockGenerateScriptYaml(laughHistorySample, chapters);
    const yamlString = scriptYamlToYamlString(scriptYaml);
    if (typeof yamlString === 'string' && yamlString.length > 0) {
      reports.push({
        step: 'scriptYamlToYamlString',
        passed: true,
        details: `Exported YAML string (${yamlString.length} chars).`,
      });
    } else {
      reports.push({
        step: 'scriptYamlToYamlString',
        passed: false,
        details: 'Output is empty or not a string.',
      });
    }
  } catch (err) {
    reports.push({
      step: 'scriptYamlToYamlString',
      passed: false,
      details: `Threw: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  // ---- Step 5: normalizeScriptYamlOutput — round-trip test ----
  try {
    const { normalizeScriptYamlOutput } = await import('./normalizeScriptYaml');
    const scriptYaml = mockGenerateScriptYaml(laughHistorySample, chapters);
    const jsonString = JSON.stringify(scriptYaml);

    // Test direct parse
    const normalized = normalizeScriptYamlOutput(jsonString);
    if (normalized && normalized.script) {
      reports.push({
        step: 'normalizeScriptYamlOutput (direct)',
        passed: true,
        details: 'Direct JSON round-trip succeeded.',
      });
    }

    // Test fence extraction
    const fenced = '```json\n' + jsonString + '\n```';
    const normalized2 = normalizeScriptYamlOutput(fenced);
    if (normalized2 && normalized2.script) {
      reports.push({
        step: 'normalizeScriptYamlOutput (fenced)',
        passed: true,
        details: 'Markdown fence extraction succeeded.',
      });
    }

    // Test brace extraction (with noise)
    const noisy = '一些前言文字\n' + jsonString + '\n一些后记文字';
    const normalized3 = normalizeScriptYamlOutput(noisy);
    if (normalized3 && normalized3.script) {
      reports.push({
        step: 'normalizeScriptYamlOutput (noisy)',
        passed: true,
        details: 'Brace extraction with noise succeeded.',
      });
    }
  } catch (err) {
    reports.push({
      step: 'normalizeScriptYamlOutput',
      passed: false,
      details: `Threw: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  return reports;
}

/**
 * Focused schema validation test.
 *
 * Parses the sample, generates mock data, and validates against the Zod schema.
 * Prints results via console.log / console.error.
 *
 * Usage (in Node):
 *   npx tsx -e "import { runSchemaDevTest } from './src/lib/devTest'; runSchemaDevTest();"
 */
export function runSchemaDevTest(): void {
  console.log('=== Schema Dev Test ===\n');

  // 1. Parse
  const chapters = parseChapters(laughHistorySample, 3);
  console.log(`[1] parseChapters: ${chapters.length} chapters found`);
  chapters.forEach((ch) => {
    console.log(`    ${ch.chapter_id}: "${ch.title}" (${ch.content.length} chars)`);
  });

  // 2. Generate
  const data = mockGenerateScriptYaml(laughHistorySample, chapters);
  console.log(`\n[2] mockGenerateScriptYaml: ${data.script.scenes.length} scenes, ${data.script.characters.length} characters, ${data.script.locations.length} locations`);

  // 3. Validate
  const result = validateScriptYaml(data);

  if (result.success) {
    console.log('\n[3] validateScriptYaml: ✅ Schema validation PASSED');
  } else {
    console.log(`\n[3] validateScriptYaml: ❌ Schema validation FAILED — ${result.errors.issues.length} issues:`);
    result.errors.issues.forEach((issue, i) => {
      console.log(`    ${i + 1}. ${issue.path.join('.')} — ${issue.message}`);
    });
  }

  // 4. Summary
  const yamlStr = scriptYamlToYamlString(data);
  console.log(`\n[4] YAML output: ${yamlStr.length} chars`);
  console.log('\n=== Done ===');
}
