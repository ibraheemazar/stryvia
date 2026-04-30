import { setRequestLocale } from 'next-intl/server';

import { AdminShell } from '@/components/layout/admin-shell';

import { SystemStatusCards } from './system-status-cards';

interface SystemStatusPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SystemStatusPage({ params }: SystemStatusPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell title="System Status">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Live readout from the engine&apos;s health endpoints. This page is for development
          verification only.
        </p>
      </div>
      <div className="mt-6">
        <SystemStatusCards />
      </div>
    </AdminShell>
  );
}
