"use client"

import { useState } from "react"
import { ChevronRight, Check, X, Clock, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface JobLog {
  id: string
  scheduledPostId: string
  status: "running" | "completed" | "failed"
  startedAt: Date
  finishedAt?: Date
  durationMs?: number
  textProviderUsed?: string
  fallbackCount: number
  wpResponseCode?: number
}

export function JobLogsList() {
  const [logs, setLogs] = useState<JobLog[]>([
    {
      id: "1",
      scheduledPostId: "post-1",
      status: "completed",
      startedAt: new Date(Date.now() - 3600000),
      finishedAt: new Date(Date.now() - 3500000),
      durationMs: 100000,
      textProviderUsed: "OpenAI",
      fallbackCount: 0,
      wpResponseCode: 200,
    },
    {
      id: "2",
      scheduledPostId: "post-2",
      status: "failed",
      startedAt: new Date(Date.now() - 7200000),
      finishedAt: new Date(Date.now() - 7100000),
      durationMs: 100000,
      textProviderUsed: "Anthropic",
      fallbackCount: 2,
      wpResponseCode: 500,
    },
    {
      id: "3",
      scheduledPostId: "post-3",
      status: "running",
      startedAt: new Date(Date.now() - 60000),
      textProviderUsed: "OpenAI",
      fallbackCount: 0,
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />
      case "failed":
        return <X className="h-4 w-4 text-red-500" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Job Logs</CardTitle>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Started</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Fallbacks</TableHead>
              <TableHead>WP Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm">{formatDate(log.startedAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <Badge
                      variant={
                        log.status === "completed"
                          ? "default"
                          : log.status === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {log.durationMs ? formatDuration(log.durationMs) : "-"}
                </TableCell>
                <TableCell className="text-sm">{log.textProviderUsed || "-"}</TableCell>
                <TableCell className="text-sm">
                  {log.fallbackCount > 0 && (
                    <Badge variant="outline">{log.fallbackCount}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {log.wpResponseCode ? (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={log.wpResponseCode === 200 ? "default" : "destructive"}
                      >
                        {log.wpResponseCode}
                      </Badge>
                      {log.wpResponseCode !== 200 && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Job Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <span className="text-sm font-medium">Job ID:</span>
                          <p className="text-sm text-muted-foreground mt-1">{log.id}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Scheduled Post ID:</span>
                          <p className="text-sm text-muted-foreground mt-1">{log.scheduledPostId}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Status:</span>
                          <p className="text-sm mt-1">{log.status}</p>
                        </div>
                        {log.finishedAt && (
                          <div>
                            <span className="text-sm font-medium">Duration:</span>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDuration(log.durationMs || 0)}
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
