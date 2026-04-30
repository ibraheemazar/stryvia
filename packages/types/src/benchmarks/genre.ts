import type { Money } from '../common/enums.js';
import type { GenreBenchmarkId } from '../common/ids.js';
import type { Genre } from '../scripts/project.js';

/**
 * Per-genre baseline metrics used to calibrate the engine. Refreshed by the
 * recalibration runs in the `learning` schema.
 */
export interface GenreBenchmark {
  readonly id: GenreBenchmarkId;
  readonly genre: Genre;
  readonly territory: string | null;
  readonly avgOpportunityValue: Money;
  readonly avgOpportunitiesPerProject: number;
  /** Normalized 0–1 — average audience-engagement signal for the genre. */
  readonly avgEngagementScore: number;
  readonly sampleSize: number;
  readonly effectiveFrom: Date | string;
  readonly effectiveUntil: Date | string | null;
}
