import { APP_NAME } from '@/config/constants';
import { Button } from '@repo/web-ui';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  // Render
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-y-4'>
      <h1 className='text-3xl font-bold'>Welcome to {APP_NAME}</h1>
      <Link to='/dashboard'>
        <Button>Go to dashboard</Button>
      </Link>
    </div>
  );
}
