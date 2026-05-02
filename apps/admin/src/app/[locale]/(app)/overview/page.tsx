import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AdminShell } from '@/components/layout/admin-shell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@stryvia/ui/components/card';

interface OverviewPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const stats: Array<{
    key: 'runsToday' | 'pendingReview' | 'activeOrganizations' | 'systemHealth';
    label: string;
    value: React.ReactNode;
  }> = [
    { key: 'runsToday', label: t('overview.stats.runsToday'), value: '0' },
    { key: 'pendingReview', label: t('overview.stats.pendingReview'), value: '0' },
    { key: 'activeOrganizations', label: t('overview.stats.activeOrganizations'), value: '0' },
    {
      key: 'systemHealth',
      label: t('overview.stats.systemHealth'),
      value: (
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand-500" />
          <span className="font-display text-2xl font-semibold">{t('status.healthy')}</span>
        </span>
      ),
    },
  ];

  return (
    <AdminShell title={t('overview.title')}>
      <div className="space-y-8">
        <div>
          <p className="text-sm text-muted-foreground">{t('overview.welcome')}</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            {t('app.name')}
          </h2>
        </div>

        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.key}>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="font-display text-3xl font-semibold">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('overview.recentRuns.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                {t('overview.recentRuns.empty')}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminShell>
  );
}
