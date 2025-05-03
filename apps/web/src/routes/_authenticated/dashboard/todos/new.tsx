import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/todos/new')({
  component: RouteComponent,
});

function RouteComponent() {
  // Render
  return <div>Hello "/dashboard/todos/new"!</div>;
}
