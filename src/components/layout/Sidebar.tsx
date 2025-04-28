import {
  Dashboard,
  ExpandLess,
  ExpandMore,
  People,
  Settings,
  ShoppingCart,
} from '@mui/icons-material';
import { Collapse, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { JSX, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  title: string;
  path: string;
  icon: JSX.Element;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Dashboard />,
  },
  {
    title: 'Products',
    path: '/products',
    icon: <ShoppingCart />,
    children: [
      { title: 'All Products', path: '/products', icon: <ShoppingCart /> },
      { title: 'Add Product', path: '/products/new', icon: <ShoppingCart /> },
    ],
  },
  {
    title: 'Users',
    path: '/users',
    icon: <People />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Settings />,
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const handleClick = (item: MenuItem) => {
    if (item.children) {
      setOpen((prev) => ({ ...prev, [item.title]: !prev[item.title] }));
    } else {
      navigate(item.path);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.title}>
        <ListItemButton
          onClick={() => handleClick(item)}
          className='hover:bg-gray-100 dark:hover:bg-gray-700'
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
          {hasChildren && (open[item.title] ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        {hasChildren && (
          <Collapse in={open[item.title]} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {item.children!.map((child) => (
                <ListItemButton
                  key={child.title}
                  onClick={() => navigate(child.path)}
                  className='pl-8 hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  <ListItemIcon>{child.icon}</ListItemIcon>
                  <ListItemText primary={child.title} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <Drawer
      variant='permanent'
      className='w-64'
      classes={{
        paper: 'w-64 border-r border-gray-200 dark:border-gray-700',
      }}
    >
      <div className='p-4'>
        <h1 className='text-xl font-bold'>Admin Panel</h1>
      </div>
      <List>{menuItems.map((item) => renderMenuItem(item))}</List>
    </Drawer>
  );
};
