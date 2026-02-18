import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonBlockProps {
  lines?: number;
}

export function SkeletonBlock({ lines = 3 }: SkeletonBlockProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </div>
  );
}

