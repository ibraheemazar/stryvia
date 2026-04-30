/**
 * STRYVIA locale registry — single source of truth.
 *
 * All locale-aware code (middleware, server components, navigation helpers)
 * reads from this module. Adding a locale starts here.
 */

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Reading direction per locale — drives the html dir attribute and font choice. */
export const directions = {
  en: 'ltr',
  ar: 'rtl',
} as const satisfies Record<Locale, 'ltr' | 'rtl'>;

export const localeLabels = {
  en: 'English',
  ar: 'العربية',
} as const satisfies Record<Locale, string>;

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function directionFor(locale: Locale): 'ltr' | 'rtl' {
  return directions[locale];
}
