import type { RequestIdVariables } from 'hono/request-id';
import type { LoggerEnv } from '../middlewares/logger';

export type Bindings = {
  //@ts-ignore
  ASSETS: Fetcher;
  //@ts-ignore
  DB: D1Database;
  ENV: 'development' | 'production';
  JWT_SECRET: string;
};

export type Env = {
  Bindings: Bindings;
  Variables: RequestIdVariables;
} & LoggerEnv;
