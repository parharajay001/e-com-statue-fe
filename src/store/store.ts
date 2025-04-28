import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authSlice } from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    products: productsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;