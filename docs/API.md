# AutoBlogger API Documentation

## Overview

The AutoBlogger API allows you to programmatically manage your content, projects, and WordPress connections.

## Base URL

```
Production: https://api.autoblogger.com
Development: http://localhost:3000
```

## Authentication

All API requests require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your-api-token>
```

To obtain an API token, go to your account settings and generate a new API key.

## Rate Limiting

API requests are rate-limited based on your plan:

| Plan | Requests per minute |
|------|---------------------|
| Free | 60 |
| Starter | 300 |
| Pro | 1000 |

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1640995200
```

## Endpoints

### Projects

#### List Projects

```http
GET /api/v1/projects
```

Returns a list of all projects in your organization.

**Response:**
```json
{
  "data": [
    {
      "id": "proj_abc123",
      "name": "Tech Blog",
      "slug": "tech-blog",
      "description": "Technology and programming articles",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### Create Project

```http
POST /api/v1/projects
```

Create a new project.

**Request Body:**
```json
{
  "name": "My Blog",
  "description": "Description of the blog"
}
```

**Response:**
```json
{
  "id": "proj_def456",
  "name": "My Blog",
  "slug": "my-blog",
  "description": "Description of the blog",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Posts

#### List Posts

```http
GET /api/v1/projects/{projectId}/posts
```

Query parameters:
- `status` - Filter by status (draft, scheduled, published, failed)
- `limit` - Number of results per page (default: 20, max: 100)
- `offset` - Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "post_xyz789",
      "title": "Getting Started with AutoBlogger",
      "status": "published",
      "scheduledAt": "2024-01-15T10:00:00Z",
      "publishedAt": "2024-01-15T10:00:00Z",
      "wpPostId": 123,
      "wpEditUrl": "https://example.com/wp-admin/post.php?post=123&action=edit"
    }
  ],
  "total": 1
}
```

#### Create Post

```http
POST /api/v1/projects/{projectId}/posts
```

**Request Body:**
```json
{
  "title": "My New Post",
  "markdown": "## Introduction\n\nThis is my post content.",
  "categories": ["Technology", "Tutorial"],
  "tags": ["beginner", "guide"],
  "metaTitle": "My New Post - SEO Title",
  "metaDescription": "A description for SEO purposes",
  "focusKeyword": "new post"
}
```

#### Schedule Post

```http
POST /api/v1/projects/{projectId}/posts/{postId}/schedule
```

**Request Body:**
```json
{
  "scheduledAt": "2024-02-01T10:00:00Z",
  "status": "publish"
}
```

### AI Content Generation

#### Generate Content

```http
POST /api/v1/generate
```

**Request Body:**
```json
{
  "topic": "Introduction to TypeScript",
  "tone": "professional",
  "targetAudience": "Software developers",
  "wordCount": 1000,
  "focusKeyword": "TypeScript tutorial"
}
```

**Response:**
```json
{
  "markdown": "## Introduction to TypeScript\n\nTypeScript is...",
  "gutenbergHtml": "<!-- wp:heading -->\n<h2>Introduction to TypeScript</h2>\n<!-- /wp:heading -->",
  "title": "Introduction to TypeScript: A Complete Guide",
  "wordCount": 1050,
  "seoScore": 85,
  "readabilityScore": 72
}
```

## Webhooks

AutoBlogger can send webhook notifications when certain events occur.

### Configuration

Configure your webhook URL in your organization settings.

### Events

| Event | Description |
|-------|-------------|
| `post.published` | Triggered when a post is successfully published |
| `post.failed` | Triggered when a post fails to publish |
| `post.scheduled` | Triggered when a post is scheduled |
| `content.generated` | Triggered when AI content generation completes |
| `subscription.updated` | Triggered when subscription plan changes |

### Webhook Payload

```json
{
  "event": "post.published",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "postId": "post_xyz789",
    "title": "My Blog Post",
    "wpPostId": 123,
    "wpEditUrl": "https://example.com/wp-admin/post.php?post=123&action=edit",
    "wpPublicUrl": "https://example.com/my-blog-post",
    "projectId": "proj_abc123",
    "organizationId": "org_xyz789"
  },
  "signature": "sha256=abc123..."
}
```

### Verifying Webhooks

Verify webhook signatures using your webhook secret:

```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = 'sha256=' + 
    crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `unauthorized` | Invalid or missing authentication |
| `forbidden` | Insufficient permissions |
| `not_found` | Resource not found |
| `rate_limited` | Rate limit exceeded |
| `validation_error` | Invalid request data |
| `plan_limit_exceeded` | Plan limit reached |
| `wp_connection_error` | WordPress connection failed |
| `ai_generation_failed` | AI content generation failed |

## SDKs

### JavaScript/TypeScript

```bash
npm install @autoblogger/sdk
```

```typescript
import { AutoBloggerClient } from '@autoblogger/sdk';

const client = new AutoBloggerClient({
  apiKey: 'your-api-key',
});

// Create a project
const project = await client.projects.create({
  name: 'My Blog',
  description: 'Technology blog',
});

// Generate content
const content = await client.generate({
  topic: 'Introduction to React',
  tone: 'professional',
  wordCount: 1000,
});

// Schedule a post
await client.posts.schedule({
  projectId: project.id,
  title: content.title,
  markdown: content.markdown,
  scheduledAt: new Date('2024-02-01T10:00:00Z'),
});
```

### Python

```bash
pip install autoblogger
```

```python
from autoblogger import Client

client = Client(api_key='your-api-key')

# Create a project
project = client.projects.create(
    name='My Blog',
    description='Technology blog'
)

# Generate content
content = client.generate(
    topic='Introduction to Python',
    tone='professional',
    word_count=1000
)

# Schedule a post
client.posts.schedule(
    project_id=project.id,
    title=content.title,
    markdown=content.markdown,
    scheduled_at='2024-02-01T10:00:00Z'
)
```

## Support

For API support, contact us at:
- Email: api@autoblogger.com
- Documentation: https://docs.autoblogger.com
- Status: https://status.autoblogger.com
