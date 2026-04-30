'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { ApiResponse } from '@stryvia/types';

import { apiClient } from './client';

export interface EngineLiveResponse {
  status: 'ok';
  service: string;
  version: string;
  environment: string;
}

export interface EngineReadyResponse {
  status: 'ok' | 'degraded';
  service: string;
  version: string;
  environment: string;
  database: 'ok' | 'unavailable';
}

export interface EngineVersionResponse {
  engine_version: string;
  methodology_version: string;
  build_timestamp: string;
}

export const engineQueryKeys = {
  all: ['engine'] as const,
  live: () => [...engineQueryKeys.all, 'live'] as const,
  ready: () => [...engineQueryKeys.all, 'ready'] as const,
  version: () => [...engineQueryKeys.all, 'version'] as const,
};

export function useEngineLiveness(): UseQueryResult<ApiResponse<EngineLiveResponse>> {
  return useQuery({
    queryKey: engineQueryKeys.live(),
    queryFn: ({ signal }) => apiClient.get<EngineLiveResponse>('/api/health/live', { signal }),
  });
}

export function useEngineReadiness(): UseQueryResult<ApiResponse<EngineReadyResponse>> {
  return useQuery({
    queryKey: engineQueryKeys.ready(),
    queryFn: ({ signal }) => apiClient.get<EngineReadyResponse>('/api/health/ready', { signal }),
  });
}

export function useEngineVersion(): UseQueryResult<ApiResponse<EngineVersionResponse>> {
  return useQuery({
    queryKey: engineQueryKeys.version(),
    queryFn: ({ signal }) =>
      apiClient.get<EngineVersionResponse>('/api/health/version', { signal }),
    staleTime: 5 * 60_000,
  });
}
