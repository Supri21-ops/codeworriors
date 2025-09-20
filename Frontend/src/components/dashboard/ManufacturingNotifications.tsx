import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  unread: boolean;
  orderId?: string;
  workOrderId?: string;
  componentId?: string;
}

interface ManufacturingNotificationsProps {
  className?: string;
}

export const ManufacturingNotifications: React.FC<ManufacturingNotificationsProps> = ({
  className
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'urgent',
      title: 'Urgent Order Overdue',
      message: 'Manufacturing order MO-000001 is overdue by 2 days',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unread: true,
      orderId: 'MO-000001'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Low Inventory Alert',
      message: 'Steel sheets inventory is below minimum threshold (10 remaining)',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      unread: true,
      componentId: 'STL-001'
    },
    {
      id: '3',
      type: 'info',
      title: 'Work Center Maintenance',
      message: 'Assembly Line A scheduled for maintenance tomorrow at 2 PM',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      unread: false
    },
    {
      id: '4',
      type: 'success',
      title: 'Order Completed',
      message: 'Manufacturing order MO-000005 has been completed successfully',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      unread: false,
      orderId: 'MO-000005'
    },
    {
      id: '5',
      type: 'error',
      title: 'Work Order Failed',
      message: 'Work order WO-000012 failed quality check and needs attention',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      unread: true,
      workOrderId: 'WO-000012'
    },
    {
      id: '6',
      type: 'warning',
      title: 'Component Shortage',
      message: 'Screws (SCR-001) will be out of stock in 3 days',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      unread: true,
      componentId: 'SCR-001'
    }
  ]);

  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notifications occasionally
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['urgent', 'warning', 'info', 'success', 'error'][Math.floor(Math.random() * 5)] as any,
          title: 'New Manufacturing Alert',
          message: 'A new manufacturing event has occurred that requires attention',
          timestamp: new Date(),
          unread: true
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;
  const displayedNotifications = isExpanded ? notifications : notifications.slice(0, 4);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      case 'info':
        return 'bg-blue-50 border-l-4 border-blue-500';
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'error':
        return 'bg-red-50 border-l-4 border-red-500';
      default:
        return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, unread: false } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, unread: false }))
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Manufacturing Alerts</CardTitle>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={clsx(
                'flex items-start space-x-3 p-3 rounded-lg transition-colors cursor-pointer',
                getNotificationColor(notification.type),
                notification.unread ? 'font-medium' : 'hover:bg-gray-50'
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={clsx(
                  'text-sm',
                  notification.unread ? 'text-gray-900' : 'text-gray-700'
                )}>
                  {notification.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTimeAgo(notification.timestamp)}
                </p>
              </div>
              {notification.unread && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {notifications.length > 4 && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : `Show All (${notifications.length})`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
