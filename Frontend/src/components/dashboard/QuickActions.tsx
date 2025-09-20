import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  CubeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const quickActions = [
  {
    name: 'New Manufacturing Order',
    description: 'Create a new manufacturing order',
    href: '/manufacturing-orders/new',
    icon: PlusIcon,
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'View Work Orders',
    description: 'Manage work orders and schedules',
    href: '/work-orders',
    icon: ClipboardDocumentListIcon,
    color: 'bg-green-600 hover:bg-green-700',
  },
  {
    name: 'Manage Inventory',
    description: 'Track and update inventory levels',
    href: '/inventory',
    icon: CubeIcon,
    color: 'bg-yellow-600 hover:bg-yellow-700',
  },
  {
    name: 'Work Centers',
    description: 'Configure work centers and resources',
    href: '/work-centers',
    icon: CogIcon,
    color: 'bg-purple-600 hover:bg-purple-700',
  },
  {
    name: 'Generate Reports',
    description: 'View production and performance reports',
    href: '/reports',
    icon: ChartBarIcon,
    color: 'bg-indigo-600 hover:bg-indigo-700',
  },
];

export const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.name}
              asChild
              className={`justify-start h-auto p-4 text-left ${action.color} text-white`}
            >
              <Link to={action.href}>
                <div className="flex items-center space-x-3">
                  <action.icon className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{action.name}</p>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
