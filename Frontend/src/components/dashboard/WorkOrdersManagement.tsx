import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { WorkOrderTimer } from './WorkOrderTimer';
import { clsx } from 'clsx';
import { PlusIcon } from '@heroicons/react/24/outline';

interface WorkOrder {
  id: string;
  orderNumber: string;
  operation: string;
  workCenter: string;
  estimatedDuration: number; // in minutes
  actualDuration: number; // in minutes
  status: 'DRAFT' | 'CONFIRMED' | 'IN_PROGRESS' | 'TO_CLOSE' | 'DONE' | 'CANCELLED';
  assignedUser?: string;
}

interface WorkOrdersManagementProps {
  workOrders: WorkOrder[];
  onAddWorkOrder: () => void;
  onUpdateWorkOrder: (workOrderId: string, updates: Partial<WorkOrder>) => void;
  onStartWorkOrder: (workOrderId: string) => void;
  onPauseWorkOrder: (workOrderId: string) => void;
  onCompleteWorkOrder: (workOrderId: string) => void;
  onCancelWorkOrder: (workOrderId: string) => void;
  className?: string;
}

export const WorkOrdersManagement: React.FC<WorkOrdersManagementProps> = ({
  workOrders,
  onAddWorkOrder,
  onUpdateWorkOrder,
  onStartWorkOrder,
  onPauseWorkOrder,
  onCompleteWorkOrder,
  onCancelWorkOrder,
  className
}) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleStatusChange = (workOrderId: string, status: string, actualDuration: number) => {
    onUpdateWorkOrder(workOrderId, { status: status as any, actualDuration });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
      case 'CONFIRMED':
        return 'text-gray-500';
      case 'IN_PROGRESS':
        return 'text-yellow-600';
      case 'DONE':
        return 'text-green-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT':
      case 'CONFIRMED':
        return 'To do';
      case 'IN_PROGRESS':
        return 'In-progress';
      case 'DONE':
        return 'Done';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const totalEstimatedDuration = workOrders.reduce((sum, wo) => sum + wo.estimatedDuration, 0);
  const totalActualDuration = workOrders.reduce((sum, wo) => sum + wo.actualDuration, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Work Orders</CardTitle>
          <Button onClick={onAddWorkOrder} size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Line
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {workOrders.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No work orders</h3>
            <p className="mt-1 text-sm text-gray-500">Add work orders to track operations.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{workOrders.length}</div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalEstimatedDuration}m</div>
                <div className="text-sm text-gray-500">Estimated Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalActualDuration}m</div>
                <div className="text-sm text-gray-500">Actual Duration</div>
              </div>
            </div>

            {/* Work Orders Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Work Center
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Real Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workOrders.map((workOrder) => (
                    <tr key={workOrder.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {workOrder.operation}
                          </div>
                          <div className="text-sm text-gray-500">
                            {workOrder.orderNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {workOrder.workCenter}
                        </div>
                        {workOrder.assignedUser && (
                          <div className="text-sm text-gray-500">
                            {workOrder.assignedUser}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {workOrder.estimatedDuration}m
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <WorkOrderTimer
                          workOrderId={workOrder.id}
                          estimatedDuration={workOrder.estimatedDuration}
                          actualDuration={workOrder.actualDuration}
                          status={workOrder.status}
                          onStatusChange={handleStatusChange}
                          onStart={onStartWorkOrder}
                          onPause={onPauseWorkOrder}
                          onComplete={onCompleteWorkOrder}
                          onCancel={onCancelWorkOrder}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          workOrder.status === 'DONE' && 'bg-green-100 text-green-800',
                          workOrder.status === 'IN_PROGRESS' && 'bg-yellow-100 text-yellow-800',
                          workOrder.status === 'CANCELLED' && 'bg-red-100 text-red-800',
                          (workOrder.status === 'DRAFT' || workOrder.status === 'CONFIRMED') && 'bg-gray-100 text-gray-800'
                        )}>
                          {getStatusLabel(workOrder.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
