import type { LocalizedText } from '../common/enums.js';
import type { CharacterId, OpportunityId, ProjectId, SceneId } from '../common/ids.js';

/** Category of brand integration. */
export type OpportunityCategory =
  | 'product_placement'
  | 'on_screen_branding'
  | 'integrated_marketing'
  | 'dialogue_mention'
  | 'set_dressing'
  | 'wardrobe'
  | 'vehicle'
  | 'location_takeover';

/** Tier of integration prominence — drives baseline pricing. */
export type OpportunityTier = 'hero' | 'feature' | 'standard' | 'background';

/** Workflow status as the opportunity moves through pitch and sale. */
export type OpportunityStatus =
  | 'identified'
  | 'reviewed'
  | 'available'
  | 'pitched'
  | 'reserved'
  | 'sold'
  | 'rejected'
  | 'withdrawn';

/**
 * A single brand-integration opportunity surfaced by script analysis. Anchored
 * to a scene (and optionally a character); each engine run produces one
 * canonical {@link import('../valuations/arc-valuation.js').ArcValuation}.
 */
export interface IntegrationOpportunity {
  readonly id: OpportunityId;
  readonly projectId: ProjectId;
  readonly sceneId: SceneId;
  readonly characterId: CharacterId | null;
  readonly category: OpportunityCategory;
  readonly tier: OpportunityTier;
  readonly status: OpportunityStatus;
  readonly headline: LocalizedText;
  readonly description: LocalizedText;
  readonly screenTimeSeconds: number | null;
  /** Normalized 0–1 aggregate of placement size, framing, and visibility. */
  readonly prominenceScore: number;
  /** Suggested brand-category tags — used to match brand briefs. */
  readonly suggestedCategories: readonly string[];
  /** Brand categories explicitly excluded (e.g. competitor of an attached brand). */
  readonly excludedCategories: readonly string[];
  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
}
