import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AdminShell } from '@/components/layout/admin-shell';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UsersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function UsersPage({ params }: UsersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <AdminShell title={t('users.title')}>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('users.table.name')}</TableHead>
                <TableHead>{t('users.table.email')}</TableHead>
                <TableHead>{t('users.table.organization')}</TableHead>
                <TableHead>{t('users.table.role')}</TableHead>
                <TableHead>{t('users.table.lastLogin')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center text-sm text-muted-foreground">
                  {t('users.empty')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
