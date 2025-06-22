import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  // Render
  return (
    <div className='flex flex-col gap-4'>
      <div>Hello "/dashboard/"!</div>
      {Array.from({ length: 24 }).map((_, index) => (
        <div
          key={index}
          className='flex items-center p-4 aspect-video h-12 w-full rounded-lg bg-muted/50'
        >
          <span>Item {index + 1}</span>
        </div>
      ))}
    </div>
  );
}
