import { NextRequest, NextResponse } from 'next/server';
import { parseChapters } from '@/lib/chapterParser';
import {
  buildScriptGenerationSystemPrompt,
  buildScriptGenerationUserPrompt,
} from '@/lib/prompts/scriptGenerationPrompt';
import { normalizeScriptYamlOutput } from '@/lib/normalizeScriptYaml';
import { validateScriptYaml } from '@/lib/schema';

const MAX_INPUT_LENGTH = 30_000;

/** Detect if the value looks like an unconfigured placeholder. */
function isPlaceholder(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    lower.includes('请在这里粘贴') ||
    lower.includes('your-key') ||
    lower.includes('your_api_key') ||
    lower === 'sk-your-' ||
    value.trim() === ''
  );
}

export async function POST(request: NextRequest) {
  try {
    // ---- Parse & validate body ----
    let body: { inputText?: string; chapters?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: '请求 body 不是合法 JSON。' },
        { status: 400 }
      );
    }

    const { inputText, chapters } = body;

    if (!inputText || typeof inputText !== 'string' || !inputText.trim()) {
      return NextResponse.json(
        { success: false, error: 'inputText 是必填字段，不能为空。' },
        { status: 400 }
      );
    }

    if (inputText.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `当前版本暂不支持超过 ${MAX_INPUT_LENGTH} 字符的小说文本（当前 ${inputText.length} 字符），请先缩短文本或分章节处理。`,
        },
        { status: 400 }
      );
    }

    // Validate chapters: must be non-empty array with at least 3 entries
    if (!Array.isArray(chapters) || chapters.length < 3) {
      // Try to re-parse from inputText as fallback
      try {
        const reparsed = parseChapters(inputText, 3);
        if (reparsed.length < 3) {
          return NextResponse.json(
            {
              success: false,
              error: `chapters 必须至少包含 3 个章节（当前识别到 ${reparsed.length} 个）。`,
            },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, error: 'chapters 是必填字段，必须至少包含 3 个章节。' },
          { status: 400 }
        );
      }
    }

    // ---- Build prompts ----
    const systemPrompt = buildScriptGenerationSystemPrompt();
    const userPrompt = buildScriptGenerationUserPrompt(
      inputText,
      chapters as Parameters<typeof buildScriptGenerationUserPrompt>[1]
    );

    // ---- Read config (server-side only — never exposed to client) ----
    // Support both DEEPSEEK_API_KEY and OPENAI_API_KEY
    const apiKey =
      process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || '';

    if (!apiKey || isPlaceholder(apiKey)) {
      return NextResponse.json(
        {
          success: false,
          error:
            '未配置有效的 API Key。请在项目根目录的 .env.local 中设置 DEEPSEEK_API_KEY=你的真实Key（或 OPENAI_API_KEY），保存后重启 npm run dev。',
        },
        { status: 500 }
      );
    }

    const model = process.env.AI_MODEL || 'deepseek-chat';
    const baseURL = process.env.AI_BASE_URL || undefined;
    const provider = process.env.AI_PROVIDER || 'deepseek';

    // ---- Call AI API via OpenAI-compatible SDK ----
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey, baseURL });

    let rawOutput: string;

    try {
      const completion = await openai.chat.completions.create({
        model,
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      });

      rawOutput = completion.choices[0]?.message?.content ?? '';

      if (!rawOutput.trim()) {
        return NextResponse.json(
          {
            success: false,
            error: 'AI 返回了空内容。请重试或切换到 Mock 模式。',
          },
          { status: 502 }
        );
      }
    } catch (apiErr) {
      const message =
        apiErr instanceof Error ? apiErr.message : String(apiErr);
      return NextResponse.json(
        {
          success: false,
          error: `${provider} API 调用失败: ${message}`,
        },
        { status: 502 }
      );
    }

    // ---- Normalize & validate ----
    let scriptYaml;
    try {
      scriptYaml = normalizeScriptYamlOutput(rawOutput);
    } catch (normalizeErr) {
      const message =
        normalizeErr instanceof Error ? normalizeErr.message : String(normalizeErr);
      return NextResponse.json(
        {
          success: false,
          error: `AI 输出解析失败: ${message}`,
          rawOutput: rawOutput.slice(0, 500),
        },
        { status: 502 }
      );
    }

    // Double-check with validateScriptYaml
    const validation = validateScriptYaml(scriptYaml);
    if (!validation.success) {
      const issues = validation.errors.issues
        .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
      return NextResponse.json(
        {
          success: false,
          error: `AI 生成内容校验失败:\n${issues}`,
        },
        { status: 502 }
      );
    }

    // ---- Success ----
    return NextResponse.json({ success: true, data: scriptYaml });
  } catch (err) {
    const message = err instanceof Error ? err.message : '服务器内部错误。';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
