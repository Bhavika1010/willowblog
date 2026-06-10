import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().trim().min(1, 'Content is required'),
  excerpt: z.string().trim().optional(),
  coverImage: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional()
});

export const updatePostSchema = z.object({
  title: z.string().trim().min(1).optional(),
  content: z.string().trim().min(1).optional(),
  excerpt: z.string().trim().optional(),
  coverImage: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  isPublished: z.boolean().optional()
});
