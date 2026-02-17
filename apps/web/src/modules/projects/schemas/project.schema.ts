import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
