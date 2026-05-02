'use client';

import { RefreshCw, AlertTriangle } from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';

import { useEngineLiveness, useEngineReadiness, useEngineVersion } from '@/lib/api/health';
import type { ApiResponse } from '@/lib/api/client';
import { Alert, AlertDescription, AlertTitle } from '@stryvia/ui/components/alert';
import { Button } from '@stryvia/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@stryvia/ui/components/card';
import { Badge } from '@stryvia/ui/components/badge';

type Phase = 'loading' | 'error' | 'envelope-error' | 'success';

interface CardSpec<T> {
  key: 'live' | 'ready' | 'version';
  title: string;
  description: string;
  query: UseQueryResult<ApiResponse<T>>;
}

function phaseFor<T>(query: UseQueryResult<ApiResponse<T>>): Phase {
  if (query.isPending || query.isFetching) return 'loading';
  if (query.isError) return 'error';
  if (query.data && query.data.ok === false) return 'envelope-error';
  return 'success';
}

function PhaseBadge({ phase }: { phase: Phase }) {
  if (phase === 'loading') return <Badge variant="secondary">Loading…</Badge>;
  if (phase === 'success') return <Badge>Healthy</Badge>;
  return <Badge variant="destructive">Error</Badge>;
}

function StatusCard<T>({ spec }: { spec: CardSpec<T> }) {
  const phase = phaseFor(spec.query);

  let body: unknown;
  if (phase === 'loading') {
    body = { state: 'loading' };
  } else if (phase === 'error') {
    body = {
      state: 'network-error',
      message: spec.query.error instanceof Error ? spec.query.error.message : 'Request failed',
    };
  } else if (phase === 'envelope-error') {
    body = spec.query.data;
  } else {
    body = spec.query.data && 'data' in spec.query.data ? spec.query.data.data : spec.query.data;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardDescription>{spec.description}</CardDescription>
            <CardTitle className="font-display text-lg">{spec.title}</CardTitle>
          </div>
          <PhaseBadge phase={phase} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <pre className="max-h-72 overflow-auto rounded-md border bg-muted/40 p-3 text-xs leading-relaxed">
          {JSON.stringify(body, null, 2)}
        </pre>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            void spec.query.refetch();
          }}
          disabled={phase === 'loading'}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
}

export function SystemStatusCards() {
  const liveQuery = useEngineLiveness();
  const readyQuery = useEngineReadiness();
  const versionQuery = useEngineVersion();

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Dev-only verification</AlertTitle>
        <AlertDescription>
          If this page shows red errors, the engine isn&apos;t running on the configured URL.
          Default base URL is <code className="font-mono">http://localhost:8000</code> (override via{' '}
          <code className="font-mono">NEXT_PUBLIC_ENGINE_URL</code>).
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatusCard
          spec={{
            key: 'live',
            title: '/api/health/live',
            description: 'Liveness probe',
            query: liveQuery,
          }}
        />
        <StatusCard
          spec={{
            key: 'ready',
            title: '/api/health/ready',
            description: 'Readiness probe (DB-aware)',
            query: readyQuery,
          }}
        />
        <StatusCard
          spec={{
            key: 'version',
            title: '/api/health/version',
            description: 'Build metadata',
            query: versionQuery,
          }}
        />
      </div>
    </div>
  );
}
