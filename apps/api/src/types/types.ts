import type { RequestIdVariables } from 'hono/request-id';
import type { LoggerEnv } from '../middlewares/logger';

export type Bindings = {
  ASSETS: Fetcher;
  ENV: 'development' | 'production';
};

export type Env = {
  Bindings: Bindings;
  Variables: RequestIdVariables;
} & LoggerEnv;