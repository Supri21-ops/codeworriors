import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

const notifications = [
  {
    id: '1',
    type: 'urgent',
    title: 'Urgent Order Overdue',
    message: 'Manufacturing order WO-0001 is overdue by 2 days',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Low Inventory Alert',
    message: 'Steel sheets inventory is below minimum threshold',
    time: '4 hours ago',
    unread: true,
  },
  {
    id: '3',
    type: 'info',
    title: 'Work Center Maintenance',
    message: 'Assembly Line A scheduled for maintenance tomorrow',
    time: '1 day ago',
    unread: false,
  },
  {
    id: '4',
    type: 'success',
    title: 'Order Completed',
    message: 'Manufacturing order WO-0005 has been completed successfully',
    time: '2 days ago',
    unread: false,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'urgent':
      return (
        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    case 'warning':
      return (
        <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    case 'info':
      return (
        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'success':
      return (
        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
};

export const Notifications: React.FC = () => {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.slice(0, 4).map((notification) => (
            <div
              key={notification.id}
              className={clsx(
                'flex items-start space-x-3 p-3 rounded-lg transition-colors',
                notification.unread ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={clsx(
                  'text-sm font-medium',
                  notification.unread ? 'text-gray-900' : 'text-gray-700'
                )}>
                  {notification.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {notifications.length > 4 && (
          <div className="mt-4">
            <Button variant="outline" size="sm" className="w-full">
              View All Notifications
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
