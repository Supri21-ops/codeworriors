import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

const mockPriorityQueue = [
  {
    id: '1',
    orderNumber: 'WO-0001',
    productName: 'Steel Table',
    workCenter: 'Assembly Line A',
    priority: 'URGENT',
    dueDate: '2025-01-20',
    estimatedDuration: 8,
  },
  {
    id: '2',
    orderNumber: 'WO-0002',
    productName: 'Wooden Chair',
    workCenter: 'Machining Center B',
    priority: 'HIGH',
    dueDate: '2025-01-22',
    estimatedDuration: 6,
  },
  {
    id: '3',
    orderNumber: 'WO-0003',
    productName: 'Metal Frame',
    workCenter: 'Welding Station',
    priority: 'NORMAL',
    dueDate: '2025-01-25',
    estimatedDuration: 4,
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'URGENT':
      return 'text-red-600 bg-red-100';
    case 'HIGH':
      return 'text-yellow-600 bg-yellow-100';
    case 'NORMAL':
      return 'text-blue-600 bg-blue-100';
    case 'LOW':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const PriorityQueue: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Priority Queue</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockPriorityQueue.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.orderNumber}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.productName} • {item.workCenter}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={clsx(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getPriorityColor(item.priority)
                )}>
                  {item.priority}
                </span>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {item.estimatedDuration}h
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
