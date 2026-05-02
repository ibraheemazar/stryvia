'use client';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@stryvia/ui/components/button';
import { Card, CardContent } from '@stryvia/ui/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@stryvia/ui/components/tabs';

interface BenchmarksTabsProps {
  labels: {
    rateCards: string;
    talentProfiles: string;
    platformProfiles: string;
    add: string;
    notWired: string;
    empty: {
      rateCards: string;
      talentProfiles: string;
      platformProfiles: string;
    };
  };
}

export function BenchmarksTabs({ labels }: BenchmarksTabsProps) {
  const handleAdd = () => toast.info(labels.notWired);

  const renderEmptyState = (text: string) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">{text}</p>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          {labels.add}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="rateCards">
      <TabsList>
        <TabsTrigger value="rateCards">{labels.rateCards}</TabsTrigger>
        <TabsTrigger value="talentProfiles">{labels.talentProfiles}</TabsTrigger>
        <TabsTrigger value="platformProfiles">{labels.platformProfiles}</TabsTrigger>
      </TabsList>
      <TabsContent value="rateCards">{renderEmptyState(labels.empty.rateCards)}</TabsContent>
      <TabsContent value="talentProfiles">
        {renderEmptyState(labels.empty.talentProfiles)}
      </TabsContent>
      <TabsContent value="platformProfiles">
        {renderEmptyState(labels.empty.platformProfiles)}
      </TabsContent>
    </Tabs>
  );
}
