import { Button } from '@repo/web-ui';
import { createFileRoute, Link } from '@tanstack/react-router';
import { APP_NAME } from '@/config/constants';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  // Render
  return (
    <div className='min-h-svh flex flex-col items-center justify-center gap-y-4'>
      <h1 className='text-3xl font-bold text-center'>
        Welcome to <span className='text-nowrap text-[120%]'>{APP_NAME}</span>
      </h1>
      <Link to='/dashboard'>
        <Button>Go to dashboard</Button>
      </Link>
    </div>
  );
}
