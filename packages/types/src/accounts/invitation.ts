import type { InvitationId, OrganizationId, UserId } from '../common/ids.js';
import type { UserRole } from './user.js';

/** Lifecycle of an invitation. */
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

/** An invitation for an external user to join an organization. */
export interface Invitation {
  readonly id: InvitationId;
  readonly organizationId: OrganizationId;
  readonly email: string;
  readonly role: UserRole;
  readonly status: InvitationStatus;
  readonly invitedBy: UserId;
  /** Hash of the invitation token; raw token is sent via email and never stored. */
  readonly tokenHash: string;
  readonly invitedAt: Date | string;
  readonly acceptedAt: Date | string | null;
  readonly acceptedBy: UserId | null;
  readonly expiresAt: Date | string;
}
