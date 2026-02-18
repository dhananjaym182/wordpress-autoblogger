'use server';

import { db } from '@/lib/db';
import { requireSession } from '@/api/core/auth-context';

export async function exportUserData() {
  const session = await requireSession();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
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

  type Membership = (typeof user.memberships)[number];
  type Project = Membership['organization']['projects'][number];

  return {
    exportInfo: {
      generatedAt: new Date().toISOString(),
      version: '1.0',
      userId: user.id,
    },
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    organizations: user.memberships.map((membership: Membership) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      role: membership.role,
      planId: membership.organization.planId,
      planStatus: membership.organization.planStatus,
      joinedAt: membership.createdAt,
      projects: membership.organization.projects.map((project: Project) => ({
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
}

