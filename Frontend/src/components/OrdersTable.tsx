import React from 'react';
import { COLORS } from '../theme';

export type Order = {
  id: string;
  product: string;
  quantity: number;
  priority: 'urgent' | 'medium' | 'normal';
  deadline: string;
  status: string;
};

interface OrdersTableProps {
  data: Order[];
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ data }) => {
  const priorityColor = (p: Order['priority']) => {
    if (p === 'urgent') return COLORS.priority.urgent;
    if (p === 'medium') return COLORS.priority.medium;
    return COLORS.priority.normal;
  };

  return (
    <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: COLORS.background.steel }}>
            <th style={{ padding: '0.6rem' }}>Order ID</th>
            <th style={{ padding: '0.6rem' }}>Product</th>
            <th style={{ padding: '0.6rem' }}>Quantity</th>
            <th style={{ padding: '0.6rem' }}>Priority</th>
            <th style={{ padding: '0.6rem' }}>Deadline</th>
            <th style={{ padding: '0.6rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id} style={{ borderTop: '1px solid #EEE' }}>
              <td style={{ padding: '0.6rem' }}>{d.id}</td>
              <td style={{ padding: '0.6rem' }}>{d.product}</td>
              <td style={{ padding: '0.6rem' }}>{d.quantity}</td>
              <td style={{ padding: '0.6rem' }}>
                <span style={{ padding: '0.25rem 0.6rem', borderRadius: 999, background: priorityColor(d.priority), color: '#fff', fontWeight: 700, fontSize: 12 }}>{d.priority}</span>
              </td>
              <td style={{ padding: '0.6rem' }}>{d.deadline}</td>
              <td style={{ padding: '0.6rem' }}>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
