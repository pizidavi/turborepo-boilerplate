import { cn } from '@/utils/utils';
import { Button, Input, Label } from '@repo/web-ui';
import { Link } from '@tanstack/react-router';

export function RegistrationForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
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
          <Label htmlFor='email'>Email</Label>
          <Input id='email' name='email' type='email' placeholder='m@example.com' required />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' name='password' type='password' required />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='confirm-password'>Confirm password</Label>
          <Input id='confirm-password' name='confirm-password' type='password' required />
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
