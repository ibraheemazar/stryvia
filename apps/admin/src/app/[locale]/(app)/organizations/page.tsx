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

import { OrganizationsFilters } from './organizations-filters';

interface OrganizationsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OrganizationsPage({ params }: OrganizationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <AdminShell title={t('organizations.title')}>
      <div className="space-y-6">
        <OrganizationsFilters
          labels={{
            all: t('organizations.filters.all'),
            producers: t('organizations.filters.producers'),
            brands: t('organizations.filters.brands'),
            agencies: t('organizations.filters.agencies'),
            platforms: t('organizations.filters.platforms'),
          }}
        />
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('organizations.table.name')}</TableHead>
                  <TableHead>{t('organizations.table.type')}</TableHead>
                  <TableHead>{t('organizations.table.status')}</TableHead>
                  <TableHead>{t('organizations.table.joined')}</TableHead>
                  <TableHead>{t('organizations.table.lastActive')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-16 text-center text-sm text-muted-foreground"
                  >
                    {t('organizations.empty')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
