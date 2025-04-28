import { Grid, Paper, Typography } from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  AttachMoney,
} from '@mui/icons-material';
import { Button } from '../../components/ui/Button';

const StatCard = ({ title, value, icon, trend }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}) => (
  <Paper className="p-4 h-full">
    <div className="flex items-center justify-between">
      <div>
        <Typography className="text-gray-600 dark:text-gray-400" variant="subtitle2">
          {title}
        </Typography>
        <Typography className="text-2xl font-semibold mt-1" variant="h4">
          {value}
        </Typography>
        {trend && (
          <Typography className="text-green-500 flex items-center mt-1" variant="body2">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </Typography>
        )}
      </div>
      <div className="p-2 bg-primary/10 rounded-full">
        {icon}
      </div>
    </div>
  </Paper>
);

export const Dashboard = () => {
  // This would typically come from an API call
  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,680',
      icon: <AttachMoney className="text-primary" />,
      trend: '+12.5%',
    },
    {
      title: 'Total Orders',
      value: '456',
      icon: <ShoppingCart className="text-primary" />,
      trend: '+5.2%',
    },
    {
      title: 'Total Customers',
      value: '2,345',
      icon: <People className="text-primary" />,
      trend: '+3.8%',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" className="font-semibold">
          Dashboard
        </Typography>
        <Button variant="default">
          Download Report
        </Button>
      </div>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Recent Orders
            </Typography>
            {/* Add chart or table component here */}
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
              Chart placeholder
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="p-4 h-full">
            <Typography variant="h6" className="mb-4">
              Recent Activities
            </Typography>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-3 py-2 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <Typography variant="body2">
                      New order received
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      2 hours ago
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};