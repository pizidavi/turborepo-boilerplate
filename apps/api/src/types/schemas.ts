import { z } from 'zod';

export const bindingsVarsSchema = z.object({
  ENV: z.enum(['development', 'preview', 'production']),
  JWT_SECRET: z.string().min(14).max(255),
});
