import { z } from 'zod';
import { JWT_TYPE, PERMISSION, ROLE } from './enums';

export const jwtSchema = z.object({
  typ: z.nativeEnum(JWT_TYPE),
  jti: z.string().min(1),
  iss: z.string().min(1),
  iat: z.number(),
  nbf: z.number(),
  exp: z.number().optional(),
  sub: z.string().optional(),
  data: z.record(z.string(), z.any()).optional(),
});

export const refreshTokenSchema = jwtSchema
  .extend({
    typ: z.literal(JWT_TYPE.REFRESH),
    sub: z.coerce.number().positive(),
  })
  .omit({ data: true });

export const accessTokenSchema = jwtSchema.extend({
  typ: z.literal(JWT_TYPE.ACCESS),
  sub: z.coerce.number().positive(),
  data: z.object({
    refreshTokenId: refreshTokenSchema.shape.jti,
    role: z.nativeEnum(ROLE),
    permissions: z.array(z.nativeEnum(PERMISSION)),
  }),
});

export const errorSchema = z.object({
  code: z.string(),
  message: z.string().optional(),
  stack: z.string().optional(),
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email().max(255),
  role: z.nativeEnum(ROLE),
  createdAt: z.number(),
});

export const sessionSchema = z.object({
  id: z.string(),
  userId: userSchema.shape.id,
  name: z.string().optional(),
  createdAt: z.number(),
});

export const todoSchema = z.object({
  id: z.coerce.number(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  completed: z.boolean().default(false),
});
