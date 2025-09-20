import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ProfileSetupMenu } from '../../components/layout/ProfileSetupMenu';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { clsx } from 'clsx';
import { 
  MagnifyingGlassIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

interface WorkOrderAnalysisData {
  id: string;
  operation: string;
  workCenter: string;
  product: string;
  quantity: number;
  expectedDuration: string; // Format: "180:00"
  realDuration: string; // Format: "00:00"
  status: 'To Do' | 'In Progress' | 'Done' | 'Cancelled';
}

const mockWorkOrders: WorkOrderAnalysisData[] = [
  {
    id: '1',
    operation: 'Assembly-1',
    workCenter: 'Work Center -1',
    product: 'Dining Table',
    quantity: 3,
    expectedDuration: '180:00',
    realDuration: '00:00',
    status: 'To Do'
  },
  {
    id: '2',
    operation: 'Cutting-1',
    workCenter: 'Work Center -2',
    product: 'Dining Table',
    quantity: 3,
    expectedDuration: '120:00',
    realDuration: '45:30',
    status: 'In Progress'
  },
  {
    id: '3',
    operation: 'Sanding-1',
    workCenter: 'Work Center -3',
    product: 'Dining Table',
    quantity: 3,
    expectedDuration: '90:00',
    realDuration: '90:00',
    status: 'Done'
  },
  {
    id: '4',
    operation: 'Painting-1',
    workCenter: 'Work Center -4',
    product: 'Dining Table',
    quantity: 3,
    expectedDuration: '60:00',
    realDuration: '00:00',
    status: 'To Do'
  }
];

const WorkOrdersAnalysisPage: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrderAnalysisData[]>(mockWorkOrders);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrderAnalysisData[]>(mockWorkOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [workCenterFilter, setWorkCenterFilter] = useState('');

  // Filter work orders based on search and filters
  useEffect(() => {
    let filtered = workOrders;

    if (searchQuery) {
      filtered = filtered.filter(wo => 
        wo.workCenter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.operation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.product.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(wo => wo.status === statusFilter);
    }

    if (workCenterFilter) {
      filtered = filtered.filter(wo => wo.workCenter === workCenterFilter);
    }

    setFilteredWorkOrders(filtered);
  }, [workOrders, searchQuery, statusFilter, workCenterFilter]);

  // Calculate totals
  const totalExpectedDuration = filteredWorkOrders.reduce((total, wo) => {
    const [hours, minutes] = wo.expectedDuration.split(':').map(Number);
    return total + (hours * 60 + minutes);
  }, 0);

  const totalRealDuration = filteredWorkOrders.reduce((total, wo) => {
    const [hours, minutes] = wo.realDuration.split(':').map(Number);
    return total + (hours * 60 + minutes);
  }, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueWorkCenters = Array.from(new Set(workOrders.map(wo => wo.workCenter)));
  const uniqueStatuses = Array.from(new Set(workOrders.map(wo => wo.status)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Profile Setup Menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ProfileSetupMenu />
            <h1 className="text-3xl font-bold text-gray-900">Work Orders Analysis</h1>
          </div>
          
          {/* Search Functionality */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by work center, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Center
                </label>
                <select
                  value={workCenterFilter}
                  onChange={(e) => setWorkCenterFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Work Centers</option>
                  {uniqueWorkCenters.map(center => (
                    <option key={center} value={center}>{center}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('');
                    setWorkCenterFilter('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Orders Analysis Table */}
        <Card>
          <CardHeader>
            <CardTitle>Work Orders Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Work Center
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected Duration
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
                  {filteredWorkOrders.map((workOrder) => (
                    <tr key={workOrder.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {workOrder.operation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {workOrder.workCenter}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {workOrder.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {workOrder.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {workOrder.expectedDuration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {workOrder.realDuration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(workOrder.status)
                        )}>
                          {workOrder.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals Row */}
                <tfoot className="bg-gray-100">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900" colSpan={4}>
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatDuration(totalExpectedDuration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatDuration(totalRealDuration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {/* Empty cell for status column */}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {filteredWorkOrders.length === 0 && (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No work orders found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WorkOrdersAnalysisPage;
