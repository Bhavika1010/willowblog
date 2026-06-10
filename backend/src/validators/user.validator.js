import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).optional(),
  bio: z.string().trim().optional(),
  avatar: z.string().trim().optional()
});

export const followTopicSchema = z.object({
  topic: z.string().trim().min(1, 'Topic is required')
});
