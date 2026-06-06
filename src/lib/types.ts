// ============================================================
// AI Novel-to-Script Tool — TypeScript Types
// ============================================================

/** A parsed chapter from the input novel text */
export interface ParsedChapter {
  chapter_id: string;
  title: string;
  original_order: number;
  content: string;
}

// ---- Script YAML Structure ----

export interface ScriptMetadata {
  title: string;
  original_title: string;
  source_type: string;
  adaptation_type: string;
  language: string;
  version: string;
  created_by: string;
  created_at: string;
  description: string;
}

export interface SourceChapter {
  chapter_id: string;
  title: string;
  original_order: number;
  summary: string;
  key_events: string[];
  emotional_arc: string;
  adaptation_notes: string;
}

export interface SourceInfo {
  chapter_count: number;
  chapters: SourceChapter[];
}

export interface CharacterRelationship {
  target_character_id: string;
  relationship_type: string;
  description: string;
}

export interface Character {
  character_id: string;
  name: string;
  role: string;
  gender: string;
  age_range: string;
  description: string;
  motivation: string;
  emotional_state: string;
  relationships: CharacterRelationship[];
}

export interface Location {
  location_id: string;
  name: string;
  type: string;
  description: string;
  atmosphere: string;
}

export type BeatType = 'action' | 'emotion' | 'event' | 'visual' | 'sound' | 'memory';

export interface Beat {
  beat_id: string;
  type: BeatType;
  content: string;
  related_character_id: string;
}

export interface DialogueLine {
  dialogue_id: string;
  speaker: string; // character_id
  speaker_name: string;
  line: string;
  emotion: string;
  action: string;
}

export interface Scene {
  scene_id: string;
  source_chapter_id: string;
  scene_number: number;
  title: string;
  location_id: string;
  location_name: string;
  time_of_day: string;
  scene_type: string;
  characters: string[]; // character_ids
  scene_goal: string;
  conflict: string;
  summary: string;
  beats: Beat[];
  dialogue: DialogueLine[];
  visual_notes: string;
  sound_notes: string;
  transition: string;
  unresolved_issues: string;
}

export interface Act {
  act_id: string;
  title: string;
  purpose: string;
  related_scenes: string[]; // scene_ids
}

export interface Structure {
  act_type: string;
  acts: Act[];
}

export interface AdaptationNotes {
  adaptation_strategy: string;
  preserved_elements: string[];
  changed_elements: string[];
  unresolved_issues: string[];
}

export interface ScriptYaml {
  script: {
    metadata: ScriptMetadata;
    source: SourceInfo;
    characters: Character[];
    locations: Location[];
    scenes: Scene[];
    structure: Structure;
    notes: AdaptationNotes;
  };
}
