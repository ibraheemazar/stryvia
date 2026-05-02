'use client';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@stryvia/ui/components/button';

interface ProjectsHeaderProps {
  title: string;
  ctaLabel: string;
}

export function ProjectsHeader({ title, ctaLabel }: ProjectsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <Button onClick={() => toast.info('Project creation is not yet wired.')}>
        <Plus className="h-4 w-4" />
        {ctaLabel}
      </Button>
    </div>
  );
}
