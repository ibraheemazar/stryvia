import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AppShell } from '@/components/layout/app-shell';
import { ProjectsHeader } from './projects-header';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <AppShell title={t('projects.title')}>
      <div className="space-y-8">
        <ProjectsHeader title={t('projects.title')} ctaLabel={t('projects.newProject')} />
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div
              aria-hidden="true"
              className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 7h18M3 12h18M3 17h12" strokeLinecap="round" />
              </svg>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">{t('projects.empty')}</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
