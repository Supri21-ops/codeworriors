import React from 'react';
import { useManufacturingStore } from '../../store/manufacturing.store';
import { Card, CardContent } from '../ui/Card';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Orders',
    value: '0',
    icon: ChartBarIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    change: '+12%',
    changeType: 'positive',
  },
  {
    name: 'In Progress',
    value: '0',
    icon: ClockIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    change: '+5%',
    changeType: 'positive',
  },
  {
    name: 'Completed',
    value: '0',
    icon: CheckCircleIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    change: '+8%',
    changeType: 'positive',
  },
  {
    name: 'Urgent Orders',
    value: '0',
    icon: ExclamationTriangleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    change: '-2%',
    changeType: 'negative',
  },
];

export const StatsCards: React.FC = () => {
  const { ordersStats, ordersLoading } = useManufacturingStore();

  // Safely access ordersStats properties with fallbacks
  const displayStats = [
    {
      ...stats[0],
      value: ordersStats?.total?.toString() || '0',
    },
    {
      ...stats[1],
      value: ordersStats?.inProgress?.toString() || '0',
    },
    {
      ...stats[2],
      value: ordersStats?.completed?.toString() || '0',
    },
    {
      ...stats[3],
      value: ordersStats?.urgent?.toString() || '0',
    },
  ];

  if (ordersLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      <div className="h-6 bg-gray-200 rounded w-12 mt-1"></div>
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((stat) => (
        <Card key={stat.name} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-8 w-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};