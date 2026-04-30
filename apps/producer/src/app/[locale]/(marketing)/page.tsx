import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

interface MarketingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MarketingPage({ params }: MarketingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <section className="container-page flex min-h-[70vh] flex-col items-start justify-center py-24">
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
        {t('app.tagline')}
      </p>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
        {t('marketing.heroTitle')}
      </h1>
      <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
        {t('marketing.heroBody')}
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <Link href="/auth/sign-in">{t('marketing.ctaSignIn')}</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/dashboard">{t('marketing.ctaLearnMore')}</Link>
        </Button>
      </div>
    </section>
  );
}
