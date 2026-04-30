import type { Money } from '../common/enums.js';
import type { OpportunityId, OutcomeId, PredictionId, ProjectId, UserId } from '../common/ids.js';

/** Final disposition of a tracked opportunity. */
export type CloseReason =
  | 'won'
  | 'lost_price'
  | 'lost_fit'
  | 'lost_timing'
  | 'lost_competitor'
  | 'withdrawn'
  | 'expired'
  | 'no_decision';

/** Outcome lifecycle. */
export type OutcomeStatus = 'open' | 'in_progress' | 'closed';

/**
 * The recorded real-world outcome for an opportunity — ground truth used to
 * score and recalibrate predictions.
 */
export interface Outcome {
  readonly id: OutcomeId;
  readonly projectId: ProjectId;
  readonly opportunityId: OpportunityId;
  /** Prediction this outcome retrospectively scores, if any. */
  readonly predictionId: PredictionId | null;
  readonly status: OutcomeStatus;
  readonly closeReason: CloseReason | null;
  readonly realizedValue: Money | null;
  readonly closedAt: Date | string | null;
  readonly recordedBy: UserId;
  readonly notes: string | null;
  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
}
