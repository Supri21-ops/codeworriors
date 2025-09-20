import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  data: { name: string; value: number }[];
  title?: string;
  colors?: string[];
}

export const ChartDonut: React.FC<Props> = ({ data, title, colors = ['#6C63FF', '#00BFA6', '#FFB300'] }) => {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {title && <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>}
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Tooltip />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4} label>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartDonut;
