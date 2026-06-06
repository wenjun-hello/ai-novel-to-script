'use client';

import { ParsedChapter } from '@/lib/types';

interface ChapterPreviewProps {
  chapters: ParsedChapter[];
}

export default function ChapterPreview({ chapters }: ChapterPreviewProps) {
  if (chapters.length === 0) return null;

  return (
    <section className="chapter-preview-section">
      <h2 className="section-title">章节识别结果</h2>
      <p className="section-hint">共识别到 {chapters.length} 个章节</p>
      <div className="chapter-list">
        {chapters.map((ch) => (
          <div key={ch.chapter_id} className="chapter-card">
            <div className="chapter-card-header">
              <span className="chapter-order">#{ch.original_order}</span>
              <span className="chapter-id">{ch.chapter_id}</span>
            </div>
            <h3 className="chapter-title">{ch.title}</h3>
            <p className="chapter-content-preview">
              {ch.content.slice(0, 200)}
              {ch.content.length > 200 ? '……' : ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
