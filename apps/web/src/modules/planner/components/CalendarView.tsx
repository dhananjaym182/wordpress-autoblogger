"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ScheduledPost {
  id: string
  title: string
  status: "draft" | "scheduled" | "published" | "failed"
  scheduledAt: Date
  desiredStatus: "draft" | "publish"
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [posts] = useState<ScheduledPost[]>([
    {
      id: "1",
      title: "Getting Started with AutoBlogger",
      status: "scheduled",
      scheduledAt: new Date(Date.now() + 86400000),
      desiredStatus: "publish",
    },
    {
      id: "2",
      title: "AI Content Generation Tips",
      status: "draft",
      scheduledAt: new Date(Date.now() + 172800000),
      desiredStatus: "publish",
    },
    {
      id: "3",
      title: "WordPress Integration Guide",
      status: "published",
      scheduledAt: new Date(Date.now() - 86400000),
      desiredStatus: "publish",
    },
    {
      id: "4",
      title: "SEO Best Practices",
      status: "scheduled",
      scheduledAt: new Date(Date.now() + 259200000),
      desiredStatus: "draft",
    },
  ])

  const daysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const days = Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1)

  const startDayOfWeek = firstDayOfMonth(currentDate).getDay()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500"
      case "scheduled":
        return "bg-blue-500"
      case "draft":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Content Calendar</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Post
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="border rounded-lg">
            <div className="grid grid-cols-7 gap-px border-b">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-7 gap-px">
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[100px] p-2 border-r bg-muted/20" />
                ))}
                {days.map((day) => {
                  const post = posts.find((p) => {
                    const postDate = new Date(p.scheduledAt)
                    return (
                      postDate.getDate() === day &&
                      postDate.getMonth() === currentDate.getMonth() &&
                      postDate.getFullYear() === currentDate.getFullYear()
                    )
                  })

                  return (
                    <div key={day} className="min-h-[100px] p-2 border-r border-b">
                      <div className="text-sm font-medium">{day}</div>
                      {post && (
                        <div
                          className="mt-1 flex items-center gap-1 rounded px-1.5 py-1 text-xs text-white cursor-pointer hover:opacity-80"
                          style={{ backgroundColor: getStatusColor(post.status) }}
                        >
                          <div className="truncate max-w-[120px]">{post.title}</div>
                          <Badge variant="outline" className="ml-auto">
                            {post.status}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="flex items-center justify-around pt-4 border-t text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span>Published</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span>Draft</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span>Failed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
