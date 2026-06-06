import { ScriptYaml } from './types';
import { validateScriptYaml } from './schema';

const PLACEHOLDER = '待补充';

// DeepSeek often uses Chinese beat types — map them to the 6 allowed English values
const BEAT_TYPE_MAP: Record<string, string> = {
  '动作': 'action',
  '行动': 'action',
  '行为': 'action',
  '情感': 'emotion',
  '情绪': 'emotion',
  '感情': 'emotion',
  '事件': 'event',
  '情节': 'event',
  '视觉': 'visual',
  '画面': 'visual',
  '声音': 'sound',
  '音效': 'sound',
  '听觉': 'sound',
  '记忆': 'memory',
  '回忆': 'memory',
  '对话': 'action',
  '独白': 'emotion',
  '心理': 'emotion',
  '旁白': 'action',
  '对白': 'action',
  '环境': 'visual',
  '气氛': 'visual',
};

function normalizeBeatType(value: string): string {
  const lower = value.trim();
  // Already valid English
  const valid = ['action', 'emotion', 'event', 'visual', 'sound', 'memory'];
  if (valid.includes(lower)) return lower;
  // Try Chinese mapping
  return BEAT_TYPE_MAP[lower] || 'action';
}

/**
 * Schema-aware deep-walk: fills empties, normalizes beat types, fixes malformed relationships.
 */
function sanitizeData(obj: unknown, parentKey?: string): unknown {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    // Normalize beat type values
    if (parentKey === 'type') {
      return normalizeBeatType(obj);
    }
    return obj.trim() === '' ? PLACEHOLDER : obj;
  }

  if (Array.isArray(obj)) {
    // Empty arrays that should contain objects — provide one minimal record
    if (obj.length === 0) {
      if (parentKey === 'relationships') {
        return [{ target_character_id: 'char_unknown', relationship_type: PLACEHOLDER, description: PLACEHOLDER }];
      }
      if (parentKey === 'dialogue') {
        return [{ dialogue_id: 'dlg_auto_001', speaker: 'char_unknown', speaker_name: '未知', line: PLACEHOLDER, emotion: '', action: '' }];
      }
      if (parentKey === 'beats') {
        return [{ beat_id: 'beat_auto_001', type: 'action' as const, content: PLACEHOLDER, related_character_id: '' }];
      }
      return [PLACEHOLDER];
    }

    // Relationships array where elements are strings → convert to objects
    if (parentKey === 'relationships') {
      return obj.map((el, i) => {
        if (typeof el === 'object' && el !== null) return sanitizeData(el, undefined);
        const s = typeof el === 'string' ? el : PLACEHOLDER;
        return {
          target_character_id: 'char_unknown',
          relationship_type: s,
          description: s,
        };
      });
    }

    // Dialogue array where elements are strings → convert to objects
    if (parentKey === 'dialogue') {
      return obj.map((el, i) => {
        if (typeof el === 'object' && el !== null) return sanitizeData(el, undefined);
        const s = typeof el === 'string' ? el : PLACEHOLDER;
        return {
          dialogue_id: `dlg_auto_${String(i + 1).padStart(3, '0')}`,
          speaker: 'char_unknown',
          speaker_name: '未知',
          line: s,
          emotion: '',
          action: '',
        };
      });
    }

    return obj.map((el) => sanitizeData(el, parentKey));
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = sanitizeData(value, key);
    }
    return result;
  }

  return obj;
}

/**
 * Normalize raw AI output string into a validated ScriptYaml object.
 *
 * Attempts multiple extraction strategies in order:
 *   1. Direct JSON.parse
 *   2. Extract from ```json ... ``` code fence
 *   3. Extract from first "{" to last "}"
 *
 * @throws Error with descriptive message if all strategies fail or validation fails.
 */
export function normalizeScriptYamlOutput(rawOutput: string): ScriptYaml {
  const trimmed = rawOutput.trim();
  if (!trimmed) {
    throw new Error('AI 返回了空内容。');
  }

  let parsed: unknown;
  let strategy = 'unknown';

  // Strategy 1: direct JSON.parse
  try {
    parsed = JSON.parse(trimmed);
    strategy = 'direct-parse';
  } catch {
    // Strategy 2: extract from ```json ... ``` code fence
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) {
      try {
        parsed = JSON.parse(fenceMatch[1]);
        strategy = 'fence-extract';
      } catch {
        // Fall through to strategy 3
      }
    }
  }

  // Strategy 3: extract from first "{" to last "}"
  if (parsed === undefined) {
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        parsed = JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
        strategy = 'brace-extract';
      } catch {
        throw new Error(
          '无法解析 AI 返回内容：从第一个 { 到最后一个 } 之间提取的内容不是合法 JSON。'
        );
      }
    } else {
      throw new Error(
        '无法解析 AI 返回内容：未找到可识别的 JSON 对象（缺少花括号）。'
      );
    }
  }

  // Sanitize: fill empty strings/arrays with placeholder so AI imperfections don't break validation
  parsed = sanitizeData(parsed);

  // Validate against schema
  const validation = validateScriptYaml(parsed);
  if (!validation.success) {
    const issues = validation.errors.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `剧本 JSON 校验失败 (提取策略: ${strategy}):\n${issues}`
    );
  }

  return validation.data;
}
