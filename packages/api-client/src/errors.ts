/**
 * Helpers for translating runtime validation failures into ApiResponse failures.
 * The client itself never throws — failures always come back through the
 * ApiResponse<T> discriminated union.
 */

import type { ApiResponse, ApiError } from '@stryvia/types';

export function validationFailure(
  message: string,
  details: Record<string, unknown> | null = null,
): ApiResponse<never> {
  const error: ApiError = {
    code: 'validation_failed',
    message,
    httpStatus: 0,
    traceId: null,
    issues: null,
    details,
  };
  return { ok: false, error };
}
