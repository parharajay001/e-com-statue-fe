import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Paper, Typography, TextField, Switch, FormControlLabel, Divider } from '@mui/material';
import { RootState } from '../../store/store';
import { useTheme } from '../../hooks/useTheme';
import { useNotification } from '../../hooks/useNotification';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { Grid as MuiGrid } from '@mui/material';
import { AsyncThunkError } from '../../types/api';

// Rename Grid to avoid type conflicts
const Grid = MuiGrid;

export const Settings = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { darkMode, toggleTheme } = useTheme();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      showNotification('Profile updated successfully', 'success');
    } catch (error: unknown) {
      const apiError = error as AsyncThunkError;
      showNotification(apiError.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileData.newPassword !== profileData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      showNotification('Password updated successfully', 'success');
      setProfileData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: unknown) {
      const apiError = error as AsyncThunkError;
      showNotification(apiError.message || 'Failed to update password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState message='Saving changes...' />;
  }

  return (
    <div className='p-6'>
      <Typography variant='h4' className='mb-6'>
        Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className='p-4'>
            <Typography variant='h6' className='mb-4'>
              Theme Settings
            </Typography>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={toggleTheme} color='primary' />}
              label='Dark Mode'
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className='p-4'>
            <Typography variant='h6' className='mb-4'>
              Notification Settings
            </Typography>
            <form onSubmit={handleProfileUpdate} className='space-y-4'>
              <TextField
                fullWidth
                label='Name'
                value={profileData.name}
                onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
              />
              <TextField
                fullWidth
                label='Email'
                type='email'
                value={profileData.email}
                onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
              />
              <Button type='submit' variant='default'>
                Update Profile
              </Button>
            </form>

            <Divider className='my-6' />

            <Typography variant='h6' className='mb-4'>
              Change Password
            </Typography>
            <form onSubmit={handlePasswordChange} className='space-y-4'>
              <TextField
                fullWidth
                label='Current Password'
                type='password'
                value={profileData.currentPassword}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
              />
              <TextField
                fullWidth
                label='New Password'
                type='password'
                value={profileData.newPassword}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, newPassword: e.target.value }))
                }
              />
              <TextField
                fullWidth
                label='Confirm New Password'
                type='password'
                value={profileData.confirmPassword}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
              />
              <Button type='submit' variant='default'>
                Change Password
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
