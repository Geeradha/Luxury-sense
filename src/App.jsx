import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import AdminRoute from './components/AdminRoute';
import AdminBrands from './pages/admin/AdminBrands';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminProducts from './pages/admin/AdminProducts';
import BrandsList from './pages/BrandsList';
import BrandDetails from './pages/BrandDetails';
import ContactUs from './pages/ContactUs';
import MessageInbox from './pages/admin/MessageInbox';
import Cart from './pages/Cart';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout';
import Collections from './pages/Collections';
import Heritage from './pages/Heritage';
import Landing from './pages/Landing';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import ProductDetailView from './pages/ProductDetailView';
import WishlistView from './pages/WishlistView';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public-facing routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<Catalog />} />
          <Route path="/product" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetailView />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/brands" element={<BrandsList />} />
          <Route path="/brands/:slug" element={<BrandDetails />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<WishlistView />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/brands" element={<AdminBrands />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/questions" element={<AdminQuestions />} />
            <Route path="/admin/contact-messages" element={<MessageInbox />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}