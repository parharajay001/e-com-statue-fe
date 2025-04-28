import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Paper, Link } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Button } from '../../components/ui/Button';
import { AsyncThunkError } from '../../types/api';

export const Register = () => {
  const { register, isLoading } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await register(formData);
        showNotification('Registration successful! Please log in.', 'success');
        navigate('/login');
      } catch (error: unknown) {
        const apiError = error as AsyncThunkError;
        showNotification(apiError.message || 'Registration failed. Please try again.', 'error');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <Box className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
      <Paper elevation={3} className='p-8 max-w-md w-full bg-white dark:bg-gray-800'>
        <Typography
          variant='h4'
          component='h1'
          className='text-center mb-6 text-gray-900 dark:text-white'
        >
          Register
        </Typography>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <TextField
            fullWidth
            label='Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            label='Email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label='Password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            fullWidth
            label='Confirm Password'
            name='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <Button type='submit' variant='default' size='lg' className='w-full' disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
          <Typography className='text-center mt-4'>
            Already have an account?{' '}
            <Link href='/login' className='text-blue-500 hover:text-blue-600'>
              Login here
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};
