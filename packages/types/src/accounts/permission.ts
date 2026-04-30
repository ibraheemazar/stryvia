import type { OrganizationId, PermissionId, ProjectId, UserId } from '../common/ids.js';

/** Resource a permission can be granted on. */
export type ResourceType =
  | 'organization'
  | 'project'
  | 'scene'
  | 'opportunity'
  | 'valuation'
  | 'report'
  | 'user';

/** Capability bundle granted on a resource, ordered weakest → strongest. */
export type AccessLevel = 'read' | 'comment' | 'write' | 'admin' | 'owner';

/**
 * A specific access grant on a specific resource for a specific user. The
 * permission table is authoritative; {@link import('./user.js').UserRole}
 * only seeds default grants on user creation.
 */
export interface Permission {
  readonly id: PermissionId;
  readonly organizationId: OrganizationId;
  readonly userId: UserId;
  readonly resourceType: ResourceType;
  /** Generic resource identifier — typed at the call site. */
  readonly resourceId: string;
  readonly accessLevel: AccessLevel;
  readonly grantedBy: UserId;
  readonly grantedAt: Date | string;
  readonly expiresAt: Date | string | null;
  /** Convenience: the project the resource ultimately rolls up to, if any. */
  readonly projectScope: ProjectId | null;
}
