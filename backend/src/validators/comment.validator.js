import { z } from 'zod';

export const addCommentSchema = z.object({
  content: z.string().trim().min(1, 'Content is required'),
  parentComment: z.string().trim().optional()
});
