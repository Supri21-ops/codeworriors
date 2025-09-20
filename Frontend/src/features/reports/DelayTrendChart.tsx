import React from 'react';
import { COLORS } from '../../theme';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const delaysTrend = Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, delay: Math.round(Math.random() * 4) }));

export const DelayTrendChart: React.FC = () => (
  <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <div style={{ fontWeight: 700, marginBottom: 8 }}>Delays Trend (Last 30 Days)</div>
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <LineChart data={delaysTrend}>
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
