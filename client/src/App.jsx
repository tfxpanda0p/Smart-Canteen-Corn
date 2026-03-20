import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/ui/Spinner';

// Lazy loaded pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const MenuBrowse = lazy(() => import('./pages/user/MenuBrowse'));
const PlaceOrder = lazy(() => import('./pages/user/PlaceOrder'));
const MyOrders = lazy(() => import('./pages/user/MyOrders'));
const OrderDetail = lazy(() => import('./pages/user/OrderDetail'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const MenuManagement = lazy(() => import('./pages/admin/MenuManagement'));
const AddMenuItem = lazy(() => import('./pages/admin/AddMenuItem'));
const EditMenuItem = lazy(() => import('./pages/admin/EditMenuItem'));
const AllOrders = lazy(() => import('./pages/admin/AllOrders'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
    <Spinner size="lg" />
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1d27',
                color: '#f1f5f9',
                border: '1px solid #2d3148',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#0f1117' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#0f1117' } },
            }}
          />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected (any authenticated user) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MenuBrowse />} />
                <Route path="/order/new" element={<PlaceOrder />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
              </Route>

              {/* Admin only */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/menu" element={<MenuManagement />} />
                <Route path="/admin/menu/add" element={<AddMenuItem />} />
                <Route path="/admin/menu/edit/:id" element={<EditMenuItem />} />
                <Route path="/admin/orders" element={<AllOrders />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
