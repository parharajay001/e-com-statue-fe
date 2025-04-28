import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  AccountCircle,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Keyboard,
} from '@mui/icons-material';
import { logout } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../hooks/useReduxDispatch';

interface TopBarProps {
  darkMode: boolean;
  onThemeToggle: () => void;
  onShowShortcuts: () => void;
}

export const TopBar = ({ darkMode, onThemeToggle, onShowShortcuts }: TopBarProps) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    handleClose();
  };

  return (
    <AppBar 
      position="fixed" 
      className="left-64 w-[calc(100%-256px)]"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar className="justify-between">
        <IconButton
          color="inherit"
          aria-label="menu"
          edge="start"
          className="mr-2 md:hidden"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div">
          Admin Dashboard
        </Typography>

        <div className="flex items-center gap-2">
          <Tooltip title="Keyboard shortcuts (?)">
            <IconButton color="inherit" onClick={onShowShortcuts}>
              <Keyboard />
            </IconButton>
          </Tooltip>

          <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
            <IconButton color="inherit" onClick={onThemeToggle}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};