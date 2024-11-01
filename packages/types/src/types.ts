import type { z } from 'zod';
import type { todoSchema } from './schemas';

export type Todo = z.infer<typeof todoSchema>;
