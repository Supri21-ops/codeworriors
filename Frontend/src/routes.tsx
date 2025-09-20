import React from 'react';
import ManagerDashboard from './pages/ManagerDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import InventoryDashboard from './pages/InventoryDashboard';
import WorkCenterDashboard from './pages/workcenter/WorkCenterDashboard';
import ReportsPage from './pages/reports/ReportsPage';
import StockDashboard from './pages/inventory/StockDashboard';
import SearchResultsPage from './pages/search/SearchResultsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OtpVerifyPage from './pages/auth/OtpVerifyPage';
import { ManufacturingOrdersPage } from './pages/manufacturing/ManufacturingOrdersPage';
import { WorkOrdersPage } from './pages/work-orders/WorkOrdersPage';
import { ProtectedRoute, RoleRoute } from './components/navigation/ProtectedRoute';

export type AppRoute = {
  key: string;
  path: string;
  element: React.ReactNode;
  protected?: boolean;
  allowedRoles?: string[];
};

export const appRoutes: AppRoute[] = [
  { key: 'manager', path: '/', element: <RoleRoute allowedRoles={["manager","admin"]}><ManagerDashboard /></RoleRoute>, protected: true, allowedRoles: ["manager","admin"] },
  { key: 'operator', path: '/operator', element: <ProtectedRoute><OperatorDashboard /></ProtectedRoute>, protected: true },
  { key: 'inventory', path: '/inventory', element: <ProtectedRoute><InventoryDashboard /></ProtectedRoute>, protected: true },
  { key: 'manufacturing-orders', path: '/manufacturing-orders', element: <ProtectedRoute><ManufacturingOrdersPage /></ProtectedRoute>, protected: true },
  { key: 'work-orders', path: '/work-orders', element: <ProtectedRoute><WorkOrdersPage /></ProtectedRoute>, protected: true },
  { key: 'workcenter', path: '/work-centers', element: <ProtectedRoute><WorkCenterDashboard /></ProtectedRoute>, protected: true },
  { key: 'reports', path: '/reports', element: <RoleRoute allowedRoles={["manager","admin"]}><ReportsPage /></RoleRoute>, protected: true, allowedRoles: ["manager","admin"] },
  { key: 'stock', path: '/stock', element: <ProtectedRoute><StockDashboard /></ProtectedRoute>, protected: true },
  { key: 'search', path: '/search', element: <ProtectedRoute><SearchResultsPage /></ProtectedRoute>, protected: true },
  { key: 'login', path: '/auth/login', element: <LoginPage /> },
  { key: 'signup', path: '/auth/signup', element: <SignupPage /> },
  { key: 'forgot', path: '/auth/forgot', element: <ForgotPasswordPage /> },
  { key: 'otp', path: '/auth/otp', element: <OtpVerifyPage /> },
];

export const navigationMenu = [
  { key: 'manufacturing', label: 'Manufacturing Orders', path: '/manufacturing-orders', sub: [] },
  { key: 'workorders', label: 'Work Orders', path: '/work-orders' },
  { key: 'bom', label: 'Bills of Materials', path: '/boms' },
  { key: 'workcenter', label: 'Work Center', path: '/work-centers' },
  { key: 'stock', label: 'Stock Ledger', path: '/stock' },
  { key: 'product', label: 'Product Master', path: '/products' },
  { key: 'reports', label: 'Reports', path: '/reports' }
];
