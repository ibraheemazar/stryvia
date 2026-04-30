import type { LocalizedText } from '../common/enums.js';
import type { PlatformProfileId } from '../common/ids.js';

/** Distribution platform tier — drives reach assumptions and pricing. */
export type PlatformTier = 'global' | 'regional' | 'national' | 'niche';

/** Type of platform. */
export type PlatformType =
  | 'streaming'
  | 'broadcast'
  | 'cable'
  | 'theatrical'
  | 'social_video'
  | 'avod';

/**
 * Reference profile for a distribution platform (Netflix, Shahid, MBC, etc.).
 */
export interface PlatformProfile {
  readonly id: PlatformProfileId;
  readonly name: string;
  readonly displayName: LocalizedText;
  readonly type: PlatformType;
  readonly tier: PlatformTier;
  readonly territories: readonly string[];
  readonly subscriberEstimate: number | null;
  readonly avgImpressionsPerEpisode: number | null;
  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
}
