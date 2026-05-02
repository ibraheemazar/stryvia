import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AppShell } from '@/components/layout/app-shell';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@stryvia/ui/components/card';

interface SettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <AppShell title={t('settings.title')}>
      <div className="space-y-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          {t('settings.title')}
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('settings.language.title')}</CardTitle>
            <CardDescription>{t('settings.language.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LanguageSwitcher />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
