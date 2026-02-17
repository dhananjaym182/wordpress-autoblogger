import crypto from 'crypto';
import {
  WPCredentials,
  UpsertPostInput,
  UpsertPostResult,
  ImportMediaInput,
  ImportMediaResult,
  EnsureTermsInput,
  EnsureTermsResult,
  WPSiteInfo,
  WPDiagnostics,
  WordPressError,
  WordPressAuthError,
} from './types.js';

export class PluginClient {
  constructor(private credentials: WPCredentials) {
    if (credentials.mode !== 'plugin') {
      throw new Error('PluginClient requires plugin mode credentials');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.credentials.siteUrl}/wp-json/autoblogger/v1${endpoint}`;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomUUID();

    const signature = this.generateSignature(
      options.method || 'GET',
      endpoint,
      timestamp,
      nonce,
      options.body ? JSON.stringify(options.body) : ''
    );

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-AB-KeyId': this.credentials.keyId!,
        'X-AB-Timestamp': timestamp,
        'X-AB-Nonce': nonce,
        'X-AB-Signature': signature,
        ...options.headers,
      },
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    return response.json();
  }

  private generateSignature(
    method: string,
    path: string,
    timestamp: string,
    nonce: string,
    body: string
  ): string {
    const message = `${method.toUpperCase()}|${path}|${timestamp}|${nonce}|${body}`;
    return crypto
      .createHmac('sha256', this.credentials.secret!)
      .update(message)
      .digest('hex');
  }

  private async handleError(response: Response): Promise<never> {
    const body = await response.text();
    let errorData: { message?: string; code?: string } = {};

    try {
      errorData = JSON.parse(body);
    } catch {
      // Not JSON, use text
    }

    if (response.status === 401) {
      throw new WordPressAuthError(errorData.message || 'Authentication failed');
    }

    throw new WordPressError(
      errorData.message || `Request failed: ${response.statusText}`,
      errorData.code || 'unknown_error',
      response.status,
      body
    );
  }

  async ping(): Promise<{ status: string; timestamp: number }> {
    return this.request('/ping');
  }

  async getSiteInfo(): Promise<WPSiteInfo> {
    return this.request('/site-info');
  }

  async upsertPost(input: UpsertPostInput): Promise<UpsertPostResult> {
    return this.request('/posts/upsert', {
      method: 'POST',
      body: input,
    });
  }

  async importMedia(input: ImportMediaInput): Promise<ImportMediaResult> {
    return this.request('/media/import', {
      method: 'POST',
      body: input,
    });
  }

  async ensureTerms(input: EnsureTermsInput): Promise<EnsureTermsResult> {
    return this.request('/terms/ensure', {
      method: 'POST',
      body: input,
    });
  }

  async getDiagnostics(): Promise<WPDiagnostics> {
    return this.request('/diagnostics');
  }
}
