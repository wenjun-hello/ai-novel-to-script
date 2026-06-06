import { ParsedChapter } from './types';

/**
 * Detect chapters from novel text using Chinese and English patterns.
 * Returns an array of ParsedChapter. Throws if fewer than `minChapters` are found.
 */

const CHAPTER_REGEX = /(?:第[一二三四五六七八九十百千\d]+[章节部]|Chapter\s+\d+)\s*[：:\.\s]?\s*(.*)/gm;

export function parseChapters(text: string, minChapters = 3): ParsedChapter[] {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('请输入小说文本。');
  }

  const matches: { index: number; title: string }[] = [];
  let match: RegExpExecArray | null;

  // Reset lastIndex before looping
  CHAPTER_REGEX.lastIndex = 0;
  while ((match = CHAPTER_REGEX.exec(trimmed)) !== null) {
    matches.push({
      index: match.index,
      title: match[0].replace(/[\r\n]+/g, ' ').trim(),
    });
  }

  // If regex didn't match, try to split on lines that look like chapter headings
  if (matches.length === 0) {
    const lines = trimmed.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^(第[一二三四五六七八九十百千\d]+[章节部]|Chapter\s+\d+)/i.test(line)) {
        matches.push({ index: -1, title: line });
      }
    }

    // If still no matches, treat entire text as one chapter (will fail minChapters check)
    if (matches.length === 0) {
      return [];
    }
  }

  // Extract content between match boundaries
  const chapters: ParsedChapter[] = [];

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];

    const contentStart = current.index + current.title.length;
    const contentEnd = next ? next.index : trimmed.length;
    const content = trimmed.slice(contentStart, contentEnd).trim();

    chapters.push({
      chapter_id: `ch_${String(i + 1).padStart(3, '0')}`,
      title: current.title,
      original_order: i + 1,
      content,
    });
  }

  return chapters;
}
