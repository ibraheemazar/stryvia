/**
 * next-intl typed translations.
 *
 * Augments the `IntlMessages` interface so `useTranslations` and `getTranslations`
 * type-check the keys you pass against the canonical English message file.
 *
 * https://next-intl.dev/docs/workflows/typescript
 */
import type messages from '../i18n/messages/en.json';

declare global {
  type IntlMessages = typeof messages;
}

export {};
