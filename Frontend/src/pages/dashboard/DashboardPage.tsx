import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatsCards } from '../../components/dashboard/StatsCards';
import { RecentOrders } from '../../components/dashboard/RecentOrders';
import { PriorityQueue } from '../../components/dashboard/PriorityQueue';
import { ProductionChart } from '../../components/dashboard/ProductionChart';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { Notifications } from '../../components/dashboard/Notifications';

export const DashboardPage: React.FC = () => {
  // NOTE: automatic data fetches have been disabled. Call explicit refresh
  // using the manufacturing store's `triggerRefresh` or start auto-refresh
  // via `startAutoRefresh(intervalMs)` where appropriate.

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening in your manufacturing operations.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Order
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Production Chart */}
            <ProductionChart />

            {/* Recent Orders */}
            <RecentOrders />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Priority Queue */}
            <PriorityQueue />

            {/* Notifications */}
            <Notifications />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
