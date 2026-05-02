/**
 * Engine health endpoints — Zod-validated domain wrappers around apiClient.
 *
 * Schemas mirror components.schemas.{LiveResponse, ReadyResponse, VersionResponse}
 * from src/generated/schema.d.ts. If the generated types drift from these
 * schemas, regenerate via "npm run codegen" and update the schemas to match.
 *
 * /api/health/ready can return 200 or 503 with the same body — the 503 is a
 * structured "not ready" signal, not a transport failure. We pass both through
 * to the caller (the boundary client wraps whichever one we get into a success
 * envelope, since a body was successfully parsed).
 */

import { z } from 'zod';

import type { ApiResponse } from '@stryvia/types';

import { apiClient, type RequestOptions } from '../client';
import { validationFailure } from '../errors';

export const liveResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.string(),
  version: z.string(),
  environment: z.string(),
});

export const readyResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  service: z.string(),
  version: z.string(),
  environment: z.string(),
  database: z.enum(['ok', 'unavailable']),
});

export const versionResponseSchema = z.object({
  engine_version: z.string(),
  methodology_version: z.string(),
  build_timestamp: z.string(),
});

export type LiveResponse = z.infer<typeof liveResponseSchema>;
export type ReadyResponse = z.infer<typeof readyResponseSchema>;
export type VersionResponse = z.infer<typeof versionResponseSchema>;

function validate<T>(schema: z.ZodType<T>, raw: unknown, endpoint: string): ApiResponse<T> {
  const result = schema.safeParse(raw);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return validationFailure(`Response from ${endpoint} did not match expected schema`, {
    endpoint,
    issues: result.error.issues,
  });
}

export async function getEngineLiveness(
  options?: RequestOptions,
): Promise<ApiResponse<LiveResponse>> {
  const response = await apiClient.get<unknown>('/api/health/live', options);
  if (!response.ok) return response;
  return validate(liveResponseSchema, response.data, '/api/health/live');
}

export async function getEngineReadiness(
  options?: RequestOptions,
): Promise<ApiResponse<ReadyResponse>> {
  const response = await apiClient.get<unknown>('/api/health/ready', options);
  if (!response.ok) {
    if (response.error.httpStatus === 503 && response.error.details) {
      return validate(readyResponseSchema, response.error.details, '/api/health/ready');
    }
    return response;
  }
  return validate(readyResponseSchema, response.data, '/api/health/ready');
}

export async function getEngineVersion(
  options?: RequestOptions,
): Promise<ApiResponse<VersionResponse>> {
  const response = await apiClient.get<unknown>('/api/health/version', options);
  if (!response.ok) return response;
  return validate(versionResponseSchema, response.data, '/api/health/version');
}
