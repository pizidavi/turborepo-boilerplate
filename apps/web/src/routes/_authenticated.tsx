import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import Header from '@/components/navigation/Header';
import { LOCAL_STORAGE_KEYS } from '@/types/enums';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const isAuthenticated = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH);
    if (!isAuthenticated)
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
        replace: true,
        ignoreBlocker: true,
      });
  },
  component: RouteComponent,
});

function RouteComponent() {
  // Render
  return (
    <div className='h-svh overflow-hidden grid grid-rows-[auto_1fr_auto]'>
      <Header />
      <div className='grid md:grid-cols-[auto_1fr] min-h-0'>
        <aside className='fixed md:relative inset-y-0 left-0 w-64 bg-sidebar p-4 flex flex-col gap-4 transform -translate-x-full md:translate-x-0 transition-transform duration-300 z-50 overflow-y-auto md:w-20 lg:w-64 md:shadow-lg'>
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className='flex items-center p-4 aspect-video h-12 w-full rounded-lg bg-muted/50'
            >
              <span>Item {index + 1}</span>
            </div>
          ))}
        </aside>
        <main className='flex flex-1 flex-col p-4 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
