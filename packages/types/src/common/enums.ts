/**
 * Cross-cutting enums and small value types shared across multiple domains.
 */

/** Supported UI/content locales — STRYVIA ships English + Arabic with full RTL. */
export type Locale = 'en' | 'ar';

/** Currencies STRYVIA tracks for monetary values. */
export type Currency = 'USD' | 'AED' | 'SAR' | 'EGP';

/** A monetary amount paired with its currency. Currency is never implicit. */
export interface Money {
  readonly amount: number;
  readonly currency: Currency;
}

/** Sort order for paginated and filtered queries. */
export type SortOrder = 'asc' | 'desc';

/** Paired English + Arabic strings — the canonical shape for user-visible text. */
export interface LocalizedText {
  readonly en: string;
  readonly ar: string;
}
