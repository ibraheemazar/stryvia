/**
 * Typed fetch wrapper for the STRYVIA engine.
 *
 * Returns an `ApiResponse<T>` envelope (from `@stryvia/types`) regardless of
 * whether the engine itself emits one. The engine's current health endpoints
 * return raw bodies, so we wrap success bodies into `{ ok: true, data }`. When
 * the engine starts returning native envelopes we'll detect and pass them
 * through unchanged.
 */

import type { ApiError, ApiResponse, ErrorCode } from '@stryvia/types';

const DEFAULT_BASE_URL = 'http://localhost:8000';

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_ENGINE_URL ?? DEFAULT_BASE_URL;
}

interface RequestOptions {
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

interface RawError {
  ok: false;
  error: ApiError;
}

function isApiResponseShape(value: unknown): value is ApiResponse<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'ok' in value &&
    typeof (value as { ok: unknown }).ok === 'boolean'
  );
}

function codeForStatus(status: number): ErrorCode {
  if (status === 401) return 'unauthenticated';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 409) return 'conflict';
  if (status === 412) return 'precondition_failed';
  if (status === 422) return 'validation_failed';
  if (status === 429) return 'rate_limited';
  if (status === 503) return 'engine_unavailable';
  if (status === 504) return 'engine_timeout';
  if (status >= 500) return 'internal_error';
  return 'unknown';
}

function buildError(
  status: number,
  message: string,
  details: Record<string, unknown> | null = null,
  traceId: string | null = null,
): RawError {
  return {
    ok: false,
    error: {
      code: codeForStatus(status),
      message,
      httpStatus: status,
      traceId,
      issues: null,
      details,
    },
  };
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return response.text().catch(() => null);
  }
  return response.json().catch(() => null);
}

async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body: unknown,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl()}${path}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options.signal,
    });
  } catch (cause) {
    return buildError(0, cause instanceof Error ? cause.message : 'Network request failed', {
      kind: 'network',
    });
  }

  const traceId = response.headers.get('x-trace-id');
  const parsed = await parseBody(response);

  if (isApiResponseShape(parsed)) {
    // Engine already returned an envelope — pass through unchanged.
    return parsed as ApiResponse<T>;
  }

  if (!response.ok) {
    const message =
      parsed && typeof parsed === 'object' && 'message' in parsed
        ? String((parsed as { message: unknown }).message)
        : `HTTP ${response.status}`;
    return buildError(
      response.status,
      message,
      (parsed as Record<string, unknown>) ?? null,
      traceId,
    );
  }

  return { ok: true, data: parsed as T };
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
};

export type { ApiError, ApiResponse } from '@stryvia/types';
