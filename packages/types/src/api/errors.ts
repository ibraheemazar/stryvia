/** Stable, machine-readable error codes returned by the STRYVIA API. */
export type ErrorCode =
  | 'unauthenticated'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation_failed'
  | 'conflict'
  | 'rate_limited'
  | 'precondition_failed'
  | 'engine_unavailable'
  | 'engine_timeout'
  | 'internal_error'
  | 'unknown';

/** A single per-field validation issue. */
export interface ValidationIssue {
  readonly field: string;
  readonly code: string;
  readonly message: string;
}

/**
 * Standardised error envelope. Every non-2xx API response has this shape.
 */
export interface ApiError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly httpStatus: number;
  /** Identifier the client can quote in support requests. */
  readonly traceId: string | null;
  /** Field-level issues for validation errors. */
  readonly issues: readonly ValidationIssue[] | null;
  /** Free-form structured payload — interpretation depends on `code`. */
  readonly details: Record<string, unknown> | null;
}
