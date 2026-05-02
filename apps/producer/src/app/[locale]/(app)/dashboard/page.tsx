import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AppShell } from '@/components/layout/app-shell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@stryvia/ui/components/card';

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const stats = [
    { key: 'activeProjects', label: t('dashboard.stats.activeProjects'), value: 0 },
    {
      key: 'opportunitiesIdentified',
      label: t('dashboard.stats.opportunitiesIdentified'),
      value: 0,
    },
    { key: 'pendingReview', label: t('dashboard.stats.pendingReview'), value: 0 },
  ] as const;

  return (
    <AppShell title={t('dashboard.title')}>
      <div className="space-y-10">
        <div>
          <p className="text-sm text-muted-foreground">{t('dashboard.welcome')}</p>
          <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            {t('app.name')}
          </h2>
        </div>

        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.key}>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="font-display text-4xl font-semibold">
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
              <CardTitle className="text-lg">{t('dashboard.activity.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                {t('dashboard.activity.empty')}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
