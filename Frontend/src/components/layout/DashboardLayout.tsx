import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuthStore } from '../../stores/authStore';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const prevUserRef = useRef<typeof user | null>(null);
  const didNavigateRef = useRef(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Only redirect to login when the current route is not an auth route.
    // Guard navigation so we only perform it when `user` transitions from a truthy
    // value to falsy. This prevents navigation loops caused by repeated state updates.
    const pathname = location.pathname || '';
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/auth') || pathname.startsWith('/forgot');

    // If we're already on an auth route, do nothing.
    if (isAuthRoute) {
      prevUserRef.current = user;
      didNavigateRef.current = false;
      return;
    }

    // If user existed and now is gone, navigate once to login.
    if (prevUserRef.current && !user && !didNavigateRef.current) {
      didNavigateRef.current = true;
      navigate('/login', { replace: true });
    }

    // Update prevUser for next effect run.
    prevUserRef.current = user;
  // We intentionally keep `location.pathname` out of the dependency array to avoid
  // re-running this effect on every route change; it should only watch `user`.
  }, [user, navigate]);

  if (!user) {
    // When not authenticated, don't render the dashboard UI. Return null so the
    // router can show the login page without a visible 'Redirecting...' flash.
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        {user && (
          <Topbar 
            onMenuClick={handleMenuClick}
            user={user}
            onLogout={handleLogout}
          />
        )}

        {/* Page Content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
      )}
    </div>
  );
};
