import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/todos/')({
  component: RouteComponent,
});

function RouteComponent() {
  // Render
  return <div>Hello "/dashboard/todos/"!</div>;
}
