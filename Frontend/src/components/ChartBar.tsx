import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  data: { name: string; value: number }[];
  title?: string;
}

export const ChartBar: React.FC<Props> = ({ data, title }) => {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {title && <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>}
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#1A73E8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartBar;
