import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useManufacturingStore } from '../store/manufacturing.store';
import { COLORS } from '../theme';
import toast from 'react-hot-toast';

interface WorkOrder {
  id: string;
  orderNumber: string;
  manufacturingOrder: string;
  workCenter: string;
  status: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  assignedUser: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
}

const sampleWorkOrders: WorkOrder[] = [
  {
    id: '1',
    orderNumber: 'WO-0001',
    manufacturingOrder: 'MO-0001',
    workCenter: 'Assembly Line A',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignedUser: 'John Doe',
    plannedStartDate: '2025-01-15',
    plannedEndDate: '2025-01-20',
    actualStartDate: '2025-01-15'
  },
  {
    id: '2',
    orderNumber: 'WO-0002',
    manufacturingOrder: 'MO-0002',
    workCenter: 'Machining Center B',
    status: 'PLANNED',
    priority: 'NORMAL',
    assignedUser: 'Jane Smith',
    plannedStartDate: '2025-01-22',
    plannedEndDate: '2025-01-25'
  },
  {
    id: '3',
    orderNumber: 'WO-0003',
    manufacturingOrder: 'MO-0003',
    workCenter: 'Quality Control',
    status: 'COMPLETED',
    priority: 'LOW',
    assignedUser: 'Mike Johnson',
    plannedStartDate: '2025-01-10',
    plannedEndDate: '2025-01-12',
    actualStartDate: '2025-01-10',
    actualEndDate: '2025-01-12'
  }
];

export const WorkOrders: React.FC = () => {
  const { 
    workOrders, 
    workOrdersLoading, 
    workOrdersError,
    fetchWorkOrders,
    setWorkOrdersFilters,
    workOrdersFilters,
    updateWorkOrder,
    deleteWorkOrder 
  } = useManufacturingStore();
  
  const [filter, setFilter] = useState<'ALL' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  useEffect(() => {
    // Fetch work orders on component mount
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  const handleFilterChange = (newFilter: 'ALL' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED') => {
    setFilter(newFilter);
    if (newFilter === 'ALL') {
      setWorkOrdersFilters({ ...workOrdersFilters, status: undefined });
      fetchWorkOrders({ ...workOrdersFilters, status: undefined });
    } else {
      setWorkOrdersFilters({ ...workOrdersFilters, status: newFilter });
      fetchWorkOrders({ ...workOrdersFilters, status: newFilter });
    }
  };

  const handleViewWorkOrder = (id: string) => {
    toast(`Viewing work order ${id} - Feature coming soon`);
  };

  const handleEditWorkOrder = (id: string) => {
    toast(`Editing work order ${id} - Feature coming soon`);
  };

  const handleDeleteWorkOrder = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this work order?')) {
      try {
        await deleteWorkOrder(id);
        toast.success('Work order deleted successfully');
      } catch (error) {
        toast.error('Failed to delete work order');
      }
    }
  };

  const handleCreateWorkOrder = () => {
    toast('Create Work Order - Feature coming soon');
  };

  const getStatusColor = (status: WorkOrder['status']) => {
    switch (status) {
      case 'PLANNED': return COLORS.background.steel;
      case 'RELEASED': return COLORS.secondary.amber;
      case 'IN_PROGRESS': return COLORS.status.inProgress;
      case 'COMPLETED': return COLORS.status.success;
      case 'CANCELLED': return COLORS.status.cancelled;
      case 'ON_HOLD': return COLORS.priority.urgent;
      default: return COLORS.background.steel;
    }
  };

  const getPriorityColor = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case 'LOW': return COLORS.priority.normal;
      case 'NORMAL': return COLORS.secondary.amber;
      case 'HIGH': return COLORS.priority.medium;
      case 'URGENT': return COLORS.priority.urgent;
      default: return COLORS.priority.normal;
    }
  };

  const filteredOrders = workOrders.filter(order => 
    filter === 'ALL' || order.status === filter
  );

  if (workOrdersError) {
    return (
      <DashboardLayout>
        <div style={{ padding: 20, textAlign: 'center' }}>
          <h1 style={{ color: COLORS.priority.urgent }}>Error loading work orders</h1>
          <p>{workOrdersError}</p>
          <button 
            onClick={() => fetchWorkOrders()}
            style={{ 
              background: COLORS.primary.blue, 
              color: 'white', 
              border: 'none', 
              borderRadius: 8, 
              padding: '12px 24px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.primary.navy, margin: 0 }}>
            Work Orders
          </h1>
          <button 
            onClick={handleCreateWorkOrder}
            style={{
              background: COLORS.primary.blue,
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Create Work Order
          </button>
        </div>

          {/* Filters */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {['ALL', 'PLANNED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: 'none',
                    background: filter === status ? COLORS.primary.blue : COLORS.background.white,
                    color: filter === status ? 'white' : COLORS.background.steel,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14
                  }}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Work Orders Table */}
          <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Order #</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Manufacturing Order</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Work Center</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Status</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Priority</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Assigned User</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Planned Dates</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 12px', fontWeight: 600, color: COLORS.primary.blue }}>
                      {order.orderNumber}
                    </td>
                    <td style={{ padding: '16px 12px' }}>{order.manufacturingOrder}</td>
                    <td style={{ padding: '16px 12px' }}>{order.workCenter}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: 20,
                        background: getStatusColor(order.status),
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: 20,
                        background: getPriorityColor(order.priority),
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {order.priority}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>{order.assignedUser}</td>
                    <td style={{ padding: '16px 12px', fontSize: 14 }}>
                      <div>{order.plannedStartDate}</div>
                      <div style={{ color: COLORS.background.steel }}>to {order.plannedEndDate}</div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{
                          padding: '6px 12px',
                          background: COLORS.primary.blue,
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}>
                          View
                        </button>
                        <button style={{
                          padding: '6px 12px',
                          background: COLORS.secondary.teal,
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};
