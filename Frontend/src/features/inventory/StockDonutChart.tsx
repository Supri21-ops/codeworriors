import React from 'react';
import { COLORS } from '../../theme';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StockDistribution {
  category: 'RAW_MATERIALS' | 'SEMI_FINISHED' | 'FINISHED_GOODS';
  name: string;
  value: number;
  percentage: number;
}

interface Props {
  data?: StockDistribution[];
}

const defaultData = [
  { name: 'Raw Materials', value: 45 },
  { name: 'Semi-Finished', value: 30 },
  { name: 'Finished Goods', value: 25 },
];

const COLORS_LIST = [COLORS.secondary.teal, COLORS.secondary.amber, COLORS.primary.blue];

export const StockDonutChart: React.FC<Props> = ({ data }) => {
  // Convert StockDistribution to chart format
  const chartData = data ? data.map(item => ({
    name: item.name,
    value: item.value
  })) : defaultData;

  return (
    <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Stock Distribution (Donut)</div>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
              {chartData.map((_, idx) => (
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
};
