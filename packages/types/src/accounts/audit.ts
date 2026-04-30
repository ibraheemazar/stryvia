import type { AuditLogEntryId, OrganizationId, UserId } from '../common/ids.js';
import type { ResourceType } from './permission.js';

/** What kind of action was performed on a resource. */
export type AuditAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'viewed'
  | 'exported'
  | 'shared'
  | 'permission_granted'
  | 'permission_revoked'
  | 'logged_in'
  | 'logged_out';

/** A single audit-trail entry. Append-only — never mutated after write. */
export interface AuditLogEntry {
  readonly id: AuditLogEntryId;
  readonly organizationId: OrganizationId;
  /** Null for system-generated actions (e.g. scheduled recalibration). */
  readonly actorId: UserId | null;
  readonly action: AuditAction;
  readonly resourceType: ResourceType;
  readonly resourceId: string;
  readonly ipAddress: string | null;
  readonly userAgent: string | null;
  /** Action-specific details — shape varies by `action`. */
  readonly metadata: Record<string, unknown>;
  readonly occurredAt: Date | string;
}
