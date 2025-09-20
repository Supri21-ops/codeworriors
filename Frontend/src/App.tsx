import React from 'react';
import './index.css';

import { createBrowserRouter, RouterProvider, Navigate, useNavigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/authStore";
import { RoleRoute } from './components/navigation/ProtectedRoute';
import { authService } from './services/auth.service';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OtpVerifyPage from './pages/auth/OtpVerifyPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import OperatorDashboard from './pages/OperatorDashboard';
import { ManufacturingOrdersPage } from './pages/manufacturing/ManufacturingOrdersPage';
import { WorkOrdersPage } from './pages/work-orders/WorkOrdersPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import StockDashboard from './pages/inventory/StockDashboard';
import WorkCenterDashboard from './pages/workcenter/WorkCenterDashboard';
import ReportsPage from './pages/reports/ReportsPage';
import SearchResultsPage from './pages/search/SearchResultsPage';
import { ProductsPage } from './pages/products/ProductsPage';
import { BOMPage } from './pages/bom/BOMPage';
import { UsersPage } from './pages/users/UsersPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import WorkOrdersAnalysisPage from './pages/reports/WorkOrdersAnalysisPage';
import ProfilePage from './pages/profile/ProfilePage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useAuthStore();
  const token = authService.getToken();
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = !!token && !!currentUser;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useAuthStore();
  const token = authService.getToken();
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = !!token && !!currentUser;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  // Small component to listen for auth events and perform navigation inside React Router
  const AuthEventListener: React.FC = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
      let last = 0;
      const handler = () => {
        try {
          const now = Date.now();
          // throttle repeated events within 1s
          if (now - last < 1000) return;
          last = now;

          const current = window.location.pathname || '';
          if (current === '/login' || current.startsWith('/auth') || current === '/') return;

          navigate('/login', { replace: true });
        } catch (e) {
          // ignore
        }
      };
      window.addEventListener('auth:logout', handler as EventListener);
      return () => window.removeEventListener('auth:logout', handler as EventListener);
    }, [navigate]);
    return null;
  };

  // Build route objects for createBrowserRouter
  // Root wrapper so we can place AuthEventListener, Toaster, and render child routes via Outlet
  const RootApp: React.FC = () => (
    <div className="App">
      <AuthEventListener />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { duration: 5000, iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
      <Outlet />
    </div>
  );

  // Index redirect that sends authenticated users to /dashboard, others to /login
  const IndexRedirect: React.FC = () => {
    const { isLoading } = useAuthStore();
    if (isLoading) return <div />;
    const token = authService.getToken();
    const currentUser = authService.getCurrentUser();
    const isAuthenticated = !!token && !!currentUser;
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
  };

  const routes = [
    {
      path: '/',
      element: <RootApp />,
      children: [
  { index: true, element: <IndexRedirect /> },
        { path: '/login', element: <PublicRoute><LoginPage /></PublicRoute> },
        { path: '/signup', element: <PublicRoute><SignupPage /></PublicRoute> },
        { path: '/dashboard', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
        { path: '/manufacturing-orders', element: <ProtectedRoute><ManufacturingOrdersPage /></ProtectedRoute> },
        { path: '/work-orders', element: <ProtectedRoute><WorkOrdersPage /></ProtectedRoute> },
        { path: '/inventory', element: <ProtectedRoute><InventoryPage /></ProtectedRoute> },
  { path: '/work-centers', element: <ProtectedRoute><WorkCenterDashboard /></ProtectedRoute> },
        { path: '/reports', element: <RoleRoute allowedRoles={["manager","admin"]}><ReportsPage /></RoleRoute> },
        { path: '/products', element: <ProtectedRoute><ProductsPage /></ProtectedRoute> },
        { path: '/bom', element: <ProtectedRoute><BOMPage /></ProtectedRoute> },
        { path: '/users', element: <RoleRoute allowedRoles={["admin"]}><UsersPage /></RoleRoute> },
        { path: '/settings', element: <RoleRoute allowedRoles={["admin","manager"]}><SettingsPage /></RoleRoute> },
  { path: '/operator', element: <ProtectedRoute><OperatorDashboard /></ProtectedRoute> },
        { path: '/stock', element: <ProtectedRoute><StockDashboard /></ProtectedRoute> },
        { path: '/search', element: <ProtectedRoute><SearchResultsPage /></ProtectedRoute> },
        { path: '/auth/login', element: <PublicRoute><LoginPage /></PublicRoute> },
        { path: '/auth/signup', element: <PublicRoute><SignupPage /></PublicRoute> },
        { path: '/auth/forgot', element: <PublicRoute><ForgotPasswordPage /></PublicRoute> },
        { path: '/auth/otp', element: <PublicRoute><OtpVerifyPage /></PublicRoute> },
        { path: '/work-orders-analysis', element: <ProtectedRoute><WorkOrdersAnalysisPage /></ProtectedRoute> },
        { path: '/profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
        { path: '*', element: <Navigate to="/dashboard" replace /> }
      ]
    }
  ];

  const futureFlags: any = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };

  const router = createBrowserRouter(routes, {
    // opt-in to v7 future behaviors to silence warnings and test new behavior
    future: futureFlags,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
    </QueryClientProvider>
  );
}

export default App;