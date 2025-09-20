import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { COLORS } from '../../theme';

interface Props {
  data: { name: string; cost: number }[];
}

export const CostBarChart: React.FC<Props> = ({ data }) => (
  <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <div style={{ fontWeight: 700, marginBottom: 8 }}>Cost per Work Center (₹/hr)</div>
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cost" fill={COLORS.secondary.amber} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default CostBarChart;
