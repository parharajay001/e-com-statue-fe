import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, Typography, Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Keyboard } from '@mui/icons-material';
import { lightTheme, darkTheme } from '../../theme/theme';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useTheme } from '../../hooks/useTheme';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { Button } from '../ui/Button';

const ShortcutItem = ({ shortcut, description }: { shortcut: string; description: string }) => (
  <Grid container spacing={2} className="py-1">
    <Grid xs={4}>
      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{shortcut}</code>
    </Grid>
    <Grid xs={8}>
      <Typography>{description}</Typography>
    </Grid>
  </Grid>
);

export const MainLayout = () => {
  const { darkMode } = useTheme();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const handleShowShortcuts = useCallback(() => {
    setShortcutsOpen(true);
  }, []);

  // Initialize keyboard shortcuts with callback
  useKeyboardShortcuts({ onShowShortcuts: handleShowShortcuts });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1">
          <TopBar 
            darkMode={darkMode}
            onThemeToggle={() => {}} // This will be handled by the useTheme hook
            onShowShortcuts={handleShowShortcuts}
          />
          <main className="p-4 mt-16 ml-64">
            <Outlet />
          </main>
        </div>
      </div>

      <Dialog
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center gap-2">
          <Keyboard />
          Keyboard Shortcuts
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <ShortcutItem shortcut="Ctrl/⌘ + D" description="Go to Dashboard" />
            <ShortcutItem shortcut="Ctrl/⌘ + P" description="Go to Products" />
            <ShortcutItem shortcut="Ctrl/⌘ + U" description="Go to Users" />
            <ShortcutItem shortcut="Ctrl/⌘ + S" description="Go to Settings" />
            <ShortcutItem shortcut="Ctrl/⌘ + N" description="Add New (in Products)" />
            <ShortcutItem shortcut="?" description="Show this help dialog" />
          </div>
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShortcutsOpen(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};