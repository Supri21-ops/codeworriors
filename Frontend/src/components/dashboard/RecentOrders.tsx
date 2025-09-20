import React from 'react';
import { Link } from 'react-router-dom';
import { useManufacturingStore } from '../../store/manufacturing.store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PLANNED':
      return 'bg-gray-100 text-gray-800';
    case 'RELEASED':
      return 'bg-blue-100 text-blue-800';
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'ON_HOLD':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'LOW':
      return 'text-gray-500';
    case 'NORMAL':
      return 'text-blue-500';
    case 'HIGH':
      return 'text-yellow-500';
    case 'URGENT':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const RecentOrders: React.FC = () => {
  const { manufacturingOrders, ordersLoading } = useManufacturingStore();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Recent Manufacturing Orders</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/manufacturing-orders">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {ordersLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : manufacturingOrders.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new manufacturing order.</p>
            <div className="mt-6">
              <Button asChild>
                <Link to="/manufacturing-orders/new">Create Order</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {manufacturingOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.orderNumber}
                    </p>
                    <span className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(order.status)
                    )}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {order.product.name} • Qty: {order.quantity}
                  </p>
                  <p className="text-xs text-gray-400">
                    Due: {new Date(order.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={clsx('text-sm font-medium', getPriorityColor(order.priority))}>
                      {order.priority}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.createdBy.firstName} {order.createdBy.lastName}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/manufacturing-orders/${order.id}`}>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
