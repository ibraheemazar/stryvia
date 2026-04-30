import type * as React from 'react';
import { setRequestLocale } from 'next-intl/server';

interface AppGroupLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AppGroupLayout({ children, params }: AppGroupLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
