import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', planned: 120, actual: 110 },
  { name: 'Feb', planned: 150, actual: 145 },
  { name: 'Mar', planned: 180, actual: 175 },
  { name: 'Apr', planned: 200, actual: 195 },
  { name: 'May', planned: 220, actual: 210 },
  { name: 'Jun', planned: 250, actual: 245 },
  { name: 'Jul', planned: 280, actual: 275 },
];

export const ProductionChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="planned" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Planned"
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Actual"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
