import type { z } from 'zod';
import type * as schemas from './entities.schema';

export type JWT = z.infer<typeof schemas.jwtSchema>;

export type RefreshToken = z.infer<typeof schemas.refreshTokenSchema>;

export type AccessToken = z.infer<typeof schemas.accessTokenSchema>;

export type User = z.infer<typeof schemas.userSchema>;

export type Session = z.infer<typeof schemas.sessionSchema>;

export type Todo = z.infer<typeof schemas.todoSchema>;
