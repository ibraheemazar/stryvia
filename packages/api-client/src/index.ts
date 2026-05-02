/**
 * @stryvia/api-client — main entry.
 *
 * Public surface for non-React consumers (Node scripts, Next.js server
 * components, route handlers). The React entry is at @stryvia/api-client/react.
 *
 * Per the Q-007 hybrid decision, apps import only from this entry and from
 * /react. The src/generated/ layer is package-internal.
 */

// Boundary client — apps generally don't need this directly, but exposing it
// keeps escape hatches open for one-off calls and tests.
export { apiClient } from './client';
export type { RequestOptions } from './client';

// Error helpers.
export { validationFailure } from './errors';

// Health domain — the reference endpoint set proving the generated -> Zod ->
// domain -> app pattern. Apps consume these (or the React hooks in /react).
export {
  getEngineLiveness,
  getEngineReadiness,
  getEngineVersion,
  liveResponseSchema,
  readyResponseSchema,
  versionResponseSchema,
} from './domain/health';

export type { LiveResponse, ReadyResponse, VersionResponse } from './domain/health';

// Re-export the envelope contract from @stryvia/types so consumers have a
// single import for the wire format. The types themselves live in
// packages/types/src/api/ — this is a convenience re-export, not a
// redefinition.
export type { ApiResponse, ApiError, ErrorCode } from '@stryvia/types';
