import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatsCards } from '../../components/dashboard/StatsCards';
import { RecentOrders } from '../../components/dashboard/RecentOrders';
import { PriorityQueue } from '../../components/dashboard/PriorityQueue';
import { ProductionChart } from '../../components/dashboard/ProductionChart';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { Notifications } from '../../components/dashboard/Notifications';
import { ManufacturingNotifications } from '../../components/dashboard/ManufacturingNotifications';
import { ManufacturingOverview } from '../../components/dashboard/ManufacturingOverview';
import { StatusProgressBar } from '../../components/dashboard/StatusProgressBar';
import { useManufacturingStore } from '../../store/manufacturing.store';

export const DashboardPage: React.FC = () => {
  const { 
    manufacturingOrders, 
    ordersLoading, 
    triggerRefresh, 
    startAutoRefresh,
    stopAutoRefresh 
  } = useManufacturingStore();
  
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  // Start auto-refresh on component mount
  useEffect(() => {
    startAutoRefresh(30000); // Refresh every 30 seconds
    return () => stopAutoRefresh();
  }, [startAutoRefresh, stopAutoRefresh]);

  // Mock data for demonstration
  const mockManufacturingOrder = {
    id: '1',
    orderNumber: 'MO-000001',
    productName: 'Steel Table',
    quantity: 10,
    status: 'IN_PROGRESS' as const,
    priority: 'HIGH' as const,
    dueDate: '2025-01-25',
    assignee: 'John Doe',
    components: [
      {
        id: '1',
        name: 'Steel Sheets',
        sku: 'STL-001',
        available: 50,
        toConsume: 20,
        units: 'sheets',
        minThreshold: 10
      },
      {
        id: '2',
        name: 'Screws',
        sku: 'SCR-001',
        available: 200,
        toConsume: 80,
        units: 'pieces',
        minThreshold: 50
      }
    ],
    workOrders: [
      {
        id: '1',
        orderNumber: 'WO-001',
        operation: 'Cutting',
        workCenter: 'Cutting Station A',
        estimatedDuration: 120,
        actualDuration: 90,
        status: 'DONE' as const,
        assignedUser: 'Alice Smith'
      },
      {
        id: '2',
        orderNumber: 'WO-002',
        operation: 'Welding',
        workCenter: 'Welding Station B',
        estimatedDuration: 180,
        actualDuration: 60,
        status: 'IN_PROGRESS' as const,
        assignedUser: 'Bob Johnson'
      },
      {
        id: '3',
        orderNumber: 'WO-003',
        operation: 'Assembly',
        workCenter: 'Assembly Line C',
        estimatedDuration: 240,
        actualDuration: 0,
        status: 'CONFIRMED' as const,
        assignedUser: 'Carol Davis'
      }
    ]
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
    setViewMode('detailed');
  };

  const handleBackToOverview = () => {
    setSelectedOrder(null);
    setViewMode('overview');
  };

  const handleUpdateOrder = (orderId: string, updates: any) => {
    console.log('Update order:', orderId, updates);
    // Implement order update logic
  };

  const handleStartOrder = (orderId: string) => {
    console.log('Start order:', orderId);
    // Implement start order logic
  };

  const handlePauseOrder = (orderId: string) => {
    console.log('Pause order:', orderId);
    // Implement pause order logic
  };

  const handleCompleteOrder = (orderId: string) => {
    console.log('Complete order:', orderId);
    // Implement complete order logic
  };

  const handleCancelOrder = (orderId: string) => {
    console.log('Cancel order:', orderId);
    // Implement cancel order logic
  };

  const handleAddComponent = (orderId: string) => {
    console.log('Add component to order:', orderId);
    // Implement add component logic
  };

  const handleUpdateComponent = (orderId: string, componentId: string, toConsume: number) => {
    console.log('Update component consumption:', orderId, componentId, toConsume);
    // Implement component update logic
  };

  const handleAddWorkOrder = (orderId: string) => {
    console.log('Add work order to order:', orderId);
    // Implement add work order logic
  };

  const handleUpdateWorkOrder = (orderId: string, workOrderId: string, updates: any) => {
    console.log('Update work order:', orderId, workOrderId, updates);
    // Implement work order update logic
  };

  const handleStartWorkOrder = (orderId: string, workOrderId: string) => {
    console.log('Start work order:', orderId, workOrderId);
    // Implement start work order logic
  };

  const handlePauseWorkOrder = (orderId: string, workOrderId: string) => {
    console.log('Pause work order:', orderId, workOrderId);
    // Implement pause work order logic
  };

  const handleCompleteWorkOrder = (orderId: string, workOrderId: string) => {
    console.log('Complete work order:', orderId, workOrderId);
    // Implement complete work order logic
  };

  const handleCancelWorkOrder = (orderId: string, workOrderId: string) => {
    console.log('Cancel work order:', orderId, workOrderId);
    // Implement cancel work order logic
  };

  if (viewMode === 'detailed' && selectedOrder) {
    return (
      <DashboardLayout>
        <ManufacturingOverview
          manufacturingOrder={mockManufacturingOrder}
          onUpdateOrder={handleUpdateOrder}
          onStartOrder={handleStartOrder}
          onPauseOrder={handlePauseOrder}
          onCompleteOrder={handleCompleteOrder}
          onCancelOrder={handleCancelOrder}
          onAddComponent={handleAddComponent}
          onUpdateComponent={handleUpdateComponent}
          onAddWorkOrder={handleAddWorkOrder}
          onUpdateWorkOrder={handleUpdateWorkOrder}
          onStartWorkOrder={handleStartWorkOrder}
          onPauseWorkOrder={handlePauseWorkOrder}
          onCompleteWorkOrder={handleCompleteWorkOrder}
          onCancelWorkOrder={handleCancelWorkOrder}
        />
      </DashboardLayout>
    );
  }

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
            <RecentOrders onOrderClick={handleOrderSelect} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Priority Queue */}
            <PriorityQueue />

            {/* Manufacturing Notifications */}
            <ManufacturingNotifications />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
