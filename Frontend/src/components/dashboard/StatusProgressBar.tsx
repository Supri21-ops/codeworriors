import React from 'react';
import { clsx } from 'clsx';

interface StatusProgressBarProps {
  currentStatus: 'DRAFT' | 'CONFIRMED' | 'IN_PROGRESS' | 'TO_CLOSE' | 'DONE' | 'CANCELLED';
  className?: string;
}

const statuses = [
  { key: 'DRAFT', label: 'Draft' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'IN_PROGRESS', label: 'In-Progress' },
  { key: 'TO_CLOSE', label: 'To Close' },
  { key: 'DONE', label: 'Done' },
];

export const StatusProgressBar: React.FC<StatusProgressBarProps> = ({ 
  currentStatus, 
  className 
}) => {
  const getStatusIndex = (status: string) => {
    return statuses.findIndex(s => s.key === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  if (currentStatus === 'CANCELLED') {
    return (
      <div className={clsx('flex items-center justify-center', className)}>
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-medium">
          Cancelled
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center space-x-2', className)}>
      {statuses.map((status, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <React.Fragment key={status.key}>
            <div
              className={clsx(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                isActive
                  ? isCurrent
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-500'
              )}
            >
              {status.label}
            </div>
            {index < statuses.length - 1 && (
              <div
                className={clsx(
                  'w-8 h-0.5',
                  index < currentIndex ? 'bg-green-300' : 'bg-gray-200'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
