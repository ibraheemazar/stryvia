import type { Locale } from '../common/enums.js';
import type { OrganizationId, UserId } from '../common/ids.js';

/** Functional role of a user — drives the default permission set. */
export type UserRole =
  | 'admin'
  | 'producer'
  | 'brand_manager'
  | 'agency_lead'
  | 'analyst'
  | 'viewer';

/** Account status. */
export type UserStatus = 'active' | 'invited' | 'suspended' | 'deactivated';

/** A user account, scoped to a single organization. */
export interface User {
  readonly id: UserId;
  readonly organizationId: OrganizationId;
  readonly email: string;
  readonly fullName: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly preferredLocale: Locale;
  readonly avatarUrl: string | null;
  readonly lastLoginAt: Date | string | null;
  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
}
