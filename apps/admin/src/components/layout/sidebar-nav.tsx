'use client';

import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  Building2,
  Users,
  ScrollText,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react';

import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface NavItem {
  href:
    | '/overview'
    | '/runs'
    | '/benchmarks'
    | '/organizations'
    | '/users'
    | '/audit'
    | '/system'
    | '/system-status';
  labelKey:
    | 'nav.overview'
    | 'nav.runs'
    | 'nav.benchmarks'
    | 'nav.organizations'
    | 'nav.users'
    | 'nav.audit'
    | 'nav.system'
    | 'nav.systemStatus';
  icon: LucideIcon;
  devOnly?: boolean;
}

const PRIMARY: readonly NavItem[] = [
  { href: '/overview', labelKey: 'nav.overview', icon: LayoutDashboard },
  { href: '/runs', labelKey: 'nav.runs', icon: Activity },
  { href: '/benchmarks', labelKey: 'nav.benchmarks', icon: BarChart3 },
  { href: '/organizations', labelKey: 'nav.organizations', icon: Building2 },
  { href: '/users', labelKey: 'nav.users', icon: Users },
];

const SECONDARY: readonly NavItem[] = [
  { href: '/audit', labelKey: 'nav.audit', icon: ScrollText },
  { href: '/system', labelKey: 'nav.system', icon: HeartPulse },
  { href: '/system-status', labelKey: 'nav.systemStatus', icon: HeartPulse, devOnly: true },
];

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const t = useTranslations();
  const pathname = usePathname();

  const renderItem = (item: NavItem) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="flex-1 truncate">{t(item.labelKey)}</span>
          {item.devOnly ? (
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Dev
            </span>
          ) : null}
        </Link>
      </li>
    );
  };

  return (
    <nav className="flex flex-1 flex-col gap-6 px-3 py-4">
      <ul className="flex flex-col gap-1">{PRIMARY.map(renderItem)}</ul>
      <div className="border-t border-border" />
      <ul className="flex flex-col gap-1">{SECONDARY.map(renderItem)}</ul>
    </nav>
  );
}
