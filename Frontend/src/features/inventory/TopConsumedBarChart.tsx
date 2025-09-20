import React from 'react';
import { COLORS } from '../../theme';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Screws', value: 1200 },
  { name: 'Glue', value: 400 },
  { name: 'Wood', value: 900 },
  { name: 'Paint', value: 600 },
  { name: 'Nails', value: 300 },
];

export const TopConsumedBarChart: React.FC = () => (
  <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <div style={{ fontWeight: 700, marginBottom: 8 }}>Top 5 Consumed Materials (Monthly)</div>
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={COLORS.primary.blue} radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
