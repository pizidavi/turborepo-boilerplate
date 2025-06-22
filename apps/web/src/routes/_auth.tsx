import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { GalleryVerticalEnd } from 'lucide-react';
import { APP_NAME } from '@/config/constants';

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
});

function RouteComponent() {
  // Render
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <Link to='/' className='flex items-center gap-2 font-medium'>
            <GalleryVerticalEnd className='size-4' />
            {APP_NAME}
          </Link>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <Outlet />
          </div>
        </div>
      </div>
      <div className='relative hidden bg-muted lg:block'>
        <img
          src='/placeholder.svg'
          alt='A beautiful background of a natural scenery, used as a placeholder.'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
    </div>
  );
}
