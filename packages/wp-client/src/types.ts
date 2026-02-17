export interface WPCredentials {
  siteUrl: string;
  mode: 'plugin' | 'app_password';
  // Plugin mode
  keyId?: string;
  secret?: string;
  // App password mode
  username?: string;
  appPassword?: string;
}

export interface UpsertPostInput {
  externalId: string;
  title: string;
  content: string; // Gutenberg HTML
  status: 'draft' | 'publish' | 'future' | 'pending' | 'private';
  dateGmt?: string; // ISO 8601 date
  slug?: string;
  categories?: string[];
  tags?: string[];
  featuredMediaId?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
  };
}

export interface UpsertPostResult {
  postId: number;
  status: string;
  editUrl: string;
  publicUrl?: string;
}

export interface ImportMediaInput {
  sourceUrl: string;
  filename: string;
  alt: string;
}

export interface ImportMediaResult {
  mediaId: number;
  sourceUrl: string;
  editUrl: string;
}

export interface EnsureTermsInput {
  categories?: string[];
  tags?: string[];
}

export interface EnsureTermsResult {
  categories: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
}

export interface WPSiteInfo {
  name: string;
  description: string;
  url: string;
  home: string;
  gmtOffset: number;
  timezoneString: string;
}

export interface WPCapabilities {
  posts: boolean;
  media: boolean;
  terms: boolean;
  seoMeta: boolean;
}

export interface WPDiagnostics {
  wpVersion: string;
  activeTheme: string;
  detectedPlugins: {
    yoast?: boolean;
    rankmath?: boolean;
    aioSEO?: boolean;
    wordfence?: boolean;
    sucuri?: boolean;
  };
  restOk: boolean;
  capabilities: WPCapabilities;
}

export class WordPressError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly response?: unknown
  ) {
    super(message);
    this.name = 'WordPressError';
  }
}

export class WordPressAuthError extends WordPressError {
  constructor(message: string) {
    super(message, 'auth_error', 401);
    this.name = 'WordPressAuthError';
  }
}

export class WordPressNotFoundError extends WordPressError {
  constructor(resource: string) {
    super(`${resource} not found`, 'not_found', 404);
    this.name = 'WordPressNotFoundError';
  }
}
