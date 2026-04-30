import type { ApiError } from './errors.js';

/** Success envelope. */
export interface ApiSuccess<T> {
  readonly ok: true;
  readonly data: T;
}

/** Failure envelope. */
export interface ApiFailure {
  readonly ok: false;
  readonly error: ApiError;
}

/** Discriminated-union API response — every JSON response from the API matches. */
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
