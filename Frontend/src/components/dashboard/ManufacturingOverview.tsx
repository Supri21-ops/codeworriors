import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusProgressBar } from './StatusProgressBar';
import { ComponentAvailability } from './ComponentAvailability';
import { WorkOrdersManagement } from './WorkOrdersManagement';
import { clsx } from 'clsx';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ManufacturingOrder {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  status: 'DRAFT' | 'CONFIRMED' | 'IN_PROGRESS' | 'TO_CLOSE' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  dueDate: string;
  assignee?: string;
  components: Array<{
    id: string;
    name: string;
    sku: string;
    available: number;
    toConsume: number;
    units: string;
    minThreshold?: number;
  }>;
  workOrders: Array<{
    id: string;
    orderNumber: string;
    operation: string;
    workCenter: string;
    estimatedDuration: number;
    actualDuration: number;
    status: 'DRAFT' | 'CONFIRMED' | 'IN_PROGRESS' | 'TO_CLOSE' | 'DONE' | 'CANCELLED';
    assignedUser?: string;
  }>;
}

interface ManufacturingOverviewProps {
  manufacturingOrder: ManufacturingOrder;
  onUpdateOrder: (orderId: string, updates: Partial<ManufacturingOrder>) => void;
  onStartOrder: (orderId: string) => void;
  onPauseOrder: (orderId: string) => void;
  onCompleteOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onAddComponent: (orderId: string) => void;
  onUpdateComponent: (orderId: string, componentId: string, toConsume: number) => void;
  onAddWorkOrder: (orderId: string) => void;
  onUpdateWorkOrder: (orderId: string, workOrderId: string, updates: any) => void;
  onStartWorkOrder: (orderId: string, workOrderId: string) => void;
  onPauseWorkOrder: (orderId: string, workOrderId: string) => void;
  onCompleteWorkOrder: (orderId: string, workOrderId: string) => void;
  onCancelWorkOrder: (orderId: string, workOrderId: string) => void;
  className?: string;
}

