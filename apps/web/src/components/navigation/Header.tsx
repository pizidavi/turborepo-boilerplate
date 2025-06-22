import { useNavigate } from '@tanstack/react-router';
import { apiClient, logger } from '@/config/clients';
import { LOCAL_STORAGE_KEYS } from '@/types/enums';

export default function Header() {
  // Hooks
  const navigate = useNavigate();

  // Methods
  const handleLogout = () => {
    apiClient.auth.logout
      .$post()
      .then(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH);
        navigate({
          to: '/',
          ignoreBlocker: true,
        });
      })
      .catch(e => {
        logger.error('Failed to logout', { error: e });
      });
  };

  // Render
  return (
    <header>
      <nav className='bg-sidebar text-white p-4 shadow-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <span className='text-xl font-bold'>Logo</span>
          </div>
          <div className='flex items-center gap-x-4'>
            <button
              type='button'
              onClick={handleLogout}
              className='hover:text-sidebar-primary-foreground cursor-pointer'
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
