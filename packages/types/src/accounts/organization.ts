import type { LocalizedText } from '../common/enums.js';
import type { OrganizationId } from '../common/ids.js';

/** Type of organization in STRYVIA — drives feature access and UI surface. */
export type OrganizationType = 'producer' | 'brand' | 'agency' | 'platform' | 'admin';

/** Operational status of an organization. */
export type OrganizationStatus = 'active' | 'pending' | 'suspended' | 'archived';

/**
 * A tenant in STRYVIA — a producer, brand, agency, or platform partner.
 * All resources scope under an organization.
 */
export interface Organization {
  readonly id: OrganizationId;
  readonly name: string;
  readonly displayName: LocalizedText;
  readonly type: OrganizationType;
  readonly status: OrganizationStatus;
  readonly homeTerritory: string;
  readonly contactEmail: string;
  readonly websiteUrl: string | null;
  readonly logoUrl: string | null;
  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
}
