import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { bomService, BOM, BOMSummary, BOMFilters } from '../../services/bom.service';
import toast from 'react-hot-toast';

export const BOMPage: React.FC = () => {
  const [boms, setBoms] = useState<BOM[]>([]);
  const [summary, setSummary] = useState<BOMSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch BOMs and summary on component mount
  useEffect(() => {
    fetchBOMs();
    fetchSummary();
  }, []);

  const fetchBOMs = async (filters?: BOMFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bomService.getBOMs({
        search: searchTerm || undefined,
        isActive: filterStatus === 'all' ? undefined : filterStatus === 'active',
        ...filters
      });
      setBoms(response.data);
    } catch (error) {
      console.error('Error fetching BOMs:', error);
      setError('Failed to load BOMs');
      toast.error('Failed to load BOMs');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const summaryData = await bomService.getBOMsSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching BOM summary:', error);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBOMs();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterStatus]);

  const handleDeleteBOM = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this BOM?')) {
      try {
        await bomService.deleteBOM(id);
        toast.success('BOM deleted successfully');
        fetchBOMs();
        fetchSummary();
      } catch (error) {
        toast.error('Failed to delete BOM');
      }
    }
  };

  const handleEditBOM = (id: string) => {
    toast(`Edit BOM ${id} - Feature coming soon`);
  };

  const handleViewBOM = (id: string) => {
    toast(`View BOM ${id} - Feature coming soon`);
  };

  const handleCreateBOM = () => {
    toast('Create BOM - Feature coming soon');
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await bomService.toggleBOMStatus(id);
      toast.success('BOM status updated');
      fetchBOMs();
      fetchSummary();
    } catch (error) {
      toast.error('Failed to update BOM status');
    }
  };

  // BOMs are already filtered by backend, just display them
  const filteredBOMs = boms;

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
          <button 
            onClick={handleCreateBOM}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
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
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{summary.totalBOMs}</div>
              <div className="text-sm text-gray-500">Total BOMs</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{summary.activeBOMs}</div>
              <div className="text-sm text-gray-500">Active BOMs</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-gray-600">{summary.totalComponents}</div>
              <div className="text-sm text-gray-500">Total Components</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">${summary.avgCostPerBOM.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Avg Cost per BOM</div>
            </div>
          </div>
        )}

        {/* BOMs Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">⚠️ {error}</div>
              <button 
                onClick={() => fetchBOMs()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
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
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
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
                      Created By
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
                        <div className="text-sm font-medium text-gray-900">{bom.product.name}</div>
                        <div className="text-sm text-gray-500">{bom.notes || 'No description'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {bom.product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-800 rounded">
                          {bom.version}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          bom.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {bom.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${bom.totalCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bom.totalItems} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bom.createdBy.firstName} {bom.createdBy.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleViewBOM(bom.id)}
                            className="text-blue-600 hover:text-blue-900 p-1" 
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditBOM(bom.id)}
                            className="text-blue-600 hover:text-blue-900 p-1" 
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(bom.id)}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title={bom.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {bom.isActive ? '⏸️' : '▶️'}
                          </button>
                          <button 
                            onClick={() => handleDeleteBOM(bom.id)}
                            className="text-red-600 hover:text-red-900 p-1" 
                            title="Delete"
                          >
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