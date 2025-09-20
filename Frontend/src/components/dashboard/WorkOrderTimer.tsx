import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';
import { PlayIcon, PauseIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface WorkOrderTimerProps {
  workOrderId: string;
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  status: 'DRAFT' | 'CONFIRMED' | 'IN_PROGRESS' | 'TO_CLOSE' | 'DONE' | 'CANCELLED';
  onStatusChange: (workOrderId: string, status: string, actualDuration: number) => void;
  onStart: (workOrderId: string) => void;
  onPause: (workOrderId: string) => void;
  onComplete: (workOrderId: string) => void;
  onCancel: (workOrderId: string) => void;
  className?: string;
}

export const WorkOrderTimer: React.FC<WorkOrderTimerProps> = ({
  workOrderId,
  estimatedDuration = 0,
  actualDuration = 0,
  status,
  onStatusChange,
  onStart,
  onPause,
  onComplete,
  onCancel,
  className
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(actualDuration * 60); // Convert to seconds
  const [startTime, setStartTime] = useState<number | null>(null);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update timer every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(actualDuration * 60 + elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime, actualDuration]);

  const handleStart = useCallback(() => {
    if (status === 'DRAFT' || status === 'CONFIRMED') {
      onStatusChange(workOrderId, 'IN_PROGRESS', actualDuration);
    }
    setIsRunning(true);
    setStartTime(Date.now());
    onStart(workOrderId);
  }, [workOrderId, status, actualDuration, onStatusChange, onStart]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    setStartTime(null);
    onPause(workOrderId);
  }, [workOrderId, onPause]);

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    setStartTime(null);
    const totalDuration = Math.floor(elapsedTime / 60); // Convert back to minutes
    onStatusChange(workOrderId, 'DONE', totalDuration);
    onComplete(workOrderId);
  }, [workOrderId, elapsedTime, onStatusChange, onComplete]);

  const handleCancel = useCallback(() => {
    setIsRunning(false);
    setStartTime(null);
    onStatusChange(workOrderId, 'CANCELLED', Math.floor(elapsedTime / 60));
    onCancel(workOrderId);
  }, [workOrderId, elapsedTime, onStatusChange, onCancel]);

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

  return (
    <div className={clsx('flex items-center space-x-3', className)}>
      {/* Timer Display */}
      <div className="flex items-center space-x-2">
        <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
          {formatTime(elapsedTime)}
        </div>
        {estimatedDuration > 0 && (
          <div className="text-xs text-gray-500">
            / {estimatedDuration}m
          </div>
        )}
      </div>

      {/* Status */}
      <div className={clsx('text-sm font-medium', getStatusColor(status))}>
        {getStatusLabel(status)}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        {status === 'DRAFT' || status === 'CONFIRMED' ? (
          <Button
            size="sm"
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <PlayIcon className="h-4 w-4" />
          </Button>
        ) : status === 'IN_PROGRESS' ? (
          <>
            <Button
              size="sm"
              onClick={handlePause}
              variant="outline"
              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
            >
              <PauseIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleCancel}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </>
        ) : status === 'DONE' ? (
          <div className="text-sm text-green-600 font-medium">
            Completed
          </div>
        ) : status === 'CANCELLED' ? (
          <div className="text-sm text-red-600 font-medium">
            Cancelled
          </div>
        ) : null}
      </div>
    </div>
  );
};
