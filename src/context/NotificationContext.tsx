import { createContext, useState } from 'react';
import { Toast } from '../components/ui/Toast';

export type NotificationSeverity = 'success' | 'error' | 'info' | 'warning';

export interface NotificationContextType {
  showNotification: (message: string, severity: NotificationSeverity) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<NotificationSeverity>('info');

  const showNotification = (msg: string, sev: NotificationSeverity) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Toast
        open={open}
        message={message}
        severity={severity}
        onClose={() => setOpen(false)}
      />
    </NotificationContext.Provider>
  );
};