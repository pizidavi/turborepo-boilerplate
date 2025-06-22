import type { RequestIdVariables } from 'hono/request-id';
import type { z } from 'zod';
import type { LoggerEnv } from '../middlewares/logger';
import type { bindingsVarsSchema } from './schemas';

export type Bindings = {
  //@ts-ignore
  ASSETS: Fetcher;
  //@ts-ignore
  DB: D1Database;
} & z.infer<typeof bindingsVarsSchema>;

export type Env = {
  Bindings: Bindings;
  Variables: RequestIdVariables;
} & LoggerEnv;
