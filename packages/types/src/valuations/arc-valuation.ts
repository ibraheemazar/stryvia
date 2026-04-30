import type { Money } from '../common/enums.js';
import type { ArcValuationId, EngineRunId, OpportunityId, ProjectId } from '../common/ids.js';
import type { ConfidenceRange } from './confidence.js';

/**
 * Score variables that compose an arc valuation. Each is normalized to [0, 1]
 * and combined by the engine's weighting model into the final `compositeScore`.
 */
export interface ValuationVariableScores {
  readonly exposure: number;
  readonly prominence: number;
  readonly emotionalContext: number;
  readonly characterAlignment: number;
  readonly audienceFit: number;
  readonly culturalRelevance: number;
  readonly talentMagnetism: number;
  readonly platformReach: number;
  readonly genreFit: number;
  readonly releaseTiming: number;
  readonly brandSafety: number;
}

/**
 * The engine's valuation of a single integration opportunity within a single
 * run. An opportunity has many ArcValuations across runs but exactly one per
 * run.
 */
export interface ArcValuation {
  readonly id: ArcValuationId;
  readonly engineRunId: EngineRunId;
  readonly projectId: ProjectId;
  readonly opportunityId: OpportunityId;
  readonly value: Money;
  readonly confidence: ConfidenceRange;
  readonly variableScores: ValuationVariableScores;
  /** Final normalized 0–1 aggregate score — used for ranking. */
  readonly compositeScore: number;
  readonly rationale: string | null;
  readonly createdAt: Date | string;
}
