'use client';

import { useMemo, useState, useTransition } from 'react';
import { Plus, TestTube2, Trash2, Power, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { createProvider } from '@/modules/ai/actions/create-provider';
import { toggleProvider } from '@/modules/ai/actions/toggle-provider';
import { removeProvider } from '@/modules/ai/actions/delete-provider';
import { runProviderTest } from '@/modules/ai/actions/test-provider';
import { updateFallback } from '@/modules/ai/actions/update-fallback';

interface ProviderRecord {
  id: string;
  name: string;
  mode: 'managed' | 'byok';
  baseUrl: string;
  enabled: boolean;
  defaultModelText: string;
  defaultModelImage: string | null;
  capabilities: {
    text: boolean;
    image: boolean;
  };
  lastTestedAt: string | null;
  lastError: string | null;
}

interface FallbackPolicyRecord {
  textChain: string[];
  imageChain: string[];
}

interface ProviderListProps {
  providers: ProviderRecord[];
  fallbackPolicy: FallbackPolicyRecord | null;
  canUseBYOK: boolean;
  canConfigureManaged: boolean;
}

export function ProviderList({
  providers,
  fallbackPolicy,
  canUseBYOK,
  canConfigureManaged,
}: ProviderListProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'managed' | 'byok'>('byok');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
  const [apiKey, setApiKey] = useState('');
  const [defaultModelText, setDefaultModelText] = useState('gpt-4o-mini');
  const [defaultModelImage, setDefaultModelImage] = useState('gpt-image-1');
  const [supportsText, setSupportsText] = useState(true);
  const [supportsImage, setSupportsImage] = useState(false);
  const [textPrimaryId, setTextPrimaryId] = useState(
    fallbackPolicy?.textChain[0] || providers.find((provider) => provider.capabilities.text)?.id || ''
  );
  const [imagePrimaryId, setImagePrimaryId] = useState(
    fallbackPolicy?.imageChain[0] || providers.find((provider) => provider.capabilities.image)?.id || ''
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canCreateAnyProvider = canUseBYOK || canConfigureManaged;

  const textCapableProviders = useMemo(
    () => providers.filter((provider) => provider.capabilities.text && provider.enabled),
    [providers]
  );
  const imageCapableProviders = useMemo(
    () => providers.filter((provider) => provider.capabilities.image && provider.enabled),
    [providers]
  );

  const resetCreateForm = () => {
    setName('');
    setMode('byok');
    setBaseUrl('https://api.openai.com/v1');
    setApiKey('');
    setDefaultModelText('gpt-4o-mini');
    setDefaultModelImage('gpt-image-1');
    setSupportsText(true);
    setSupportsImage(false);
  };

  const handleCreateProvider = () => {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await createProvider({
        name,
        mode,
        baseUrl,
        apiKey: apiKey || undefined,
        defaultModelText,
        defaultModelImage: supportsImage ? defaultModelImage : undefined,
        supportsText,
        supportsImage,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      setMessage('Provider created.');
      setIsCreateOpen(false);
      resetCreateForm();
    });
  };

  const handleToggle = (providerId: string) => {
    startTransition(async () => {
      setError(null);
      const result = await toggleProvider(providerId);
      if (result?.error) {
        setError(result.error);
      } else {
        setMessage('Provider updated.');
      }
    });
  };

  const handleDelete = (providerId: string) => {
    startTransition(async () => {
      setError(null);
      const result = await removeProvider(providerId);
      if (result?.error) {
        setError(result.error);
      } else {
        setMessage('Provider removed.');
      }
    });
  };

  const handleTest = (providerId: string) => {
    startTransition(async () => {
      setError(null);
      const result = await runProviderTest(providerId);
      if (result?.error) {
        setError(result.error);
      } else {
        setMessage(result.message || 'Provider test succeeded.');
      }
    });
  };

  const handleSaveFallback = () => {
    startTransition(async () => {
      setError(null);
      const result = await updateFallback({
        textPrimaryId: textPrimaryId || undefined,
        imagePrimaryId: imagePrimaryId || undefined,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        setMessage('Fallback policy saved.');
      }
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Provider Registry</h2>
          <p className="text-sm text-muted-foreground">
            Manage BYOK and managed endpoints for text/image generation.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canCreateAnyProvider}>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add AI provider</DialogTitle>
              <DialogDescription>
                Register an endpoint and its capability profile for this organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider-name">Name</Label>
                <Input
                  id="provider-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="OpenAI Production"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-mode">Mode</Label>
                <Select value={mode} onValueChange={(value) => setMode(value as 'managed' | 'byok')}>
                  <SelectTrigger id="provider-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {canUseBYOK ? <SelectItem value="byok">BYOK</SelectItem> : null}
                    {canConfigureManaged ? <SelectItem value="managed">Managed</SelectItem> : null}
                  </SelectContent>
                </Select>
                {!canUseBYOK && !canConfigureManaged ? (
                  <p className="text-xs text-muted-foreground">
                    AI provider management is currently unavailable for this account.
                  </p>
                ) : null}
                {!canUseBYOK && mode === 'byok' ? (
                  <p className="text-xs text-muted-foreground">
                    BYOK is available on paid plans.
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-base-url">Base URL</Label>
                <Input
                  id="provider-base-url"
                  value={baseUrl}
                  onChange={(event) => setBaseUrl(event.target.value)}
                  placeholder="https://api.openai.com/v1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-api-key">API Key</Label>
                <Input
                  id="provider-api-key"
                  type="password"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder={mode === 'managed' ? 'Optional for managed endpoints' : 'Required for BYOK'}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="provider-text-model">Default text model</Label>
                  <Input
                    id="provider-text-model"
                    value={defaultModelText}
                    onChange={(event) => setDefaultModelText(event.target.value)}
                    placeholder="gpt-4o-mini"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-image-model">Default image model</Label>
                  <Input
                    id="provider-image-model"
                    value={defaultModelImage}
                    onChange={(event) => setDefaultModelImage(event.target.value)}
                    placeholder="gpt-image-1"
                    disabled={!supportsImage}
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="provider-cap-text">Text generation</Label>
                  <Switch id="provider-cap-text" checked={supportsText} onCheckedChange={setSupportsText} />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="provider-cap-image">Image generation</Label>
                  <Switch
                    id="provider-cap-image"
                    checked={supportsImage}
                    onCheckedChange={setSupportsImage}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateProvider}
                disabled={
                  isPending ||
                  !name ||
                  !baseUrl ||
                  !defaultModelText ||
                  (mode === 'byok' && !canUseBYOK) ||
                  (mode === 'managed' && !canConfigureManaged)
                }
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Provider'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{provider.name}</CardTitle>
                  <CardDescription>{provider.baseUrl}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={provider.enabled ? 'active' : 'disabled'} />
                  <Badge variant="outline">{provider.mode.toUpperCase()}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {provider.capabilities.text ? <Badge variant="outline">Text</Badge> : null}
                {provider.capabilities.image ? <Badge variant="outline">Image</Badge> : null}
                <Badge variant="secondary">Model: {provider.defaultModelText}</Badge>
              </div>

              <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <p>
                  Last test:{' '}
                  {provider.lastTestedAt ? new Date(provider.lastTestedAt).toLocaleString() : 'Not tested'}
                </p>
                <p className="truncate">
                  {provider.lastError ? `Last error: ${provider.lastError}` : 'No recent errors'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleTest(provider.id)}>
                  <TestTube2 className="mr-2 h-4 w-4" />
                  Test
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleToggle(provider.id)}>
                  <Power className="mr-2 h-4 w-4" />
                  {provider.enabled ? 'Disable' : 'Enable'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(provider.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fallback Policy</CardTitle>
          <CardDescription>
            Pick primary providers for text and image; remaining enabled providers are used in fallback order.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="text-primary">Primary text provider</Label>
            <Select value={textPrimaryId} onValueChange={setTextPrimaryId}>
              <SelectTrigger id="text-primary">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {textCapableProviders.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-primary">Primary image provider</Label>
            <Select value={imagePrimaryId} onValueChange={setImagePrimaryId}>
              <SelectTrigger id="image-primary">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {imageCapableProviders.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Button onClick={handleSaveFallback} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save fallback settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
