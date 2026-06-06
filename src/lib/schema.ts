import { z } from 'zod';

// ---- Shared enums / constrained strings ----

const beatTypeSchema = z.enum(['action', 'emotion', 'event', 'visual', 'sound', 'memory']);

// ---- Sub-schemas (bottom-up) ----

const relationshipSchema = z.object({
  target_character_id: z.string().min(1),
  relationship_type: z.string().min(1),
  description: z.string().min(1),
});

const characterSchema = z.object({
  character_id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  gender: z.string().min(1),
  age_range: z.string().min(1),
  description: z.string().min(1),
  motivation: z.string().min(1),
  emotional_state: z.string().min(1),
  relationships: z.array(relationshipSchema),
});

const locationSchema = z.object({
  location_id: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1),
  atmosphere: z.string().min(1),
});

const beatSchema = z.object({
  beat_id: z.string().min(1),
  type: beatTypeSchema,
  content: z.string().min(1),
  related_character_id: z.string(), // optional — some beats (e.g. visual) may not tie to a specific character
});

const dialogueLineSchema = z.object({
  dialogue_id: z.string().min(1),
  speaker: z.string().min(1), // character_id
  speaker_name: z.string().min(1),
  line: z.string().min(1),
  emotion: z.string().min(1),
  action: z.string(), // optional — a character may speak without a physical action
});

const sceneSchema = z.object({
  scene_id: z.string().min(1),
  source_chapter_id: z.string().min(1),
  scene_number: z.number().int().positive(),
  title: z.string().min(1),
  location_id: z.string().min(1),
  location_name: z.string().min(1),
  time_of_day: z.string().min(1),
  scene_type: z.string().min(1),
  characters: z.array(z.string().min(1)),
  scene_goal: z.string().min(1),
  conflict: z.string().min(1),
  summary: z.string().min(1),
  beats: z.array(beatSchema),
  dialogue: z.array(dialogueLineSchema),
  visual_notes: z.string(),
  sound_notes: z.string(),
  transition: z.string().min(1),
  unresolved_issues: z.string(),
});

const actSchema = z.object({
  act_id: z.string().min(1),
  title: z.string().min(1),
  purpose: z.string().min(1),
  related_scenes: z.array(z.string().min(1)),
});

const sourceChapterSchema = z.object({
  chapter_id: z.string().min(1),
  title: z.string().min(1),
  original_order: z.number().int().positive(),
  summary: z.string().min(1),
  key_events: z.array(z.string().min(1)),
  emotional_arc: z.string().min(1),
  adaptation_notes: z.string(),
});

// ---- Top-level schemas ----

const metadataSchema = z.object({
  title: z.string().min(1),
  original_title: z.string(), // may be empty if same as title
  source_type: z.string().min(1),
  adaptation_type: z.string().min(1),
  language: z.string().min(1),
  version: z.string().min(1),
  created_by: z.string().min(1),
  created_at: z.string().min(1),
  description: z.string().min(1),
});

const sourceInfoSchema = z.object({
  chapter_count: z.number().int().positive(),
  chapters: z.array(sourceChapterSchema),
});

const structureSchema = z.object({
  act_type: z.string().min(1),
  acts: z.array(actSchema),
});

const notesSchema = z.object({
  adaptation_strategy: z.string().min(1),
  preserved_elements: z.array(z.string().min(1)),
  changed_elements: z.array(z.string().min(1)),
  unresolved_issues: z.array(z.string().min(1)),
});

// ---- Root schema ----

export const scriptYamlSchema = z.object({
  script: z.object({
    metadata: metadataSchema,
    source: sourceInfoSchema,
    characters: z.array(characterSchema),
    locations: z.array(locationSchema),
    scenes: z.array(sceneSchema),
    structure: structureSchema,
    notes: notesSchema,
  }),
});

// ---- Convenience validator ----

export function validateScriptYaml(data: unknown):
  | { success: true; data: z.infer<typeof scriptYamlSchema> }
  | { success: false; errors: z.ZodError } {
  const result = scriptYamlSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
