/**
 * @stryvia/api-client/react — React hooks entry.
 *
 * TanStack Query wrappers around the domain functions. Loaded only by
 * React consumers (the apps). Non-React consumers import the main entry,
 * which doesn't pull React or @tanstack/react-query into scope.
 *
 * Hook signatures match the previous inline implementation in
 * apps/producer/src/lib/api/health.ts so the producer migration is a
 * pure import-path change.
 */

'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { ApiResponse } from '@stryvia/types';

import {
  getEngineLiveness,
  getEngineReadiness,
  getEngineVersion,
  type LiveResponse,
  type ReadyResponse,
  type VersionResponse,
} from './domain/health';

export const engineQueryKeys = {
  all: ['engine'] as const,
  live: () => [...engineQueryKeys.all, 'live'] as const,
  ready: () => [...engineQueryKeys.all, 'ready'] as const,
  version: () => [...engineQueryKeys.all, 'version'] as const,
};

export function useEngineLiveness(): UseQueryResult<ApiResponse<LiveResponse>> {
  return useQuery({
    queryKey: engineQueryKeys.live(),
    queryFn: ({ signal }) => getEngineLiveness({ signal }),
  });
}

export function useEngineReadiness(): UseQueryResult<ApiResponse<ReadyResponse>> {
  return useQuery({
    queryKey: engineQueryKeys.ready(),
    queryFn: ({ signal }) => getEngineReadiness({ signal }),
  });
}

export function useEngineVersion(): UseQueryResult<ApiResponse<VersionResponse>> {
  return useQuery({
    queryKey: engineQueryKeys.version(),
    queryFn: ({ signal }) => getEngineVersion({ signal }),
    staleTime: 5 * 60_000,
  });
}

// Re-export the response types so consumers can type their components
// without reaching into the domain layer.
export type { LiveResponse, ReadyResponse, VersionResponse };
