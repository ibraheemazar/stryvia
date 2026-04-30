import type { RecalibrationRunId, UserId } from '../common/ids.js';

/** Lifecycle of a recalibration job. */
export type RecalibrationStatus = 'queued' | 'running' | 'completed' | 'failed' | 'rolled_back';

/**
 * A periodic job that retrains/reweights the valuation model against
 * accumulated outcomes. Runs are immutable post-completion; rollbacks
 * produce a new run rather than mutating an existing one.
 */
export interface RecalibrationRun {
  readonly id: RecalibrationRunId;
  readonly status: RecalibrationStatus;
  readonly priorModelVersion: string;
  readonly newModelVersion: string | null;
  readonly outcomesEvaluated: number;
  readonly meanAbsoluteErrorBefore: number | null;
  readonly meanAbsoluteErrorAfter: number | null;
  readonly notes: string | null;
  /** Null for scheduled jobs; populated when triggered manually. */
  readonly triggeredBy: UserId | null;
  readonly startedAt: Date | string | null;
  readonly completedAt: Date | string | null;
  readonly createdAt: Date | string;
}
