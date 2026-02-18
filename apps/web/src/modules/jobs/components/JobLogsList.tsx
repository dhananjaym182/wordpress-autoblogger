'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Clock, RefreshCw, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface JobLogItem {
  id: string;
  scheduledPostId: string;
  scheduledPostTitle: string;
  projectName: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  textProviderUsed: string | null;
  imageProviderUsed: string | null;
  fallbackCount: number;
  wpResponseCode: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  traceId: string;
}

interface JobLogsListProps {
  logs: JobLogItem[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <X className="h-4 w-4 text-red-500" />;
    case 'running':
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

const formatDuration = (durationMs: number | null) => {
  if (!durationMs) return '-';
  const seconds = Math.floor(durationMs / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

export function JobLogsList({ logs }: JobLogsListProps) {
  const router = useRouter();
  const [selectedLog, setSelectedLog] = useState<JobLogItem | null>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Job Logs</CardTitle>
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Started</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Fallbacks</TableHead>
                <TableHead>WP</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">{formatDate(log.startedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <StatusBadge status={log.status} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{log.scheduledPostTitle}</p>
                      <p className="truncate text-xs text-muted-foreground">{log.projectName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{formatDuration(log.durationMs)}</TableCell>
                  <TableCell className="text-sm">
                    {log.textProviderUsed || log.imageProviderUsed || '-'}
                  </TableCell>
                  <TableCell>
                    {log.fallbackCount > 0 ? (
                      <Badge variant="outline">{log.fallbackCount}</Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {log.wpResponseCode ? (
                      <Badge variant={log.wpResponseCode < 400 ? 'default' : 'destructive'}>
                        {log.wpResponseCode}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Job details</DialogTitle>
                        </DialogHeader>
                        {selectedLog ? (
                          <div className="space-y-4 text-sm">
                            <div>
                              <p className="font-medium">Trace ID</p>
                              <p className="text-muted-foreground">{selectedLog.traceId}</p>
                            </div>
                            <div>
                              <p className="font-medium">Post</p>
                              <p className="text-muted-foreground">
                                {selectedLog.scheduledPostTitle} ({selectedLog.projectName})
                              </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <p className="font-medium">Started</p>
                                <p className="text-muted-foreground">{formatDate(selectedLog.startedAt)}</p>
                              </div>
                              <div>
                                <p className="font-medium">Finished</p>
                                <p className="text-muted-foreground">
                                  {selectedLog.finishedAt ? formatDate(selectedLog.finishedAt) : 'Still running'}
                                </p>
                              </div>
                            </div>
                            {selectedLog.errorMessage ? (
                              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                                <div className="mb-1 flex items-center gap-2 font-medium">
                                  <AlertCircle className="h-4 w-4" />
                                  Failure details
                                </div>
                                <p>{selectedLog.errorCode ?? 'UNKNOWN'}: {selectedLog.errorMessage}</p>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">No job runs yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

