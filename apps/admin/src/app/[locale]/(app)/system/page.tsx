import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AdminShell } from '@/components/layout/admin-shell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@stryvia/ui/components/card';
import { cn } from '@stryvia/ui/lib/utils';

import { RefreshButton } from './refresh-button';

interface SystemPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SystemPage({ params }: SystemPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  type Tone = 'healthy' | 'gray';
  const cards: Array<{
    key: string;
    label: string;
    statusLabel: string;
    tone: Tone;
  }> = [
    {
      key: 'engine',
      label: t('system.cards.engine'),
      statusLabel: t('status.healthy'),
      tone: 'healthy',
    },
    {
      key: 'database',
      label: t('system.cards.database'),
      statusLabel: t('status.healthy'),
      tone: 'healthy',
    },
    {
      key: 'jobQueue',
      label: t('system.cards.jobQueue'),
      statusLabel: t('status.notConfigured'),
      tone: 'gray',
    },
  ];

  return (
    <AdminShell title={t('system.title')}>
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.key}>
              <CardHeader>
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="flex items-center gap-2 font-display text-2xl">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      card.tone === 'healthy' ? 'bg-brand-500' : 'bg-muted-foreground/40',
                    )}
                  />
                  <span>{card.statusLabel}</span>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <p className="text-xs text-muted-foreground">
              {t('common.lastChecked')}: {t('common.never')}
            </p>
            <RefreshButton label={t('common.refresh')} notWiredMessage={t('common.notWired')} />
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
