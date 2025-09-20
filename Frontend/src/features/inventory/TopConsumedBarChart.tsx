import React from 'react';
import { COLORS } from '../../theme';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TopConsumedItem {
  id: string;
  name: string;
  consumed: number;
  unit: string;
  percentage: number;
}

interface Props {
  data?: TopConsumedItem[];
}

const defaultData = [
  { name: 'Screws', value: 1200 },
  { name: 'Glue', value: 400 },
  { name: 'Wood', value: 900 },
  { name: 'Paint', value: 600 },
  { name: 'Nails', value: 300 },
];

export const TopConsumedBarChart: React.FC<Props> = ({ data }) => {
  // Convert TopConsumedItem to chart format
  const chartData = data ? data.map(item => ({
    name: item.name,
    value: item.consumed
  })) : defaultData;

  return (
    <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Top 5 Consumed Materials (Monthly)</div>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
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
};
