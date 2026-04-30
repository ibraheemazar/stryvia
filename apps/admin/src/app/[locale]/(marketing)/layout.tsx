import type * as React from 'react';
import { setRequestLocale } from 'next-intl/server';

import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { StryviaMark } from '@/components/layout/stryvia-mark';

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function MarketingLayout({ children, params }: MarketingLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="container-page flex h-16 items-center">
        <StryviaMark internal />
        <div className="ms-auto">
          <LanguageSwitcher />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">{children}</main>
    </div>
  );
}
