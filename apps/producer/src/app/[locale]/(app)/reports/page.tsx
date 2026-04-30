import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';

interface ReportsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <AppShell title={t('reports.title')}>
      <div className="space-y-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">{t('reports.title')}</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <p className="text-sm text-muted-foreground">{t('reports.empty')}</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
