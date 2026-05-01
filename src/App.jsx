import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import Cart from './pages/Cart';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout';
import Collections from './pages/Collections';
import Heritage from './pages/Heritage';
import Landing from './pages/Landing';
import AdminLogin from './pages/admin/AdminLogin';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetailView from './pages/ProductDetailView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin login is public so the admin can reach it without being protected */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Public-facing routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetailView />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin area: wrapped with ProtectedRoute that returns an Outlet */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}