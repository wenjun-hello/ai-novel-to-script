'use client';

import { useState, useCallback } from 'react';
import { ParsedChapter } from '@/lib/types';
import { parseChapters } from '@/lib/chapterParser';
import { generateScriptYaml, ScriptGenerationMode } from '@/lib/scriptGenerator';
import { scriptYamlToYamlString } from '@/lib/yamlExport';
import { validateScriptYaml } from '@/lib/schema';
import { laughHistorySample } from '@/data/samples/laughHistorySample';
import NovelInput from '@/components/NovelInput';
import ChapterPreview from '@/components/ChapterPreview';
import YamlPreview from '@/components/YamlPreview';

const IS_DEMO = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'github-pages';

type ValidationErrorItem = {
  path: string;
  message: string;
};

type AppState =
  | { phase: 'idle' }
  | { phase: 'loading'; message: string }
  | { phase: 'error'; message: string }
  | {
      phase: 'success';
      chapters: ParsedChapter[];
      yamlString: string;
      isValid: boolean;
      validationErrors: ValidationErrorItem[];
    };

const ALL_MODE_OPTIONS: { value: ScriptGenerationMode; label: string }[] = [
  { value: 'mock', label: 'Mock 示例生成' },
  { value: 'ai', label: 'AI 真实生成' },
];

const DEMO_MODE_OPTIONS: { value: ScriptGenerationMode; label: string }[] = [
  { value: 'mock', label: 'Mock 示例生成' },
];

export default function Home() {
  const [state, setState] = useState<AppState>({ phase: 'idle' });
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ScriptGenerationMode>('mock');

  const modeOptions = IS_DEMO ? DEMO_MODE_OPTIONS : ALL_MODE_OPTIONS;

  const handleSubmit = useCallback(
    (text: string) => {
      setLoading(true);
      setState(
        mode === 'ai'
          ? { phase: 'loading', message: '正在调用 AI 生成剧本，请稍候……' }
          : { phase: 'idle' }
      );

      setTimeout(async () => {
        try {
          let chapters: ParsedChapter[];
          try {
            chapters = parseChapters(text, 3);
          } catch {
            setState({ phase: 'error', message: '请输入小说文本。' });
            setLoading(false);
            return;
          }

          if (chapters.length < 3) {
            setState({
              phase: 'error',
              message: `仅识别到 ${chapters.length} 个章节，请至少输入 3 个章节以上的小说文本。`,
            });
            setLoading(false);
            return;
          }

          const scriptYaml = await generateScriptYaml({
            inputText: text,
            chapters,
            mode: IS_DEMO ? 'mock' : mode,
          });

          const validation = validateScriptYaml(scriptYaml);
          const yamlString = scriptYamlToYamlString(scriptYaml);

          const validationErrors: ValidationErrorItem[] = validation.success
            ? []
            : validation.errors.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
              }));

          setState({
            phase: 'success',
            chapters,
            yamlString,
            isValid: validation.success,
            validationErrors,
          });
        } catch (err) {
          setState({
            phase: 'error',
            message: err instanceof Error ? err.message : '发生未知错误。',
          });
        } finally {
          setLoading(false);
        }
      }, 100);
    },
    [mode]
  );

  const handleLoadSample = useCallback((): string => {
    return laughHistorySample;
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">AI 小说转剧本工具</h1>
        <p className="app-subtitle">
          上传或粘贴小说文本，自动识别章节、提取人物、拆分场次，生成结构化 YAML 剧本初稿
        </p>
      </header>

      {IS_DEMO && (
        <div className="demo-notice">
          <strong>公开 Demo 版</strong> — 支持章节识别、Mock 剧本 YAML 生成、Schema 校验、YAML 下载。不支持真实 AI API 调用。
          如需 AI 真实生成，请克隆仓库本地运行并配置 DeepSeek API Key。
        </div>
      )}

      <div className="mode-selector">
        <span className="mode-selector-label">生成模式：</span>
        <div className="mode-options">
          {modeOptions.map((opt) => (
            <button
              key={opt.value}
              className={`mode-option ${mode === opt.value ? 'mode-option-active' : ''}`}
              onClick={() => setMode(opt.value)}
              disabled={loading}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'ai' && !IS_DEMO && (
        <p className="mode-hint">
          AI 模式需要在项目根目录配置 <code>.env.local</code> 并填入真实 API Key，然后重启开发服务器。
        </p>
      )}

      <NovelInput
        onSubmit={handleSubmit}
        onLoadSample={handleLoadSample}
        disabled={loading}
      />

      {state.phase === 'loading' && (
        <div className="loading-banner">
          <span className="loading-spinner" />
          {state.message}
        </div>
      )}

      {state.phase === 'error' && (
        <div className="error-banner">{state.message}</div>
      )}

      {state.phase === 'success' && (
        <>
          <ChapterPreview chapters={state.chapters} />
          <YamlPreview
            yamlString={state.yamlString}
            isValid={state.isValid}
            validationErrors={state.validationErrors}
          />
        </>
      )}
    </div>
  );
}
