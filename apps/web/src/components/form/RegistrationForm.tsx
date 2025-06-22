import { Button, Input, Label } from '@repo/web-ui';
import { Link } from '@tanstack/react-router';
import { useId } from 'react';
import { cn } from '@/utils/utils';

export function RegistrationForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  // Hooks
  const emailFieldId = useId();
  const passwordFieldId = useId();
  const confirmPasswordFieldId = useId();

  // Render
  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Register</h1>
        <p className='text-balance text-sm text-muted-foreground'>
          Enter your information below to register
        </p>
      </div>
      <div className='grid gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor={emailFieldId}>Email</Label>
          <Input id={emailFieldId} name='email' type='email' placeholder='m@example.com' required />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor={passwordFieldId}>Password</Label>
          <Input id={passwordFieldId} name='password' type='password' required />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor={confirmPasswordFieldId}>Confirm password</Label>
          <Input id={confirmPasswordFieldId} name='confirm-password' type='password' required />
        </div>
        <Button type='submit' className='w-full'>
          Register
        </Button>
      </div>
      <p className='text-center text-sm'>
        Already have an account?{' '}
        <Link to='/login' className='underline underline-offset-4'>
          Sign in
        </Link>
      </p>
    </form>
  );
}
