import type { Money } from '../common/enums.js';
import type { EngineRunId, OpportunityId, PredictionId, ProjectId } from '../common/ids.js';
import type { ConfidenceRange } from '../valuations/confidence.js';

/** What the model is predicting. */
export type PredictionType =
  | 'deal_close_probability'
  | 'realized_value'
  | 'time_to_close'
  | 'audience_engagement';

/**
 * A model prediction emitted alongside a valuation. Predictions are compared
 * against {@link import('./outcome.js').Outcome}s during recalibration to
 * measure model drift.
 */
export interface Prediction {
  readonly id: PredictionId;
  readonly engineRunId: EngineRunId;
  readonly projectId: ProjectId;
  readonly opportunityId: OpportunityId | null;
  readonly type: PredictionType;
  /** Numeric prediction (e.g. probability 0–1, or days-to-close). */
  readonly numericValue: number | null;
  /** Monetary prediction, when `type` is `realized_value`. */
  readonly monetaryValue: Money | null;
  readonly confidence: ConfidenceRange;
  readonly modelVersion: string;
  readonly createdAt: Date | string;
}
