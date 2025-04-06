import type { z } from 'zod';
import type { accessTokenSchema, jwtSchema, refreshTokenSchema, todoSchema } from './schemas';

export type JWT = z.infer<typeof jwtSchema>;

export type RefreshToken = z.infer<typeof refreshTokenSchema>;

export type AccessToken = z.infer<typeof accessTokenSchema>;

export type Todo = z.infer<typeof todoSchema>;
