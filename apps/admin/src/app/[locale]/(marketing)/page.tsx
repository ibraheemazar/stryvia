import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import { Button } from '@stryvia/ui/components/button';
import { Card, CardContent } from '@stryvia/ui/components/card';

interface MarketingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MarketingPage({ params }: MarketingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <Card className="w-full max-w-md shadow-elevated">
      <CardContent className="flex flex-col items-center gap-6 px-8 py-12 text-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {t('marketing.consoleTitle')}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{t('app.name')}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{t('marketing.subline')}</p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/auth/sign-in">{t('auth.signIn')}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
