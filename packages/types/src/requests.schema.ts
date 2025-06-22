import { z } from 'zod';

export const registerRequestSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
});

export const loginRequestSchema = z.object({
  email: registerRequestSchema.shape.email,
  password: registerRequestSchema.shape.password,
  remember: z.boolean().optional(),
  deviceName: z.string().min(1).max(255).optional(),
});
