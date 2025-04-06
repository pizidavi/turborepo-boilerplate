import { z } from 'zod';
import { JWT_TYPE, PERMISSION, ROLE } from './enums';

export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
});

export const loginSchema = z.object({
  username: z.string().min(3).max(255),
  password: z.string().min(8).max(255),
  remember: z.boolean().optional(),
  deviceName: z.string().min(1).max(255).optional(),
});

export const jwtSchema = z.object({
  typ: z.nativeEnum(JWT_TYPE),
  jti: z.string(),
  iss: z.string(),
  iat: z.number(),
  nbf: z.number(),
  exp: z.number().optional(),
  sub: z.string().optional(),
  data: z.record(z.string(), z.any()).optional(),
});

export const refreshTokenSchema = jwtSchema
  .extend({
    typ: z.literal(JWT_TYPE.REFRESH),
    sub: z.string(),
  })
  .omit({ data: true });

export const accessTokenSchema = jwtSchema.extend({
  typ: z.literal(JWT_TYPE.ACCESS),
  sub: z.string(),
  data: z.object({
    refreshTokenId: z.string(),
    role: z.nativeEnum(ROLE),
    permissions: z.array(z.nativeEnum(PERMISSION)),
  }),
});

export const todoSchema = z.object({
  id: z.coerce.number(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  completed: z.boolean().default(false),
});
