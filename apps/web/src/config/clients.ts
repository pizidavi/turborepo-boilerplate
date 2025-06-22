import type { AppType } from '@repo/api';
import { Logger } from '@repo/logger';
import { QueryClient } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';
import { hc } from 'hono/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
export const apiClient = hc<AppType>('/api', {
  fetch: (input, init, _, __) =>
    fetch(input, init).then(response => {
      if (!response.ok) {
        if (response.status === 404) throw notFound();
        throw response;
      }

      if (response.headers.get('Content-Type')?.includes('application/json'))
        return response.json();
      return response.text();
    }),
});

export const logger = new Logger({ name: 'global', pretty: import.meta.env.DEV });