export const ManufacturingOverview: React.FC<ManufacturingOverviewProps> = ({
  manufacturingOrder,
  onUpdateOrder,
  onStartOrder,
  onPauseOrder,
  onCompleteOrder,
  onCancelOrder,
  onAddComponent,
  onUpdateComponent,
  onAddWorkOrder,
  onUpdateWorkOrder,
  onStartWorkOrder,
  onPauseWorkOrder,
  onCompleteWorkOrder,
  onCancelWorkOrder,
  className
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'workorders'>('overview');

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

  const getStatusActions = () => {
    const { status } = manufacturingOrder;
    
    switch (status) {
      case 'DRAFT':
        return (
          <div className="flex space-x-2">
            <Button
              onClick={() => onUpdateOrder(manufacturingOrder.id, { status: 'CONFIRMED' })}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Confirm
            </Button>
            <Button variant="outline">
              Back
            </Button>
          </div>
        );
      case 'CONFIRMED':
      case 'IN_PROGRESS':
      case 'TO_CLOSE':
        return (
          <div className="flex space-x-2">
            <Button
              onClick={() => onStartOrder(manufacturingOrder.id)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Start
            </Button>
            <Button
              onClick={() => onCompleteOrder(manufacturingOrder.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Produce
            </Button>
            <Button
              onClick={() => onCancelOrder(manufacturingOrder.id)}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="outline">
              Back
            </Button>
          </div>
        );
      case 'DONE':
        return (
          <div className="flex space-x-2">
            <Button variant="outline">
              Back
            </Button>
          </div>
        );
      case 'CANCELLED':
        return (
          <div className="flex space-x-2">
            <Button variant="outline">
              Back
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const isReadOnly = manufacturingOrder.status === 'CANCELLED';

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manufacturing Order</h1>
          <p className="text-gray-600 mt-1">
            {manufacturingOrder.orderNumber} - {manufacturingOrder.productName}
          </p>
        </div>
        {getStatusActions()}
      </div>

      {/* Status Progress Bar */}
      <StatusProgressBar 
        currentStatus={manufacturingOrder.status}
        className="mb-6"
      />

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <div className="text-sm text-gray-900 font-mono">
                  {manufacturingOrder.orderNumber}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Finished Product *
                </label>
                <input
                  type="text"
                  value={manufacturingOrder.productName}
                  onChange={(e) => onUpdateOrder(manufacturingOrder.id, { productName: e.target.value })}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={manufacturingOrder.quantity}
                    onChange={(e) => onUpdateOrder(manufacturingOrder.id, { quantity: parseInt(e.target.value) || 0 })}
                    disabled={isReadOnly}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  <span className="text-sm text-gray-500">Units</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Date *
                </label>
                <input
                  type="date"
                  value={manufacturingOrder.dueDate}
                  onChange={(e) => onUpdateOrder(manufacturingOrder.id, { dueDate: e.target.value })}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  value={manufacturingOrder.assignee || ''}
                  onChange={(e) => onUpdateOrder(manufacturingOrder.id, { assignee: e.target.value })}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <div className={clsx('text-sm font-medium', getPriorityColor(manufacturingOrder.priority))}>
                  {manufacturingOrder.priority}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'components'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Components
          </button>
          <button
            onClick={() => setActiveTab('workorders')}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'workorders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Work Orders
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={clsx('text-sm font-medium', getPriorityColor(manufacturingOrder.status))}>
                    {manufacturingOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Priority:</span>
                  <span className={clsx('text-sm font-medium', getPriorityColor(manufacturingOrder.priority))}>
                    {manufacturingOrder.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Due Date:</span>
                  <span className="text-sm font-medium">
                    {new Date(manufacturingOrder.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Components:</span>
                  <span className="text-sm font-medium">
                    {manufacturingOrder.components.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Work Orders:</span>
                  <span className="text-sm font-medium">
                    {manufacturingOrder.workOrders.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Work Orders Completed</span>
                    <span>
                      {manufacturingOrder.workOrders.filter(wo => wo.status === 'DONE').length} / {manufacturingOrder.workOrders.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${manufacturingOrder.workOrders.length > 0 
                          ? (manufacturingOrder.workOrders.filter(wo => wo.status === 'DONE').length / manufacturingOrder.workOrders.length) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Components Available</span>
                    <span>
                      {manufacturingOrder.components.filter(c => c.available >= c.toConsume).length} / {manufacturingOrder.components.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${manufacturingOrder.components.length > 0 
                          ? (manufacturingOrder.components.filter(c => c.available >= c.toConsume).length / manufacturingOrder.components.length) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'components' && (
        <ComponentAvailability
          components={manufacturingOrder.components}
          onAddComponent={() => onAddComponent(manufacturingOrder.id)}
          onUpdateConsumption={(componentId, toConsume) => 
            onUpdateComponent(manufacturingOrder.id, componentId, toConsume)
          }
        />
      )}

      {activeTab === 'workorders' && (
        <WorkOrdersManagement
          workOrders={manufacturingOrder.workOrders}
          onAddWorkOrder={() => onAddWorkOrder(manufacturingOrder.id)}
          onUpdateWorkOrder={(workOrderId, updates) => 
            onUpdateWorkOrder(manufacturingOrder.id, workOrderId, updates)
          }
          onStartWorkOrder={(workOrderId) => 
            onStartWorkOrder(manufacturingOrder.id, workOrderId)
          }
          onPauseWorkOrder={(workOrderId) => 
            onPauseWorkOrder(manufacturingOrder.id, workOrderId)
          }
          onCompleteWorkOrder={(workOrderId) => 
            onCompleteWorkOrder(manufacturingOrder.id, workOrderId)
          }
          onCancelWorkOrder={(workOrderId) => 
            onCancelWorkOrder(manufacturingOrder.id, workOrderId)
          }
        />
      )}
    </div>
  );
};
