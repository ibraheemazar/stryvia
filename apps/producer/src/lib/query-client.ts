import { QueryClient } from '@tanstack/react-query';

/**
 * Build a fresh QueryClient. Called per request on the server (so caches are
 * not shared across users) and once on the client.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry 4xx — these are caller errors. Retry up to 2x for
          // transient infra failures.
          if (error instanceof Error && /^4\d\d$/.test(error.message)) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
