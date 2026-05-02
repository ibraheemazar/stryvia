import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AdminShell } from '@/components/layout/admin-shell';
import { Card, CardContent } from '@stryvia/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@stryvia/ui/components/table';

interface RunsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RunsPage({ params }: RunsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <AdminShell title={t('runs.title')}>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('runs.table.runId')}</TableHead>
                <TableHead>{t('runs.table.project')}</TableHead>
                <TableHead>{t('runs.table.engineVersion')}</TableHead>
                <TableHead>{t('runs.table.status')}</TableHead>
                <TableHead>{t('runs.table.started')}</TableHead>
                <TableHead>{t('runs.table.duration')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                  {t('runs.empty')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
