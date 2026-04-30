import { getTranslations, setRequestLocale } from 'next-intl/server';

import { SignInForm } from './sign-in-form';

interface SignInPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <SignInForm
      heading={t('auth.signInTitle')}
      subline={t('auth.signInSubline')}
      labels={{
        email: t('auth.email'),
        password: t('auth.password'),
        emailPlaceholder: t('auth.emailPlaceholder'),
        passwordPlaceholder: t('auth.passwordPlaceholder'),
        submit: t('auth.signIn'),
        notWired: t('auth.notWired'),
      }}
    />
  );
}
