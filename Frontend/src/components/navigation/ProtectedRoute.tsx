import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
};

interface RoleRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { user } = useAuthStore();
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};
