import { ParsedChapter, ScriptYaml } from './types';
import { mockGenerateScriptYaml } from './mockGenerateScriptYaml';

export type ScriptGenerationMode = 'mock' | 'ai';

interface GenerateParams {
  inputText: string;
  chapters: ParsedChapter[];
  mode: ScriptGenerationMode;
}

/**
 * Unified entry point for script generation.
 *
 * - mode="mock": returns a fixed example (Phase 1 behavior).
 * - mode="ai":   calls the server-side API route POST /api/generate-script.
 *                 The API key stays on the server — never exposed to the client.
 */
export async function generateScriptYaml(params: GenerateParams): Promise<ScriptYaml> {
  const { inputText, chapters, mode } = params;

  switch (mode) {
    case 'mock':
      return mockGenerateScriptYaml(inputText, chapters);

    case 'ai': {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText, chapters }),
      });

      const body: { success: boolean; data?: ScriptYaml; error?: string } =
        await response.json();

      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.error || `API 请求失败 (HTTP ${response.status})`);
      }

      return body.data;
    }

    default: {
      const _exhaustive: never = mode;
      throw new Error(`Unknown generation mode: ${String(_exhaustive)}`);
    }
  }
}
