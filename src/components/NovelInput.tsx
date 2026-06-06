'use client';

import { useState } from 'react';

interface NovelInputProps {
  onSubmit: (text: string) => void;
  onLoadSample: () => string;
  disabled: boolean;
}

export default function NovelInput({ onSubmit, onLoadSample, disabled }: NovelInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const handleLoadSample = () => {
    const sample = onLoadSample();
    setText(sample);
  };

  return (
    <section className="novel-input-section">
      <div className="novel-input-header">
        <h2 className="section-title">粘贴小说文本</h2>
        <button
          className="btn-sample"
          onClick={handleLoadSample}
          disabled={disabled}
        >
          加载示例文本：《笑的历史》
        </button>
      </div>
      <p className="section-hint">
        支持中文小说章节格式：第x章、第x节、Chapter N
      </p>
      <textarea
        className="novel-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`请粘贴至少 3 个章节的小说文本，例如：

第一章 童年的笑
我从小就是爱笑的。别人都这么说。我妈说，我生下来...

第二章 初到夫家
嫁过去的那天，天很蓝。我坐在轿子里...

第三章 笑的消失
后来家里出了事。我不记得从哪天起...`}
        rows={16}
        disabled={disabled}
      />
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={disabled || !text.trim()}
      >
        {disabled ? '生成中...' : '生成剧本 YAML'}
      </button>
    </section>
  );
}
