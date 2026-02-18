import { PluginClient } from './plugin-client.js';
import { CoreClient } from './core-client.js';
import { WPCredentials, UpsertPostInput, UpsertPostResult, ImportMediaInput, ImportMediaResult, EnsureTermsInput, EnsureTermsResult, WPSiteInfo, WPDiagnostics } from './types.js';

/**
 * Auto-detects the best WordPress client based on available credentials.
 * Prefers plugin mode (HMAC) over application password mode.
 */
export class AutoClient {
  private client: PluginClient | CoreClient;
  private credentials: WPCredentials;

  constructor(credentials: WPCredentials) {
    this.credentials = credentials;
    
    if (credentials.mode === 'plugin' && credentials.keyId && credentials.secret) {
      this.client = new PluginClient(credentials);
    } else if (credentials.mode === 'app_password' && credentials.username && credentials.appPassword) {
      this.client = new CoreClient(credentials);
    } else {
      throw new Error('Invalid credentials: must provide either plugin credentials (keyId + secret) or app password credentials (username + appPassword)');
    }
  }

  get mode(): string {
    return this.credentials.mode;
  }

  async ping(): Promise<{ status: string; timestamp: number }> {
    if (this.client instanceof PluginClient) {
      return this.client.ping();
    }
    // Core client doesn't have a ping endpoint, so we use site info
    await this.client.getSiteInfo();
    return { status: 'ok', timestamp: Date.now() };
  }

  async getSiteInfo(): Promise<WPSiteInfo> {
    return this.client.getSiteInfo();
  }

  async upsertPost(input: UpsertPostInput): Promise<UpsertPostResult> {
    return this.client.upsertPost(input);
  }

  async importMedia(input: ImportMediaInput): Promise<ImportMediaResult> {
    return this.client.importMedia(input);
  }

  async ensureTerms(input: EnsureTermsInput): Promise<EnsureTermsResult> {
    return this.client.ensureTerms(input);
  }

  async getDiagnostics(): Promise<WPDiagnostics | null> {
    if (this.client instanceof PluginClient) {
      return this.client.getDiagnostics();
    }
    // Core client doesn't have diagnostics endpoint
    return null;
  }
}
