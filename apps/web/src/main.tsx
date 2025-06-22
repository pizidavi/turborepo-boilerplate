import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { queryClient } from './config/clients.ts';
import { routeTree } from './routeTree.gen';
import './styles.css';

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 5_000,
  defaultErrorComponent: () => <h1>Something went wrong</h1>,
  defaultNotFoundComponent: () => <h1>Not found</h1>,
  defaultPendingComponent: () => <h1>Loading...</h1>,
  defaultPendingMinMs: 500,
  defaultPendingMs: 500,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

// biome-ignore lint/style/noNonNullAssertion: root element
ReactDOM.createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
);
