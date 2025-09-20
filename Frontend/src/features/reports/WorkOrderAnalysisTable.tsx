import React from 'react';
import { COLORS } from '../../theme';

export type WorkOrderRow = {
  operation: string;
  workCenter: string;
  product: string;
  quantity: number;
  expected: number;
  real: number;
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
  { operation: 'Assembly', workCenter: 'WC-1', product: 'Table', quantity: 3, expected: 120, real: 110 },
  { operation: 'Cutting', workCenter: 'WC-2', product: 'Drawer', quantity: 10, expected: 90, real: 100 },
  { operation: 'Painting', workCenter: 'WC-3', product: 'Chair', quantity: 25, expected: 60, real: 55 },
  { operation: 'Polishing', workCenter: 'WC-4', product: 'Cabinet', quantity: 5, expected: 80, real: 70 },
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
    real: Math.round(item.actualDuration / 60)
  })) : mockOrders;

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
            <th style={{ padding: 8 }}>Efficiency %</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((wo, idx) => (
            <tr key={idx} style={{ borderTop: '1px solid #EEE' }}>
              <td style={{ padding: 8 }}>{wo.operation}</td>
              <td style={{ padding: 8 }}>{wo.workCenter}</td>
              <td style={{ padding: 8 }}>{wo.product}</td>
              <td style={{ padding: 8 }}>{wo.quantity}</td>
              <td style={{ padding: 8 }}>{wo.expected}</td>
              <td style={{ padding: 8 }}>{wo.real}</td>
              <td style={{ padding: 8, color: wo.real > wo.expected ? COLORS.priority.urgent : COLORS.status.success, fontWeight: 700 }}>
                {Math.round((wo.real / wo.expected) * 100)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
