import React from 'react';
import { COLORS } from '../../theme';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface DelayTrendData {
  date: string;
  delay: number;
  workOrdersCount: number;
  onTimeCount: number;
  delayedCount: number;
}

interface Props {
  data?: DelayTrendData[];
}

const defaultData = Array.from({ length: 30 }, (_, i) => ({ 
  day: `Day ${i + 1}`, 
  delay: Math.round(Math.random() * 4) 
}));

export const DelayTrendChart: React.FC<Props> = ({ data }) => {
  // Convert DelayTrendData to chart format
  const chartData = data ? data.map((item, index) => ({
    day: `Day ${index + 1}`,
    delay: item.delay
  })) : defaultData;

  return (
    <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Delays Trend (Last 30 Days)</div>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="delay" stroke={COLORS.priority.urgent} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
