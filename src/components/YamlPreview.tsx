'use client';

import { downloadYaml } from '@/lib/yamlExport';

interface ValidationErrorItem {
  path: string;
  message: string;
}

interface YamlPreviewProps {
  yamlString: string;
  isValid: boolean;
  validationErrors: ValidationErrorItem[];
}

export default function YamlPreview({
  yamlString,
  isValid,
  validationErrors,
}: YamlPreviewProps) {
  if (!yamlString) return null;

  const displayErrors = validationErrors.slice(0, 5);
  const remaining = validationErrors.length - displayErrors.length;

  return (
    <section className="yaml-preview-section">
      <div className="yaml-header">
        <h2 className="section-title">剧本 YAML 预览</h2>
        <div className="yaml-actions">
          <span className={`validation-badge ${isValid ? 'valid' : 'invalid'}`}>
            {isValid ? '✓ Schema 校验通过' : '✗ Schema 校验失败'}
          </span>
          <button
            className="btn-download"
            onClick={() => downloadYaml(yamlString)}
          >
            下载 YAML
          </button>
        </div>
      </div>

      {!isValid && displayErrors.length > 0 && (
        <div className="validation-errors">
          <p className="validation-errors-title">
            校验错误详情（显示前 {displayErrors.length} 条{remaining > 0 ? `，共 ${validationErrors.length} 条` : ''}）：
          </p>
          <ol className="validation-errors-list">
            {displayErrors.map((err, i) => (
              <li key={i}>
                <code className="error-path">{err.path}</code>
                <span className="error-message">{err.message}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <pre className="yaml-output">
        <code>{yamlString}</code>
      </pre>
    </section>
  );
}
