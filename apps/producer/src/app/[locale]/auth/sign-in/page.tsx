import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@stryvia/ui/components/card';
import { StryviaMark } from '@/components/layout/stryvia-mark';

interface SignInPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <Card className="w-full max-w-md shadow-elevated">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <StryviaMark />
        </div>
        <CardTitle className="font-display text-2xl">{t('auth.placeholder.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-sm text-muted-foreground">{t('auth.placeholder.body')}</p>
      </CardContent>
    </Card>
  );
}
