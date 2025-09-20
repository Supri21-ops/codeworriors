import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

interface ProfileSetupMenuProps {
  className?: string;
}

export const ProfileSetupMenu: React.FC<ProfileSetupMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleMyReports = () => {
    navigate('/work-orders-analysis');
    setIsOpen(false);
  };

  const handleMyProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  return (
    <div className={clsx('relative', className)}>
      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
      >
        <Bars3Icon className="h-5 w-5" />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Profile Setup</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1"
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleMyProfile}
                className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium">My Profile</span>
              </button>
              
              <button
                onClick={handleMyReports}
                className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ChartBarIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium">My Reports</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
