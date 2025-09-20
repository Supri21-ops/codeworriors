import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { COLORS } from '../../theme';

export interface StatusData {
  status: string;
  count: number;
}

interface Props {
  data: StatusData[];
}

export const OrdersByStatusChart: React.FC<Props> = ({ data }) => (
  <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <div style={{ fontWeight: 700, marginBottom: 8 }}>Orders by Status</div>
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="status" />
          <Tooltip />
          <Bar dataKey="count" fill={COLORS.primary.blue} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default OrdersByStatusChart;
