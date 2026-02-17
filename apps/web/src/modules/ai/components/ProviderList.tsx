"use client"

import { useState } from "react"
import { Plus, MoreVertical, TestTube, Trash2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface AIProvider {
  id: string
  name: string
  type: "managed" | "byok"
  capabilities: {
    text: boolean
    image: boolean
  }
  enabled: boolean
  lastTestedAt?: Date
  status?: "ok" | "error"
}

export function ProviderList() {
  const [providers, setProviders] = useState<AIProvider[]>([
    {
      id: "1",
      name: "OpenAI (Managed)",
      type: "managed",
      capabilities: { text: true, image: true },
      enabled: true,
      lastTestedAt: new Date(),
      status: "ok",
    },
    {
      id: "2",
      name: "OpenAI (BYOK)",
      type: "byok",
      capabilities: { text: true, image: true },
      enabled: true,
      lastTestedAt: new Date(Date.now() - 3600000),
      status: "ok",
    },
  ])

  const toggleProvider = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Providers</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      {providers.map((provider) => (
        <Card key={provider.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{provider.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={provider.enabled ? "default" : "secondary"}>
                  {provider.type === "managed" ? "Managed" : "BYOK"}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toggleProvider(provider.id)}>
                      {provider.enabled ? "Disable" : "Enable"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {provider.capabilities.text && (
                  <Badge variant="outline">Text</Badge>
                )}
                {provider.capabilities.image && (
                  <Badge variant="outline">Image</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {provider.status === "ok" && provider.lastTestedAt && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      Tested {new Date(provider.lastTestedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <Button variant="outline" size="sm">
                  <TestTube className="mr-2 h-3 w-3" />
                  Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
