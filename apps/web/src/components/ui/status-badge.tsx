import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const getVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'ok':
    case 'completed':
    case 'published':
    case 'active':
      return 'default';
    case 'error':
    case 'failed':
    case 'past_due':
      return 'destructive';
    case 'pending':
    case 'scheduled':
    case 'running':
      return 'secondary';
    default:
      return 'outline';
  }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={getVariant(status)}>{status}</Badge>;
}

