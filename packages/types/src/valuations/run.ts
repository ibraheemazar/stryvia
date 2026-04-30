import type { EngineRunId, ProjectId, ScriptUploadId, UserId } from '../common/ids.js';

/** Lifecycle of a single engine valuation run. */
export type RunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

/** What initiated an engine run. */
export type RunTrigger = 'manual' | 'scheduled' | 'recalibration' | 'reupload';

/**
 * A single execution of the valuation engine against a project's current
 * script revision. Runs are immutable once completed.
 *
 * Mirrors `valuations.engine_runs` (architecture v2 §9.4).
 */
export interface EngineRun {
  readonly id: EngineRunId;
  readonly projectId: ProjectId;
  readonly scriptUploadId: ScriptUploadId;
  readonly status: RunStatus;
  readonly trigger: RunTrigger;
  readonly engineVersion: string;
  readonly modelVersion: string;
  readonly requestedBy: UserId | null;
  readonly startedAt: Date | string | null;
  readonly completedAt: Date | string | null;
  readonly durationMs: number | null;
  readonly errorMessage: string | null;
  readonly arcValuationCount: number;
  readonly createdAt: Date | string;
}
