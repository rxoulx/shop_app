import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProductFormPage from './pages/ProductFormPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Cac route quan tri duoc bao ve */}
          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute rolesChoPhep={['Admin', 'NhanVien']}>
                <ProductFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <ProtectedRoute rolesChoPhep={['Admin', 'NhanVien']}>
                <ProductFormPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
