import type { EngineRunId, ProjectId, ReportId, UserId } from '../common/ids.js';

/** Type/audience of a generated valuation report. */
export type ReportType =
  | 'producer_summary'
  | 'brand_pitch'
  | 'executive_brief'
  | 'detailed_analysis'
  | 'opportunity_catalogue';

/** Output format the report was rendered in. */
export type ReportFormat = 'pdf' | 'html' | 'json' | 'pptx';

/** Generation lifecycle of a report. */
export type ReportStatus = 'pending' | 'rendering' | 'ready' | 'failed';

/** Metadata for a generated valuation report. */
export interface ReportMetadata {
  readonly id: ReportId;
  readonly projectId: ProjectId;
  readonly engineRunId: EngineRunId;
  readonly type: ReportType;
  readonly format: ReportFormat;
  readonly status: ReportStatus;
  readonly title: string;
  readonly generatedBy: UserId;
  readonly storageUrl: string | null;
  readonly fileSizeBytes: number | null;
  readonly generatedAt: Date | string | null;
  readonly expiresAt: Date | string | null;
  readonly createdAt: Date | string;
}
