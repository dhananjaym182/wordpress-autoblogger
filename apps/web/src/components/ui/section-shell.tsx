import { cn } from '@/lib/utils';

interface SectionShellProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionShell({
  title,
  description,
  className,
  actions,
  children,
}: SectionShellProps) {
  return (
    <section className={cn('space-y-4 rounded-xl border bg-card/70 p-5 shadow-sm', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div>{children}</div>
    </section>
  );
}

