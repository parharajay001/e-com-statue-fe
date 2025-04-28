import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { RootState } from '../../store/store';
import { fetchProducts, deleteProduct } from './productsSlice';
import { useNotification } from '../../hooks/useNotification';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxDispatch';
import { AsyncThunkError } from '../../types/api';

export const ProductList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { items, isLoading } = useAppSelector((state: RootState) => state.products);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    navigate(`/products/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      showNotification('Product deleted successfully', 'success');
      setDeleteDialogOpen(false);
    } catch (error: unknown) {
      const apiError = error as AsyncThunkError;
      showNotification(apiError.message || 'Failed to delete product', 'error');
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { 
      field: 'price',
      headerName: 'Price',
      flex: 1,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div className="flex space-x-2">
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row.id)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setProductToDelete(params.row.id);
              setDeleteDialogOpen(true);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Delete fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  if (isLoading && items.length === 0) {
    return <LoadingState message="Loading products..." />;
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <Typography variant="h4" className="font-semibold">
          Products
        </Typography>
        <Button
          variant="default"
          onClick={() => navigate('/products/new')}
          className="flex items-center space-x-2"
        >
          <Add className="w-5 h-5" />
          <span>Add Product</span>
        </Button>
      </div>

      <Paper className="h-[calc(100vh-200px)]">
        <DataGrid
          rows={items}
          columns={columns}
          loading={isLoading}
          pagination
          paginationMode="client"
          checkboxSelection
          disableRowSelectionOnClick
          className="border-none"
        />
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (productToDelete) {
                handleDelete(productToDelete);
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};