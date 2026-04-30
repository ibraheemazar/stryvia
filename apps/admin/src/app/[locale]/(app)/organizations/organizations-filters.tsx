'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterKey = 'all' | 'producers' | 'brands' | 'agencies' | 'platforms';

interface OrganizationsFiltersProps {
  labels: Record<FilterKey, string>;
}

const ORDER: readonly FilterKey[] = ['all', 'producers', 'brands', 'agencies', 'platforms'];

export function OrganizationsFilters({ labels }: OrganizationsFiltersProps) {
  const [active, setActive] = React.useState<FilterKey>('all');

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ORDER.map((key) => (
        <Button
          key={key}
          type="button"
          variant={key === active ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActive(key)}
          className={cn(
            'rounded-full px-3 text-sm',
            key === active ? 'bg-primary/10 text-primary hover:bg-primary/15' : '',
          )}
        >
          {labels[key]}
        </Button>
      ))}
    </div>
  );
}
