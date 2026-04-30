import type { LocalizedText } from '../common/enums.js';
import type { CulturalCalendarEntryId } from '../common/ids.js';
import type { ReleaseWindow } from '../scripts/project.js';

// `ReleaseWindow` is the canonical enum for cultural release timing. It lives
// in `scripts/project` (its primary consumer) and is imported here.

/** Cultural significance / audience-pull weight of a calendar entry. */
export type CulturalSignificance = 'major' | 'moderate' | 'minor';

/**
 * A culturally significant date or window in a territory — Ramadan, Eid,
 * national holidays — that shifts audience behaviour and integration value.
 */
export interface CulturalCalendarEntry {
  readonly id: CulturalCalendarEntryId;
  readonly name: LocalizedText;
  readonly territory: string;
  readonly significance: CulturalSignificance;
  readonly associatedReleaseWindow: ReleaseWindow | null;
  readonly startDate: Date | string;
  readonly endDate: Date | string;
  readonly recurringAnnually: boolean;
  /** Multiplier applied to baseline viewership during this window (1.0 = baseline). */
  readonly viewershipMultiplier: number;
  readonly notes: string | null;
}
