import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Component {
  id: string;
  name: string;
  sku: string;
  available: number;
  toConsume: number;
  units: string;
  minThreshold?: number;
}

interface ComponentAvailabilityProps {
  components: Component[];
  onAddComponent: () => void;
  onUpdateConsumption: (componentId: string, toConsume: number) => void;
  className?: string;
}

export const ComponentAvailability: React.FC<ComponentAvailabilityProps> = ({
  components,
  onAddComponent,
  onUpdateConsumption,
  className
}) => {
  const getAvailabilityStatus = (component: Component) => {
    const { available, toConsume, minThreshold = 0 } = component;
    const remaining = available - toConsume;
    
    if (remaining < 0) {
      return { status: 'insufficient', color: 'text-red-600', bgColor: 'bg-red-50' };
    } else if (remaining <= minThreshold) {
      return { status: 'low', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    } else {
      return { status: 'sufficient', color: 'text-green-600', bgColor: 'bg-green-50' };
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Component Availability</CardTitle>
      </CardHeader>
      <CardContent>
        {components.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No components</h3>
            <p className="mt-1 text-sm text-gray-500">Add components to track availability.</p>
            <div className="mt-6">
              <Button onClick={onAddComponent} size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Component
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Component
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To Consume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {components.map((component) => {
                    const availability = getAvailabilityStatus(component);
                    const remaining = component.available - component.toConsume;
                    
                    return (
                      <tr key={component.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {component.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {component.sku}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {component.available} {component.units}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              value={component.toConsume}
                              onChange={(e) => onUpdateConsumption(component.id, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-500">{component.units}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={clsx(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                              availability.bgColor,
                              availability.color
                            )}>
                              {availability.status === 'insufficient' && (
                                <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                              )}
                              {availability.status === 'insufficient' && 'Insufficient'}
                              {availability.status === 'low' && 'Low Stock'}
                              {availability.status === 'sufficient' && 'Available'}
                            </span>
                            {remaining >= 0 && (
                              <span className="text-xs text-gray-500">
                                {remaining} {component.units} remaining
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={onAddComponent} variant="outline" size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Component
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
