import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AdminShell } from '@/components/layout/admin-shell';

import { BenchmarksTabs } from './benchmarks-tabs';

interface BenchmarksPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BenchmarksPage({ params }: BenchmarksPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <AdminShell title={t('benchmarks.title')}>
      <BenchmarksTabs
        labels={{
          rateCards: t('benchmarks.tabs.rateCards'),
          talentProfiles: t('benchmarks.tabs.talentProfiles'),
          platformProfiles: t('benchmarks.tabs.platformProfiles'),
          add: t('common.add'),
          notWired: t('common.notWired'),
          empty: {
            rateCards: t('benchmarks.empty.rateCards'),
            talentProfiles: t('benchmarks.empty.talentProfiles'),
            platformProfiles: t('benchmarks.empty.platformProfiles'),
          },
        }}
      />
    </AdminShell>
  );
}
