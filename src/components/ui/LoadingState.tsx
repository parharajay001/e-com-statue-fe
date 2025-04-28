import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState = ({ 
  message = 'Loading...', 
  fullScreen = false 
}: LoadingStateProps) => {
  const content = (
    <Box className="flex flex-col items-center justify-center space-y-4">
      <CircularProgress />
      <Typography className="text-gray-600 dark:text-gray-400">
        {message}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {content}
      </Box>
    );
  }

  return <Box className="p-8 flex justify-center">{content}</Box>;
};