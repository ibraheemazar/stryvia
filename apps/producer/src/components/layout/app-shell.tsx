'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';

import { StryviaMark } from '@/components/layout/stryvia-mark';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface AppShellProps {
  title?: string;
  children: React.ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar — fixed left, ~256px wide. */}
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 flex-col border-e border-border bg-card lg:flex">
        <SidebarHeader />
        <SidebarNav />
        <SidebarFooter />
      </aside>

      {/* Mobile drawer */}
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="start-0 top-0 h-full max-h-screen w-72 max-w-[85vw] translate-x-0 translate-y-0 rounded-none p-0 sm:rounded-none">
          <DialogTitle className="sr-only">Navigation</DialogTitle>
          <div className="flex h-full flex-col">
            <SidebarHeader />
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
            <SidebarFooter />
          </div>
        </DialogContent>
      </Dialog>

      {/* Top bar + main */}
      <div className="lg:ps-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="truncate font-display text-base font-semibold tracking-tight">
            {title ?? ''}
          </h1>

          <div className="ms-auto flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </header>

        <main className="container-page py-10">{children}</main>
      </div>
    </div>
  );
}

function SidebarHeader() {
  return (
    <div className="flex h-16 items-center border-b border-border px-5">
      <StryviaMark />
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-3 rounded-md px-2 py-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Producer</p>
          <p className="truncate text-xs text-muted-foreground">Not signed in</p>
        </div>
      </div>
    </div>
  );
}
