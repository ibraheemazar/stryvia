import type { LocalizedText } from '../common/enums.js';
import type { TalentProfileId } from '../common/ids.js';

/** Tier of talent influence on audience pull and integration value. */
export type TalentTier = 'a_list' | 'b_list' | 'rising' | 'character' | 'unrated';

/** Type of role the talent fills. */
export type TalentType = 'actor' | 'director' | 'showrunner' | 'host' | 'creator';

/**
 * Reference profile for a piece of talent (actor, director, etc.) — applied
 * as a multiplier in arc valuation when the talent is attached to a scene.
 */
export interface TalentProfile {
  readonly id: TalentProfileId;
  readonly fullName: string;
  readonly displayName: LocalizedText | null;
  readonly type: TalentType;
  readonly tier: TalentTier;
  /** Normalized 0–1 — composite of social following, recent visibility, recall. */
  readonly socialReachScore: number;
  readonly territories: readonly string[];
  readonly recentProjects: readonly string[];
  readonly imdbId: string | null;
  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
}
