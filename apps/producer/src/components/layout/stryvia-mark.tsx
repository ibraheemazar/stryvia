import { cn } from '@/lib/utils';

interface StryviaMarkProps {
  className?: string;
  label?: string;
}

/**
 * Wordmark for the producer workspace. Pure SVG so it scales crisply at any
 * size and avoids a font-loading flash on the sidebar/topbar.
 */
export function StryviaMark({ className, label = 'STRYVIA' }: StryviaMarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className="grid h-7 w-7 place-items-center rounded-md text-primary-foreground"
        style={{ background: 'var(--brand-gradient)' }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4C3 3.44772 3.44772 3 4 3H10C12.2091 3 14 4.79086 14 7C14 9.20914 12.2091 11 10 11H6V13H4C3.44772 13 3 12.5523 3 12V4Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="font-display text-base font-semibold tracking-tight">{label}</span>
    </span>
  );
}
