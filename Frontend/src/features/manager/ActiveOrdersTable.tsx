import React from 'react';
import { COLORS } from '../../theme';

export interface Order {
  id: string;
  reference: string;
  product: string;
  quantity: number;
  priority: number;
  deadline: string;
  status: string;
}

interface Props {
  data: Order[];
  onView?: (id: string) => void;
  onConfirm?: (id: string) => void;
}

const getPriorityColor = (priority: number) => {
  if (priority <= 10) return COLORS.priority.urgent;
  if (priority <= 49) return COLORS.priority.medium;
  return COLORS.priority.normal;
};

export const ActiveOrdersTable: React.FC<Props> = ({ data, onView, onConfirm }) => (
  <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', color: COLORS.background.steel }}>
          <th style={{ padding: 8 }}>Reference</th>
          <th style={{ padding: 8 }}>Product</th>
          <th style={{ padding: 8 }}>Quantity</th>
          <th style={{ padding: 8 }}>Priority</th>
          <th style={{ padding: 8 }}>Deadline</th>
          <th style={{ padding: 8 }}>Status</th>
          <th style={{ padding: 8 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((order) => (
          <tr key={order.id} style={{ borderTop: '1px solid #EEE' }}>
            <td style={{ padding: 8 }}>{order.reference}</td>
            <td style={{ padding: 8 }}>{order.product}</td>
            <td style={{ padding: 8 }}>{order.quantity}</td>
            <td style={{ padding: 8 }}>
              <span style={{ background: getPriorityColor(order.priority), color: '#fff', padding: '0.25rem 0.7rem', borderRadius: 999, fontWeight: 700, fontSize: 12 }}>{order.priority}</span>
            </td>
            <td style={{ padding: 8 }}>{order.deadline}</td>
            <td style={{ padding: 8 }}>{order.status}</td>
            <td style={{ padding: 8 }}>
              <button style={{ background: COLORS.primary.blue, color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontWeight: 600, marginRight: 6 }} onClick={() => onView && onView(order.id)}>View</button>
              <button style={{ background: COLORS.status.success, color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontWeight: 600 }} onClick={() => onConfirm && onConfirm(order.id)}>Confirm</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ActiveOrdersTable;
