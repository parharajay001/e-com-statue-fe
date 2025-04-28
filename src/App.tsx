import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { AuthGuard } from './features/auth/AuthGuard';
import { NotificationProvider } from './context/NotificationContext';
import { Dashboard } from './features/dashboard/Dashboard';
import { ProductList } from './features/products/ProductList';
import { ProductForm } from './features/products/ProductForm';
import { Settings } from './features/settings/Settings';
import { UserList } from './features/users/UserList';

const App = () => {
  return (
    <Provider store={store}>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <AuthGuard>
                  <MainLayout />
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products">
                <Route index element={<ProductList />} />
                <Route path="new" element={<ProductForm />} />
                <Route path="edit/:id" element={<ProductForm />} />
              </Route>
              <Route path="users" element={<UserList />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </Provider>
  );
};

export default App;
