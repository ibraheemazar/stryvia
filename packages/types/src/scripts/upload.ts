import type { ProjectId, ScriptUploadId, UserId } from '../common/ids.js';

/** Lifecycle of a script file uploaded against a project. */
export type ScriptUploadStatus =
  | 'pending'
  | 'uploading'
  | 'processing'
  | 'analyzed'
  | 'failed'
  | 'archived';

/** Supported script file formats accepted for upload and parsing. */
export type ScriptFileFormat = 'pdf' | 'fdx' | 'fountain' | 'docx' | 'txt';

/**
 * A single script revision uploaded for a project. Each upload produces a
 * fresh EngineRun once processing completes.
 */
export interface ScriptUpload {
  readonly id: ScriptUploadId;
  readonly projectId: ProjectId;
  readonly uploadedBy: UserId;
  readonly fileName: string;
  readonly fileFormat: ScriptFileFormat;
  readonly fileSizeBytes: number;
  readonly checksumSha256: string;
  readonly status: ScriptUploadStatus;
  readonly revision: number;
  readonly pageCount: number | null;
  readonly errorMessage: string | null;
  readonly storageUrl: string | null;
  readonly uploadedAt: Date | string;
  readonly processedAt: Date | string | null;
}
