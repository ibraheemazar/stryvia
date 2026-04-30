import { Search } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AdminShell } from '@/components/layout/admin-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface AuditPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <AdminShell title={t('audit.title')}>
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder={t('audit.searchPlaceholder')}
            aria-label={t('common.search')}
            className="ps-9"
          />
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-20 text-sm text-muted-foreground">
            {t('audit.empty')}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
