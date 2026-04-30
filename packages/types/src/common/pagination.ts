import type { SortOrder } from './enums.js';

/** Cursor-based pagination request parameters. */
export interface PaginationParams {
  readonly cursor?: string;
  readonly limit?: number;
}

/** Offset/page-based pagination request parameters. */
export interface OffsetPaginationParams {
  readonly page: number;
  readonly pageSize: number;
}

/** Sort parameters paired with pagination. `TField` constrains valid sort keys. */
export interface SortParams<TField extends string = string> {
  readonly sortBy: TField;
  readonly sortOrder: SortOrder;
}

/** Page metadata returned alongside cursor-paginated results. */
export interface PageInfo {
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly startCursor: string | null;
  readonly endCursor: string | null;
  readonly totalCount: number | null;
}

/** Generic cursor-paginated response wrapper. */
export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly pageInfo: PageInfo;
}
