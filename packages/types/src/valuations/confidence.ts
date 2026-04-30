/** Bucketed confidence rating for a valuation output. */
export type ConfidenceRating = 'low' | 'medium' | 'high';

/**
 * Confidence interval around a valuation point estimate. All three values
 * share the same units (typically a money amount or a normalized score).
 */
export interface ConfidenceRange {
  readonly low: number;
  readonly mid: number;
  readonly high: number;
  readonly rating: ConfidenceRating;
}
