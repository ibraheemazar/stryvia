import type { LocalizedText } from '../common/enums.js';
import type { CharacterId, ProjectId } from '../common/ids.js';

/** Importance of a character within a project's narrative. */
export type CharacterRole = 'lead' | 'supporting' | 'recurring' | 'guest' | 'background';

/** Demographic gender bucket — used by audience-fit and casting analyses. */
export type CharacterGender = 'male' | 'female' | 'non_binary' | 'unspecified';

/**
 * A character extracted from the script. Drives audience-fit and brand-match
 * scoring on opportunities tied to the character.
 */
export interface Character {
  readonly id: CharacterId;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly displayName: LocalizedText | null;
  readonly role: CharacterRole;
  readonly gender: CharacterGender;
  readonly ageRangeMin: number | null;
  readonly ageRangeMax: number | null;
  readonly sceneCount: number;
  readonly speakingLineCount: number;
  readonly description: LocalizedText | null;
  /** TODO: actor attachment + on-screen-time aggregates land in 1A.6. */
  readonly attributes: Record<string, unknown>;
  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
}
