import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Protected Routes & Guards
import ProtectedRoute from './components/ProtectedRoute';
import PermissionGuard from './components/common/PermissionGuard';

// Layouts
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import AdminLayout from './components/admin/AdminLayout';
import ProfileLayout from './pages/profile/index';

// Pages
import Home from './pages/Home/Home';
import Auth from './pages/Login/Auth';
import GoogleCallback from './pages/Login/GoogleCallback';
import Checkout from './pages/Home/Checkout';
import Payment from './pages/Home/payment';
import Confirmation from './pages/Home/Confirmation';

// Admin Pages
import Dashboard from './pages/Dashboard/Dashboard';
import ProductManagement from './pages/Dashboard/ProductManagement';
import OrderManagement from './pages/Dashboard/OrderManagement';
import UserManagement from './pages/Dashboard/UserManagement';
import Roles from './pages/Dashboard/Roles';

// Profile Pages
import Profile from './pages/profile/Profile';
import Wishlist from './pages/profile/Wishlist';
import MyAddresses from './pages/profile/MyAddresses';
import MyOrders from './pages/profile/MyOrders';

// Lazy Loaded Pages
const ForgotPassword = lazy(() => import('./pages/Login/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Login/ResetPassword'));

// Layout for public/customer facing pages
const PublicLayout = () => (
    <div className="flex flex-col min-h-screen bg-bg-primary">
      <Header />
      <CartDrawer />
      <main className="flex-grow pt-4">
        <Outlet />
      </main>
      <Footer />
    </div>
);

function App() {
  return (
    <HelmetProvider>
      <Routes>
        {/* Admin Routes - Protected & Uses AdminLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={
              <PermissionGuard permission="view-products">
                <ProductManagement />
              </PermissionGuard>
            } />
            <Route path="orders" element={
              <PermissionGuard permission="view-orders">
                <OrderManagement />
              </PermissionGuard>
            } />
            <Route path="users" element={
              <PermissionGuard permission="view-users">
                <UserManagement />
              </PermissionGuard>
            } />
            <Route path="roles" element={
              <PermissionGuard permission="view-roles">
                <Roles />
              </PermissionGuard>
            } />
          </Route>
        </Route>

        {/* Public Routes - Uses PublicLayout (Header/Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryName" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={
            <Suspense fallback={<div className="flex justify-center mt-8 text-slate-500 font-bold">Loading...</div>}>
              <ForgotPassword />
            </Suspense>
          } />
          <Route path="/reset-password/:token" element={
            <Suspense fallback={<div className="flex justify-center mt-8 text-slate-500 font-bold">Loading...</div>}>
              <ResetPassword />
            </Suspense>
          } />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} /> 
          <Route path="/confirmation" element={<Confirmation />} />

          {/* 404 - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Profile Routes - Protected, Uses ProfileLayout (No main header) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<Profile />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="addresses" element={<MyAddresses />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>
        </Route>
      </Routes>
    </HelmetProvider>
  );
};

export default App;
