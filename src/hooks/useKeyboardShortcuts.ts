import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

type ShortcutsHandler = {
  onShowShortcuts?: () => void;
};

export const useKeyboardShortcuts = ({ onShowShortcuts }: ShortcutsHandler = {}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isAuthenticated) return;

      // Handle question mark shortcut
      if (event.key === '?' && onShowShortcuts) {
        event.preventDefault();
        onShowShortcuts();
        return;
      }

      // Only trigger if Ctrl/Cmd + key is pressed
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'd':
            event.preventDefault();
            navigate('/dashboard');
            break;
          case 'p':
            event.preventDefault();
            navigate('/products');
            break;
          case 'u':
            event.preventDefault();
            navigate('/users');
            break;
          case 's':
            event.preventDefault();
            navigate('/settings');
            break;
          case 'n':
            event.preventDefault();
            if (window.location.pathname === '/products') {
              navigate('/products/new');
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, isAuthenticated, onShowShortcuts]);
};