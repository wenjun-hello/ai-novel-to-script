import { ParsedChapter } from '@/lib/types';

/**
 * System prompt for the AI script generation assistant.
 *
 * Instructs the model to produce structured JSON matching the ScriptYaml schema,
 * without markdown or explanatory text.
 */
export function buildScriptGenerationSystemPrompt(): string {
  return `You are a professional novel-to-script adaptation assistant. Your task is to convert novel chapters into a structured screenplay JSON.

CRITICAL RULES — follow these exactly:
1. Output MUST be valid, parseable JSON. Do NOT wrap it in markdown code fences (\`\`\`json). Do NOT add any text, explanation, or commentary before or after the JSON. The response must start with "{" and end with "}".
2. The JSON must conform to the ScriptYaml structure described below. Every field must be present — use "" for unknown strings, [] for unknown arrays.
3. Every "scene" object MUST have a "source_chapter_id" that matches one of the chapter_id values from the "source.chapters" array.
4. Every "scene" object MUST have a "location_id" that matches one of the location_id values from the "locations" array.
5. All character references (in scenes.characters, dialogue.speaker, beats.related_character_id) MUST use character_id values (e.g. "char_001"), NOT character names.
6. "beats.type" MUST be exactly one of: "action", "emotion", "event", "visual", "sound", "memory". No other values are allowed.
7. If information cannot be determined from the source text, use "" for string fields, [] for array fields, or add a note to "unresolved_issues". Do NOT fabricate excessive detail or invent plot points not in the original text.
8. This is a DRAFT for the author to edit — focus on capturing the structure, not perfection.

The expected JSON structure (every field shown below MUST be present):

{
  "script": {
    "metadata": {
      "title": "string",
      "original_title": "string",
      "source_type": "novel",
      "adaptation_type": "string (e.g. film, tv_series, stage_play)",
      "language": "zh-CN",
      "version": "0.1.0",
      "created_by": "AI 小说转剧本工具",
      "created_at": "ISO date string",
      "description": "string"
    },
    "source": {
      "chapter_count": "number",
      "chapters": [
        {
          "chapter_id": "string",
          "title": "string",
          "original_order": "number",
          "summary": "string",
          "key_events": ["string"],
          "emotional_arc": "string",
          "adaptation_notes": "string"
        }
      ]
    },
    "characters": [
      {
        "character_id": "string (e.g. char_001)",
        "name": "string",
        "role": "string (e.g. protagonist, antagonist, supporting)",
        "gender": "string",
        "age_range": "string",
        "description": "string",
        "motivation": "string",
        "emotional_state": "string",
        "relationships": [
          {
            "target_character_id": "string (must match another character_id)",
            "relationship_type": "string (e.g. 夫妻, 母女, 朋友)",
            "description": "string"
          }
        ]
      }
    ],
    "locations": [
      {
        "location_id": "string (e.g. loc_001)",
        "name": "string",
        "type": "string (e.g. 住宅, 室内, 户外)",
        "description": "string",
        "atmosphere": "string"
      }
    ],
    "scenes": [
      {
        "scene_id": "string (e.g. sc_001)",
        "source_chapter_id": "string (MUST match a chapter_id in source.chapters)",
        "scene_number": "number",
        "title": "string",
        "location_id": "string (MUST match a location_id in locations)",
        "location_name": "string",
        "time_of_day": "string",
        "scene_type": "string (e.g. dialogue, drama, montage, internal, transition)",
        "characters": ["character_id"],
        "scene_goal": "string",
        "conflict": "string",
        "summary": "string",
        "beats": [
          {
            "beat_id": "string",
            "type": "action | emotion | event | visual | sound | memory",
            "content": "string",
            "related_character_id": "string"
          }
        ],
        "dialogue": [
          {
            "dialogue_id": "string",
            "speaker": "character_id",
            "speaker_name": "string",
            "line": "string",
            "emotion": "string",
            "action": "string"
          }
        ],
        "visual_notes": "string",
        "sound_notes": "string",
        "transition": "string",
        "unresolved_issues": "string"
      }
    ],
    "structure": {
      "act_type": "three-act",
      "acts": [
        {
          "act_id": "string (e.g. act_01)",
          "title": "string",
          "purpose": "string",
          "related_scenes": ["scene_id"]
        }
      ]
    },
    "notes": {
      "adaptation_strategy": "string",
      "preserved_elements": ["string"],
      "changed_elements": ["string"],
      "unresolved_issues": ["string"]
    }
  }
}`;
}

/**
 * User prompt containing the novel text, parsed chapter list, and adaptation goals.
 */
export function buildScriptGenerationUserPrompt(
  inputText: string,
  chapters: ParsedChapter[]
): string {
  const chapterList = chapters
    .map((ch) => `- ${ch.chapter_id}: ${ch.title} (${ch.content.length} chars)`)
    .join('\n');

  return `Please convert the following novel text into a structured screenplay JSON.

ADAPTATION GOAL: Generate an editable screenplay draft that the author can continue to refine. Focus on identifying key scenes, character arcs, emotional beats, and visual opportunities.

PARSED CHAPTERS:
${chapterList}

ORIGINAL NOVEL TEXT:
---
${inputText}
---

IMPORTANT: Output ONLY the complete JSON object. Start with "{" and end with "}". Do not include any other text.`;
}
