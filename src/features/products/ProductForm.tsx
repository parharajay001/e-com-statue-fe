import {
  FormControl,
  InputLabel,
  MenuItem,
  Grid,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { useNotification } from '../../hooks/useNotification';
import { useAppDispatch } from '../../hooks/useReduxDispatch';
import { addProduct, updateProduct } from './productsSlice';

export const ProductForm = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch(); // Using typed dispatch
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      showNotification('Loading product details...', 'info');
    }
  }, [id, showNotification]); // Added missing dependency

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = 'Valid price is required';
      isValid = false;
    }

    if (!formData.stock || isNaN(Number(formData.stock))) {
      newErrors.stock = 'Valid stock quantity is required';
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (id) {
        await dispatch(updateProduct({ id, data: productData }));
        showNotification('Product updated successfully', 'success');
      } else {
        await dispatch(addProduct(productData));
        showNotification('Product added successfully', 'success');
      }
      navigate('/products');
    } catch (err) {
      const error = err as Error;
      showNotification(
        error.message || (id ? 'Failed to update product' : 'Failed to add product'),
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitting) {
    return <LoadingState fullScreen message='Saving product...' />;
  }

  return (
    <Paper className='p-6'>
      <Typography variant='h4' className='mb-6'>
        {id ? 'Edit Product' : 'Add New Product'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Product Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type='number'
              label='Price'
              name='price'
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label='Description'
              name='description'
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label='Category'
                name='category'
                onChange={handleChange}
              >
                <MenuItem value='sculptures'>Sculptures</MenuItem>
                <MenuItem value='statues'>Statues</MenuItem>
                <MenuItem value='figurines'>Figurines</MenuItem>
                <MenuItem value='busts'>Busts</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} className='flex justify-end space-x-3'>
            <Button variant='outline' onClick={() => navigate('/products')} type='button'>
              Cancel
            </Button>
            <Button variant='default' type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : id ? 'Update Product' : 'Add Product'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
