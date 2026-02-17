import {
  WPCredentials,
  UpsertPostInput,
  UpsertPostResult,
  ImportMediaInput,
  ImportMediaResult,
  EnsureTermsInput,
  EnsureTermsResult,
  WPSiteInfo,
  WordPressError,
  WordPressAuthError,
  WordPressNotFoundError,
} from './types.js';

export class CoreClient {
  private authHeader: string;

  constructor(private credentials: WPCredentials) {
    if (credentials.mode !== 'app_password') {
      throw new Error('CoreClient requires app_password mode credentials');
    }

    const auth = Buffer.from(
      `${credentials.username}:${credentials.appPassword}`
    ).toString('base64');
    this.authHeader = `Basic ${auth}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.credentials.siteUrl}/wp-json/wp/v2${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.authHeader,
        ...options.headers,
      },
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    return response.json();
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

    if (response.status === 404) {
      throw new WordPressNotFoundError('Resource');
    }

    throw new WordPressError(
      errorData.message || `Request failed: ${response.statusText}`,
      errorData.code || 'unknown_error',
      response.status,
      body
    );
  }

  async getSiteInfo(): Promise<WPSiteInfo> {
    const data = await this.request<{
      name: string;
      description: string;
      url: string;
      home: string;
      gmt_offset: number;
      timezone_string: string;
    }>('/');

    return {
      name: data.name,
      description: data.description,
      url: data.url,
      home: data.home,
      gmtOffset: data.gmt_offset,
      timezoneString: data.timezone_string,
    };
  }

  async upsertPost(input: UpsertPostInput): Promise<UpsertPostResult> {
    // First, check if post exists by external ID
    const existingPosts = await this.request<Array<{ id: number; status: string }>>(
      `/posts?meta_key=autoblogger_external_id&meta_value=${input.externalId}`
    );

    const postData = {
      title: input.title,
      content: input.content,
      status: input.status,
      date_gmt: input.dateGmt,
      slug: input.slug,
      categories: input.categories,
      tags: input.tags,
      featured_media: input.featuredMediaId,
      meta: {
        autoblogger_external_id: input.externalId,
        ...(input.seo?.metaTitle && { _yoast_wpseo_title: input.seo.metaTitle }),
        ...(input.seo?.metaDescription && { _yoast_wpseo_metadesc: input.seo.metaDescription }),
        ...(input.seo?.focusKeyword && { _yoast_wpseo_focuskw: input.seo.focusKeyword }),
      },
    };

    let postId: number;
    let status: string;

    if (existingPosts.length > 0) {
      // Update existing post
      const result = await this.request<{ id: number; status: string }>(
        `/posts/${existingPosts[0].id}`,
        {
          method: 'PUT',
          body: postData,
        }
      );
      postId = result.id;
      status = result.status;
    } else {
      // Create new post
      const result = await this.request<{ id: number; status: string }>('/posts', {
        method: 'POST',
        body: postData,
      });
      postId = result.id;
      status = result.status;
    }

    return {
      postId,
      status,
      editUrl: `${this.credentials.siteUrl}/wp-admin/post.php?post=${postId}&action=edit`,
    };
  }

  async importMedia(input: ImportMediaInput): Promise<ImportMediaResult> {
    // Download the file first
    const fileResponse = await fetch(input.sourceUrl);
    if (!fileResponse.ok) {
      throw new WordPressError(
        'Failed to download media from source URL',
        'media_download_error'
      );
    }

    const blob = await fileResponse.blob();
    const formData = new FormData();
    formData.append('file', blob, input.filename);
    formData.append('alt_text', input.alt);

    const response = await fetch(
      `${this.credentials.siteUrl}/wp-json/wp/v2/media`,
      {
        method: 'POST',
        headers: {
          'Authorization': this.authHeader,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      await this.handleError(response);
    }

    const data = await response.json() as { id: number; source_url: string };

    return {
      mediaId: data.id,
      sourceUrl: data.source_url,
      editUrl: `${this.credentials.siteUrl}/wp-admin/upload.php?item=${data.id}`,
    };
  }

  async ensureTerms(input: EnsureTermsInput): Promise<EnsureTermsResult> {
    const categories: Array<{ id: number; name: string; slug: string }> = [];
    const tags: Array<{ id: number; name: string; slug: string }> = [];

    // Process categories
    if (input.categories) {
      for (const name of input.categories) {
        // Try to find existing category
        const existing = await this.request<Array<{ id: number; name: string; slug: string }>>(
          `/categories?search=${encodeURIComponent(name)}`
        );

        if (existing.length > 0) {
          categories.push(existing[0]);
        } else {
          // Create new category
          const created = await this.request<{ id: number; name: string; slug: string }>(
            '/categories',
            {
              method: 'POST',
              body: { name },
            }
          );
          categories.push(created);
        }
      }
    }

    // Process tags
    if (input.tags) {
      for (const name of input.tags) {
        // Try to find existing tag
        const existing = await this.request<Array<{ id: number; name: string; slug: string }>>(
          `/tags?search=${encodeURIComponent(name)}`
        );

        if (existing.length > 0) {
          tags.push(existing[0]);
        } else {
          // Create new tag
          const created = await this.request<{ id: number; name: string; slug: string }>(
            '/tags',
            {
              method: 'POST',
              body: { name },
            }
          );
          tags.push(created);
        }
      }
    }

    return { categories, tags };
  }
}
