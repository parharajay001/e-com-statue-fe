import { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Block, Check, Edit } from '@mui/icons-material';
import { RootState } from '../../store/store';
import { fetchUsers, updateUserStatus, updateUserRole } from './usersSlice';
import { useNotification } from '../../hooks/useNotification';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxDispatch';
import { AsyncThunkError } from '../../types/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}

export const UserList = () => {
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();
  const { items: users, isLoading } = useAppSelector((state: RootState) => state.users);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleStatusChange = async (userId: string, currentStatus: 'active' | 'inactive') => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await dispatch(updateUserStatus({ id: userId, status: newStatus })).unwrap();
      showNotification('User status updated successfully', 'success');
    } catch (error: unknown) {
      const apiError = error as AsyncThunkError;
      showNotification(apiError.message || 'Failed to update user status', 'error');
    }
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(updateUserRole({ id: selectedUser.id, role: newRole })).unwrap();
      showNotification('User role updated successfully', 'success');
      setUserDialogOpen(false);
    } catch (error: unknown) {
      const apiError = error as AsyncThunkError;
      showNotification(apiError.message || 'Failed to update user role', 'error');
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'admin' ? 'primary' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'active' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div className="flex space-x-2">
          <IconButton
            size="small"
            onClick={() => {
              setSelectedUser(params.row);
              setNewRole(params.row.role);
              setUserDialogOpen(true);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleStatusChange(params.row.id, params.row.status)}
            className={params.row.status === 'active' ? 'text-red-500' : 'text-green-500'}
          >
            {params.row.status === 'active' ? (
              <Block fontSize="small" />
            ) : (
              <Check fontSize="small" />
            )}
          </IconButton>
        </div>
      ),
    },
  ];

  if (isLoading && users.length === 0) {
    return <LoadingState message="Loading users..." />;
  }

  return (
    <>
      <div className="mb-6">
        <Typography variant="h4" className="font-semibold">
          User Management
        </Typography>
      </div>

      <Paper className="h-[calc(100vh-200px)]">
        <DataGrid
          rows={users}
          columns={columns}
          loading={isLoading}
          pagination
          paginationMode="client"
          disableRowSelectionOnClick
          className="border-none"
        />
      </Paper>

      <Dialog
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
      >
        <DialogTitle>Update User Role</DialogTitle>
        <DialogContent className="min-w-[300px]">
          <FormControl fullWidth className="mt-4">
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              label="Role"
              onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outline"
            onClick={() => setUserDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleRoleUpdate}
          >
            Update Role
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};