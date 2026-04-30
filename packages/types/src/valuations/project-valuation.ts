import type { Money } from '../common/enums.js';
import type { EngineRunId, ProjectId, ProjectValuationId } from '../common/ids.js';
import type { ConfidenceRange } from './confidence.js';

/** Per-category roll-up of valuations for a project. */
export interface CategoryValuationBreakdown {
  readonly category: string;
  readonly opportunityCount: number;
  readonly totalValue: Money;
  readonly confidence: ConfidenceRange;
}

/**
 * Aggregate valuation across all opportunities in a single engine run.
 *
 * Mirrors `valuations.project_valuations` (architecture v2 §9.4).
 */
export interface ProjectValuation {
  readonly id: ProjectValuationId;
  readonly engineRunId: EngineRunId;
  readonly projectId: ProjectId;
  readonly opportunityCount: number;
  readonly totalValue: Money;
  readonly confidence: ConfidenceRange;
  readonly categoryBreakdown: readonly CategoryValuationBreakdown[];
  readonly createdAt: Date | string;
}
