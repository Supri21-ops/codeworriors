import React from 'react';
import { COLORS } from '../../theme';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Raw Materials', value: 45 },
  { name: 'Semi-Finished', value: 30 },
  { name: 'Finished Goods', value: 25 },
];
const COLORS_LIST = [COLORS.secondary.teal, COLORS.secondary.amber, COLORS.primary.blue];

export const StockDonutChart: React.FC = () => (
  <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <div style={{ fontWeight: 700, marginBottom: 8 }}>Stock Distribution (Donut)</div>
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
            {data.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS_LIST[idx % COLORS_LIST.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);
