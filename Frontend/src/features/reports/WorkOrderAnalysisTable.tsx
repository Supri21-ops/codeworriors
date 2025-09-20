import React from 'react';
import { COLORS } from '../../theme';

export type WorkOrderRow = {
  operation: string;
  workCenter: string;
  product: string;
  quantity: number;
  expected: number;
  real: number;
  status: 'To Do' | 'In Progress' | 'Done' | 'Cancelled';
};

interface WorkOrderAnalysisData {
  id: string;
  orderNumber: string;
  operation: string;
  workCenter: {
    id: string;
    name: string;
    code: string;
  };
  operator: {
    id: string;
    firstName: string;
    lastName: string;
  };
  product: {
    id: string;
    name: string;
    sku: string;
  };
  quantity: number;
  expectedDuration: number;
  actualDuration: number;
  efficiency: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
  startTime: string;
  endTime?: string;
  delayTime?: number;
  delayReason?: string;
  qualityScore?: number;
  cost: {
    labor: number;
    material: number;
    overhead: number;
    total: number;
  };
}

const mockOrders: WorkOrderRow[] = [
  { operation: 'Assembly-1', workCenter: 'Work Center -1', product: 'Dining Table', quantity: 3, expected: 180, real: 0, status: 'To Do' },
  { operation: 'Cutting-1', workCenter: 'Work Center -2', product: 'Dining Table', quantity: 3, expected: 120, real: 45, status: 'In Progress' },
  { operation: 'Sanding-1', workCenter: 'Work Center -3', product: 'Dining Table', quantity: 3, expected: 90, real: 90, status: 'Done' },
  { operation: 'Painting-1', workCenter: 'Work Center -4', product: 'Dining Table', quantity: 3, expected: 60, real: 0, status: 'To Do' },
];

interface Props {
  data?: WorkOrderAnalysisData[];
  operator?: string;
  workCenter?: string;
  from?: string;
  to?: string;
}

export const WorkOrderAnalysisTable: React.FC<Props> = ({ data }) => {
  // Convert WorkOrderAnalysisData to table format or use mock data
  const tableData = data ? data.map(item => ({
    operation: item.operation,
    workCenter: item.workCenter.name,
    product: item.product.name,
    quantity: item.quantity,
    expected: Math.round(item.expectedDuration / 60), // Convert minutes to hours
    real: Math.round(item.actualDuration / 60),
    status: item.status === 'COMPLETED' ? 'Done' : 
            item.status === 'IN_PROGRESS' ? 'In Progress' : 
            item.status === 'CANCELLED' ? 'Cancelled' : 'To Do'
  })) : mockOrders;

  // Calculate totals
  const totalExpected = tableData.reduce((sum, item) => sum + item.expected, 0);
  const totalReal = tableData.reduce((sum, item) => sum + item.real, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do':
        return { bg: COLORS.background.lightGray, text: COLORS.text.primary };
      case 'In Progress':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'Done':
        return { bg: COLORS.status.success, text: 'white' };
      case 'Cancelled':
        return { bg: COLORS.priority.urgent, text: 'white' };
      default:
        return { bg: COLORS.background.lightGray, text: COLORS.text.primary };
    }
  };

  return (
    <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: COLORS.background.steel }}>
            <th style={{ padding: 8 }}>Operation</th>
            <th style={{ padding: 8 }}>Work Center</th>
            <th style={{ padding: 8 }}>Product</th>
            <th style={{ padding: 8 }}>Quantity</th>
            <th style={{ padding: 8 }}>Expected Duration</th>
            <th style={{ padding: 8 }}>Real Duration</th>
            <th style={{ padding: 8 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((wo, idx) => {
            const statusColors = getStatusColor(wo.status);
            return (
              <tr key={idx} style={{ borderTop: '1px solid #EEE' }}>
                <td style={{ padding: 8 }}>{wo.operation}</td>
                <td style={{ padding: 8 }}>{wo.workCenter}</td>
                <td style={{ padding: 8 }}>{wo.product}</td>
                <td style={{ padding: 8 }}>{wo.quantity}</td>
                <td style={{ padding: 8 }}>{formatDuration(wo.expected)}</td>
                <td style={{ padding: 8 }}>{formatDuration(wo.real)}</td>
                <td style={{ padding: 8 }}>
                  <span style={{
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {wo.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        {/* Totals Row */}
        <tfoot style={{ backgroundColor: '#F9FAFB' }}>
          <tr>
            <td style={{ padding: 8, fontWeight: 'bold' }} colSpan={4}>Total</td>
            <td style={{ padding: 8, fontWeight: 'bold' }}>{formatDuration(totalExpected)}</td>
            <td style={{ padding: 8, fontWeight: 'bold' }}>{formatDuration(totalReal)}</td>
            <td style={{ padding: 8 }}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
