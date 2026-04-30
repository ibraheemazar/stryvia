/**
 * Discriminated-union Result for operations that may fail with a typed error
 * rather than throwing. Prefer Result<T, E> at module boundaries where error
 * semantics matter; throwing is fine inside trusted internal code.
 */

/** Successful outcome carrying a value of T. */
export interface Success<T> {
  readonly ok: true;
  readonly value: T;
}

/** Failed outcome carrying an error of E. */
export interface Failure<E> {
  readonly ok: false;
  readonly error: E;
}

/** A computation that produces T or fails with E. */
export type Result<T, E> = Success<T> | Failure<E>;

/** Construct a successful {@link Result}. */
export const success = <T>(value: T): Success<T> => ({ ok: true, value });

/** Construct a failed {@link Result}. */
export const failure = <E>(error: E): Failure<E> => ({ ok: false, error });
