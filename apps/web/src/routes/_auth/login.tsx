import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { LoginForm } from '@/components/form/LoginForm';
import { apiClient, logger } from '@/config/clients';
import { LOCAL_STORAGE_KEYS } from '@/types/enums';
import { getDeviceAndBrowserInfo } from '@/utils/utils';

const searchSchema = z.object({
  redirect: z
    .string()
    .optional()
    .transform(v => (v ? new URL(v, location.href).pathname : v)),
});

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
  validateSearch: search => searchSchema.parse(search),
});

function RouteComponent() {
  // Hooks
  const navigate = useNavigate();
  const { redirect: redirectUrl } = Route.useSearch();

  // Methods
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const deviceName = getDeviceAndBrowserInfo();

    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const password = form.get('password');
    if (!email || !password) return;

    apiClient.auth.login
      .$post({
        json: {
          email: email.toString(),
          password: password.toString(),
          deviceName,
        },
      })
      .then(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH, 'true');
        navigate({
          to: redirectUrl ?? '/dashboard',
          replace: true,
        });
      })
      .catch(e => {
        logger.error('Failed to login', { error: e });
      });
  };

  // Render
  return <LoginForm onSubmit={handleSubmit} />;
}
