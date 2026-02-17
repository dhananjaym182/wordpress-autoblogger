import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface LoadingSkeletonProps {
  variant: 'card' | 'list' | 'table' | 'form' | 'calendar';
  count?: number;
}

export function LoadingSkeleton({ variant, count = 3 }: LoadingSkeletonProps) {
  switch (variant) {
    case 'card':
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </Card>
          ))}
        </div>
      );
    
    case 'list':
      return (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      );
    
    case 'table':
      return (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      );
    
    case 'form':
      return (
        <div className="space-y-4 max-w-xl">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-32" />
        </div>
      );
    
    case 'calendar':
      return (
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="space-x-2">
              <Skeleton className="h-8 w-8 inline-block" />
              <Skeleton className="h-8 w-8 inline-block" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      );
    
    default:
      return <Skeleton className="h-32 w-full" />;
  }
}
