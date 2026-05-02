'use client';

import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@stryvia/ui/components/button';

interface RefreshButtonProps {
  label: string;
  notWiredMessage: string;
}

export function RefreshButton({ label, notWiredMessage }: RefreshButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={() => toast.info(notWiredMessage)}>
      <RefreshCw className="h-4 w-4" />
      {label}
    </Button>
  );
}
