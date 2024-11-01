import { z } from 'zod';

export const todoSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
});
