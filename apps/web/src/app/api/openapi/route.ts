import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    openapi: '3.1.0',
    info: {
      title: 'AutoBlogger API',
      version: '1.0.0',
      description: 'Initial OpenAPI scaffold. Expand with concrete endpoint schemas.',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
    ],
    paths: {
      '/api/health': {
        get: {
          summary: 'Health check',
          responses: {
            '200': {
              description: 'Service is healthy',
            },
          },
        },
      },
    },
    components: {},
  });
}

