import type { z } from 'zod';
import type * as schemas from './requests.schema';

export * from './requests.schema';

export type RegisterRequest = z.infer<typeof schemas.registerRequestSchema>;

export type LoginRequest = z.infer<typeof schemas.registerRequestSchema>;
