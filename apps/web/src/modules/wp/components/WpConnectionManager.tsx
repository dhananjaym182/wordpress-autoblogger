'use client';

import { useEffect, useState, useTransition } from 'react';
import { AlertCircle, Link2, RefreshCcw, Unlink2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { connectPlugin } from '../actions/connect-plugin';
import { connectFallback } from '../actions/connect-fallback';
import { testConnection } from '../actions/test-connection';
import { disconnectConnection } from '../actions/disconnect';

interface ConnectionData {
  id?: string;
  siteUrl?: string | null;
  mode?: string | null;
  status?: string | null;
  lastError?: string | null;
  lastCheckedAt?: string | null;
  keyId?: string | null;
  wpUsername?: string | null;
}

interface WpConnectionManagerProps {
  projectId: string;
  connection?: ConnectionData | null;
}

const statusVariant = (status?: string | null) => {
  if (status === 'ok') return 'default';
  if (status === 'error') return 'destructive';
  return 'secondary';
};

export function WpConnectionManager({ projectId, connection }: WpConnectionManagerProps) {
  const router = useRouter();
  const [siteUrl, setSiteUrl] = useState(connection?.siteUrl ?? '');
  const [keyId, setKeyId] = useState(connection?.keyId ?? '');
  const [secret, setSecret] = useState('');
  const [username, setUsername] = useState(connection?.wpUsername ?? '');
  const [appPassword, setAppPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSiteUrl(connection?.siteUrl ?? '');
    setKeyId(connection?.keyId ?? '');
    setUsername(connection?.wpUsername ?? '');
  }, [connection?.id, connection?.siteUrl, connection?.keyId, connection?.wpUsername]);

  const handlePluginConnect = () => {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await connectPlugin({
        projectId,
        siteUrl,
        keyId,
        secret,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setMessage('Plugin connection saved. Run a connection test to verify.');
      setSecret('');
      router.refresh();
    });
  };

  const handleFallbackConnect = () => {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await connectFallback({
        projectId,
        siteUrl,
        username,
        appPassword,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setMessage('Application password saved. Run a connection test to verify.');
      setAppPassword('');
      router.refresh();
    });
  };

  const handleTest = () => {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await testConnection(projectId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage('Connection test succeeded.');
      router.refresh();
    });
  };

  const handleDisconnect = () => {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await disconnectConnection(projectId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage('Connection removed.');
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Connection Status
          </CardTitle>
          <CardDescription>Monitor the status of your WordPress connection.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={statusVariant(connection?.status)}>
              {connection?.status ?? 'not connected'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Mode</span>
            <span className="text-sm font-medium">
              {connection?.mode === 'plugin'
                ? 'Plugin (HMAC)'
                : connection?.mode === 'app_password'
                ? 'Application Password'
                : 'Not set'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Checked</span>
            <span className="text-sm font-medium">
              {connection?.lastCheckedAt
                ? new Date(connection.lastCheckedAt).toLocaleString()
                : 'Not tested'}
            </span>
          </div>
          {connection?.lastError && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
              <span>{connection.lastError}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleTest} disabled={isPending || !connection?.id}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Test Connection
            </Button>
            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={isPending || !connection?.id}
            >
              <Unlink2 className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connect WordPress</CardTitle>
          <CardDescription>
            Choose a connection mode and follow the setup instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue={connection?.mode === 'app_password' ? 'app_password' : 'plugin'}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="plugin">Plugin Pairing</TabsTrigger>
              <TabsTrigger value="app_password">Username + App Password</TabsTrigger>
            </TabsList>

            <TabsContent value="plugin" className="space-y-4 pt-4">
              <Accordion type="single" collapsible className="w-full rounded-lg border px-4">
                <AccordionItem value="plugin-steps">
                  <AccordionTrigger>Plugin setup instructions</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm text-muted-foreground">
                    <p>1) Install and activate the AutoBlogger Integration plugin on your WordPress site.</p>
                    <p>2) Open plugin settings in WordPress and generate a Key ID + Shared Secret.</p>
                    <p>3) Paste the credentials below and save the connection.</p>
                    <p>4) Run “Test Connection” to confirm secure API access.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="space-y-2">
                <Label htmlFor="plugin-site-url">WordPress Site URL</Label>
                <Input
                  id="plugin-site-url"
                  placeholder="https://yourblog.com"
                  value={siteUrl}
                  onChange={(event) => setSiteUrl(event.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="plugin-key-id">Key ID</Label>
                  <Input
                    id="plugin-key-id"
                    placeholder="Provided by plugin"
                    value={keyId}
                    onChange={(event) => setKeyId(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plugin-secret">Shared Secret</Label>
                  <Input
                    id="plugin-secret"
                    type="password"
                    placeholder="Paste secret from WordPress"
                    value={secret}
                    onChange={(event) => setSecret(event.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={handlePluginConnect}
                disabled={isPending || !siteUrl.trim() || !keyId.trim() || !secret.trim()}
              >
                Save Plugin Connection
              </Button>
            </TabsContent>

            <TabsContent value="app_password" className="space-y-4 pt-4">
              <Accordion type="single" collapsible className="w-full rounded-lg border px-4">
                <AccordionItem value="fallback-steps">
                  <AccordionTrigger>Application password instructions</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm text-muted-foreground">
                    <p>1) In WordPress admin, open Users → Profile.</p>
                    <p>2) Create a new Application Password for AutoBlogger.</p>
                    <p>3) Copy the generated password and paste it below with your username.</p>
                    <p>4) Save and run “Test Connection”.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="space-y-2">
                <Label htmlFor="fallback-site-url">WordPress Site URL</Label>
                <Input
                  id="fallback-site-url"
                  placeholder="https://yourblog.com"
                  value={siteUrl}
                  onChange={(event) => setSiteUrl(event.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wp-username">WordPress Username</Label>
                  <Input
                    id="wp-username"
                    placeholder="admin"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wp-app-password">Application Password</Label>
                  <Input
                    id="wp-app-password"
                    type="password"
                    placeholder="xxxx xxxx xxxx"
                    value={appPassword}
                    onChange={(event) => setAppPassword(event.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleFallbackConnect}
                disabled={isPending || !siteUrl.trim() || !username.trim() || !appPassword.trim()}
              >
                Save App Password
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
