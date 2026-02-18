'use client';

import { useMemo, useState, useTransition } from 'react';
import { format, isSameDay } from 'date-fns';
import { Plus, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { schedulePost } from '@/modules/planner/actions/schedule-post';
import { updatePostStatus } from '@/modules/planner/actions/update-post-status';
import { removeScheduledPost } from '@/modules/planner/actions/delete-post';

interface PlannerProject {
  id: string;
  name: string;
}

interface PlannerPost {
  id: string;
  title: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  desiredStatus: 'draft' | 'publish';
  scheduledAt: string | null;
  projectId: string;
  projectName: string;
}

interface CalendarViewProps {
  projects: PlannerProject[];
  posts: PlannerPost[];
}

const statusOptions: Array<PlannerPost['status']> = ['draft', 'scheduled', 'published', 'failed'];

export function CalendarView({ projects, posts }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [scheduledDate, setScheduledDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [desiredStatus, setDesiredStatus] = useState<'draft' | 'publish'>('publish');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const normalizedPosts = useMemo(
    () =>
      posts
        .map((post) => ({
          ...post,
          scheduledAtDate: post.scheduledAt ? new Date(post.scheduledAt) : null,
        }))
        .sort((a, b) => {
          const aTime = a.scheduledAtDate?.valueOf() ?? 0;
          const bTime = b.scheduledAtDate?.valueOf() ?? 0;
          return bTime - aTime;
        }),
    [posts]
  );

  const postsForSelectedDate = useMemo(
    () =>
      normalizedPosts.filter((post) =>
        post.scheduledAtDate && selectedDate ? isSameDay(post.scheduledAtDate, selectedDate) : false
      ),
    [normalizedPosts, selectedDate]
  );

  const postDates = useMemo(
    () =>
      normalizedPosts
        .filter((post) => post.scheduledAtDate)
        .map((post) => post.scheduledAtDate as Date),
    [normalizedPosts]
  );

  const resetForm = () => {
    setTitle('');
    setProjectId(projects[0]?.id ?? '');
    setScheduledDate(format(new Date(), 'yyyy-MM-dd'));
    setScheduledTime('09:00');
    setDesiredStatus('publish');
  };

  const handleCreate = () => {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await schedulePost({
        projectId,
        title,
        scheduledAt: `${scheduledDate}T${scheduledTime}:00`,
        desiredStatus,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      setMessage('Post scheduled successfully.');
      setIsDialogOpen(false);
      resetForm();
    });
  };

  const handleStatusChange = (postId: string, status: PlannerPost['status']) => {
    startTransition(async () => {
      setError(null);
      const result = await updatePostStatus(postId, status);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  const handleDelete = (postId: string) => {
    startTransition(async () => {
      setError(null);
      const result = await removeScheduledPost(postId);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setMessage('Scheduled post removed.');
    });
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-[380px,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Publishing Calendar</CardTitle>
            <CardDescription>Select a date to inspect scheduled items.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ hasPosts: postDates }}
              modifiersClassNames={{
                hasPosts: 'bg-primary/10 text-primary font-semibold',
              }}
              className="rounded-md border"
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule new post</DialogTitle>
                  <DialogDescription>
                    Add a publishing task and choose whether it should publish automatically.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="planner-title">Title</Label>
                    <Input
                      id="planner-title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Announcing our AI workflow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planner-project">Project</Label>
                    <Select value={projectId} onValueChange={setProjectId}>
                      <SelectTrigger id="planner-project">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="planner-date">Date</Label>
                      <Input
                        id="planner-date"
                        type="date"
                        value={scheduledDate}
                        onChange={(event) => setScheduledDate(event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="planner-time">Time</Label>
                      <Input
                        id="planner-time"
                        type="time"
                        value={scheduledTime}
                        onChange={(event) => setScheduledTime(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planner-status">Desired publish behavior</Label>
                    <Select value={desiredStatus} onValueChange={(value) => setDesiredStatus(value as 'draft' | 'publish')}>
                      <SelectTrigger id="planner-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="publish">Auto publish</SelectItem>
                        <SelectItem value="draft">Save as draft only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={isPending || !title || !projectId}>
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Schedule'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? `Posts on ${format(selectedDate, 'PPP')}` : 'Scheduled Posts'}
            </CardTitle>
            <CardDescription>Manage status and publishing decisions from one place.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {postsForSelectedDate.length > 0 ? (
              postsForSelectedDate.map((post) => (
                <Card key={post.id} className="border-border/70 bg-card/60">
                  <CardContent className="flex flex-col gap-3 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {post.projectName} · {post.scheduledAtDate ? format(post.scheduledAtDate, 'PPP p') : 'No date'}
                        </p>
                      </div>
                      <StatusBadge status={post.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={post.status}
                        onValueChange={(value) => handleStatusChange(post.id, value as PlannerPost['status'])}
                      >
                        <SelectTrigger className="w-[170px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No posts scheduled for this date.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

