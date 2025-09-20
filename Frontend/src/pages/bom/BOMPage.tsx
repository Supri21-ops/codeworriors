import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface BOMItem {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  unit: string;
  cost: number;
}

interface BOM {
  id: string;
  name: string;
  productName: string;
  version: string;
  status: 'active' | 'draft' | 'obsolete';
  totalCost: number;
  items: BOMItem[];
  createdAt: string;
  updatedAt: string;
}

export const BOMPage: React.FC = () => {
  const [boms, setBoms] = useState<BOM[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockBOMs: BOM[] = [
      {
        id: '1',
        name: 'Steel Frame Assembly BOM',
        productName: 'Steel Frame Assembly',
        version: 'v1.2',
        status: 'active',
        totalCost: 185.50,
        items: [
          {
            id: '1-1',
            partNumber: 'SF-BASE-001',
            description: 'Base Frame - Steel',
            quantity: 1,
            unit: 'each',
            cost: 85.00
          },
          {
            id: '1-2',
            partNumber: 'SF-SUPP-002',
            description: 'Support Beam - Steel',
            quantity: 4,
            unit: 'each',
            cost: 15.50
          },
          {
            id: '1-3',
            partNumber: 'BOLT-M12-050',
            description: 'Bolt M12x50',
            quantity: 16,
            unit: 'each',
            cost: 1.25
          }
        ],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20'
      },
      {
        id: '2',
        name: 'Control Panel BOM',
        productName: 'Control Panel Housing',
        version: 'v2.0',
        status: 'active',
        totalCost: 142.75,
        items: [
          {
            id: '2-1',
            partNumber: 'CPH-ENCL-300',
            description: 'Main Enclosure',
            quantity: 1,
            unit: 'each',
            cost: 95.00
          },
          {
            id: '2-2',
            partNumber: 'CPH-DOOR-300',
            description: 'Access Door',
            quantity: 1,
            unit: 'each',
            cost: 35.00
          },
          {
            id: '2-3',
            partNumber: 'GASKET-SEAL-20',
            description: 'Weather Seal Gasket',
            quantity: 2,
            unit: 'meters',
            cost: 6.25
          }
        ],
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18'
      },
      {
        id: '3',
        name: 'Bearing Assembly BOM',
        productName: 'Precision Bearing',
        version: 'v1.0',
        status: 'draft',
        totalCost: 65.25,
        items: [
          {
            id: '3-1',
            partNumber: 'BEAR-OUTER-2024',
            description: 'Outer Race',
            quantity: 1,
            unit: 'each',
            cost: 25.00
          },
          {
            id: '3-2',
            partNumber: 'BEAR-INNER-2024',
            description: 'Inner Race',
            quantity: 1,
            unit: 'each',
            cost: 22.50
          },
          {
            id: '3-3',
            partNumber: 'BEAR-BALLS-SET',
            description: 'Ball Bearing Set',
            quantity: 1,
            unit: 'set',
            cost: 17.75
          }
        ],
        createdAt: '2024-01-08',
        updatedAt: '2024-01-12'
      }
    ];

    setTimeout(() => {
      setBoms(mockBOMs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBOMs = boms.filter(bom => {
    const matchesSearch = bom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bom.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bom.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'obsolete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bills of Materials</h1>
            <p className="text-gray-600 mt-1">
              Manage product BOMs and component specifications
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Create BOM
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search BOMs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="obsolete">Obsolete</option>
              </select>
            </div>
          </div>
        </div>

        {/* BOMs Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading BOMs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BOM Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBOMs.map((bom) => (
                    <tr key={bom.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{bom.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bom.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-800 rounded">
                          {bom.version}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bom.status)}`}>
                          {bom.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${bom.totalCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bom.items.length} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(bom.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1" title="View Details">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 p-1" title="Edit">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBOMs.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No BOMs found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};