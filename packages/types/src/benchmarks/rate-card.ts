import type { Currency, Money } from '../common/enums.js';
import type { RateCardId } from '../common/ids.js';
import type { Genre } from '../scripts/project.js';

/** Top-level grouping of an integration rate card. */
export type RateCardCategory =
  | 'product_placement'
  | 'on_screen_branding'
  | 'integrated_marketing'
  | 'dialogue_mention'
  | 'set_dressing'
  | 'location_takeover';

/** Unit a rate is denominated in. */
export type RateUnit =
  | 'per_episode'
  | 'per_minute'
  | 'per_scene'
  | 'per_second'
  | 'per_arc'
  | 'per_season'
  | 'flat_fee';

/**
 * Reference rate card — historical/published market rates that anchor engine
 * valuations and let analysts sanity-check engine output.
 */
export interface RateCard {
  readonly id: RateCardId;
  readonly category: RateCardCategory;
  readonly unit: RateUnit;
  readonly genre: Genre | null;
  readonly territory: string | null;
  readonly currency: Currency;
  readonly lowRate: Money;
  readonly midRate: Money;
  readonly highRate: Money;
  readonly source: string;
  readonly effectiveFrom: Date | string;
  readonly effectiveUntil: Date | string | null;
  readonly notes: string | null;
  readonly createdAt: Date | string;
}
