import type { AppType } from '@/api';
import { Logger } from '@repo/logger';
import { hc } from 'hono/client';

export const client = hc<AppType>('/api');

export const logger = new Logger({ name: 'global', pretty: import.meta.env.DEV });
