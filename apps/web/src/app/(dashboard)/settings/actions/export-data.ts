'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function exportUserData() {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        include: {
          organization: {
            include: {
              projects: {
                include: {
                  scheduledPosts: {
                    select: {
                      id: true,
                      title: true,
                      status: true,
                      createdAt: true,
                      updatedAt: true,
                      scheduledAt: true,
                      publishedAt: true,
                    },
                  },
                  contentTemplates: {
                    select: {
                      id: true,
                      name: true,
                      type: true,
                      createdAt: true,
                    },
                  },
                  wpConnection: {
                    select: {
                      siteUrl: true,
                      siteName: true,
                      mode: true,
                      status: true,
                    },
                  },
                },
              },
              aiEndpoints: {
                select: {
                  id: true,
                  name: true,
                  baseUrl: true,
                  defaultModelText: true,
                  enabled: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Sanitize and prepare export data
  const exportData = {
    exportInfo: {
      generatedAt: new Date().toISOString(),
      version: '1.0',
      userId: user.id,
    },
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    organizations: user.memberships.map((membership) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      role: membership.role,
      planId: membership.organization.planId,
      planStatus: membership.organization.planStatus,
      joinedAt: membership.createdAt,
      projects: membership.organization.projects.map((project) => ({
        id: project.id,
        name: project.name,
        slug: project.slug,
        description: project.description,
        contentSettings: project.contentSettings,
        seoSettings: project.seoSettings,
        createdAt: project.createdAt,
        posts: project.scheduledPosts,
        templates: project.contentTemplates,
        wpConnection: project.wpConnection,
      })),
      aiEndpoints: membership.organization.aiEndpoints,
    })),
  };

  return exportData;
}
