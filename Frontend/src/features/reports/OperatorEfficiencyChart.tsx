import React from 'react';
import { COLORS } from '../../theme';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface OperatorEfficiencyData {
  operatorId: string;
  operator: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  workCenter: {
    id: string;
    name: string;
    code: string;
  };
  expectedTime: number;
  actualTime: number;
  efficiency: number;
  tasksCompleted: number;
  onTimeCompletions: number;
}

interface Props {
  data?: OperatorEfficiencyData[];
}

const defaultData = [
  { name: 'Operator A', expected: 120, real: 110 },
  { name: 'Operator B', expected: 90, real: 100 },
  { name: 'Operator C', expected: 60, real: 55 },
  { name: 'Operator D', expected: 80, real: 70 },
];

export const OperatorEfficiencyChart: React.FC<Props> = ({ data }) => {
  // Convert OperatorEfficiencyData to chart format
  const chartData = data ? data.map(item => ({
    name: `${item.operator.firstName} ${item.operator.lastName}`,
    expected: Math.round(item.expectedTime / 60), // Convert minutes to hours
    real: Math.round(item.actualTime / 60)
  })) : defaultData;

  return (
    <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Operator Efficiency (Expected vs Real)</div>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expected" fill={COLORS.primary.blue} radius={[6,6,0,0]} />
            <Bar dataKey="real" fill={COLORS.status.success} radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
