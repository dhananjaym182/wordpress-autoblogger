import { cn } from '@/lib/utils';

interface DataToolbarProps {
  className?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export function DataToolbar({ className, leading, trailing }: DataToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border bg-card/70 p-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">{leading}</div>
      <div className="flex flex-wrap items-center gap-2">{trailing}</div>
    </div>
  );
}

