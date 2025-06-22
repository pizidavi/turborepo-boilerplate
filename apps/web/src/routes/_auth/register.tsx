import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RegistrationForm } from '@/components/form/RegistrationForm';
import { apiClient, logger } from '@/config/clients';

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  // Methods
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const password = form.get('password');
    if (!email || !password) return;

    apiClient.auth.register
      .$post({
        json: {
          email: email.toString(),
          password: password.toString(),
        },
      })
      .then(() => {
        navigate({
          to: '/login',
          replace: true,
        });
      })
      .catch(e => {
        logger.error('Failed to login', { error: e });
      });
  };

  // Render
  return <RegistrationForm onSubmit={handleSubmit} />;
}
