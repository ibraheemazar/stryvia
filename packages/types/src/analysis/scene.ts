import type { LocalizedText } from '../common/enums.js';
import type { CharacterId, ProjectId, SceneId } from '../common/ids.js';

/** Indoor/outdoor classification of a scene's setting. */
export type SceneSetting = 'interior' | 'exterior' | 'mixed';

/** Time-of-day convention parsed from the scene heading. */
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'dawn' | 'dusk';

/** High-level emotional tone the scene carries. */
export type EmotionalValence = 'positive' | 'negative' | 'neutral' | 'mixed';

/**
 * A single parsed scene — the unit integration opportunities attach to.
 *
 * Mirrors `analysis.scenes` (architecture v2 §9.2).
 */
export interface Scene {
  readonly id: SceneId;
  readonly projectId: ProjectId;
  readonly episodeNumber: number | null;
  readonly sceneNumber: number;
  readonly orderIndex: number;
  readonly slugLine: string;
  readonly setting: SceneSetting;
  readonly timeOfDay: TimeOfDay;
  readonly locationName: string;
  readonly summary: LocalizedText | null;
  readonly emotionalValence: EmotionalValence;
  /** Normalized 0–1 — intensity of the scene's emotional charge. */
  readonly emotionalIntensity: number;
  readonly pageStart: number | null;
  readonly pageEnd: number | null;
  readonly estimatedDurationSeconds: number | null;
  readonly characterIds: readonly CharacterId[];
  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
}
