import React from 'react';
// Sidebar provided by layout; remove local Sidebar import
import { Topbar } from '../components/Topbar';
import { KpiCard } from '../components/KpiCard';
import { ChartBar } from '../components/ChartBar';
import { COLORS } from '../theme';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Button } from '../components/ui/Button';

const delaysTrend = Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, delay: Math.round(Math.random() * 4) }));
const efficiencyData = [
  { name: 'WO-001', expected: 120, real: 110 },
  { name: 'WO-002', expected: 90, real: 100 },
  { name: 'WO-003', expected: 60, real: 55 },
  { name: 'WO-004', expected: 80, real: 70 },
];
const workOrders = [
  { operation: 'Assembly', workCenter: 'WC-1', expected: 120, real: 110 },
  { operation: 'Cutting', workCenter: 'WC-2', expected: 90, real: 100 },
  { operation: 'Painting', workCenter: 'WC-3', expected: 60, real: 55 },
  { operation: 'Polishing', workCenter: 'WC-4', expected: 80, real: 70 },
];

const ReportsDashboard: React.FC = () => {
  const completedOnTime = 78; // %
  const avgDelay = 1.2; // hours
  const operatorEff = 92; // %

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      <div style={{ flex: 1 }}>
        <Topbar />
        <main style={{ padding: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Production Analytics</h2>

          <section style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <KpiCard label="Orders Completed On Time (%)" value={completedOnTime} color={COLORS.status.success} />
            <KpiCard label="Average Delay (hours)" value={avgDelay} color={COLORS.priority.urgent} />
            <KpiCard label="Operator Efficiency (%)" value={operatorEff} color={COLORS.secondary.indigo} />
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
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
            <ChartBar title="Operator Efficiency (Expected vs Real)" data={efficiencyData.map(d => ({ name: d.name, value: Math.round((d.real / d.expected) * 100) }))} />
          </section>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Work Order Analysis</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="ghost">Export Excel</Button>
                <Button variant="ghost">Export PDF</Button>
              </div>
            </div>
            <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: COLORS.background.steel }}>
                    <th style={{ padding: 8 }}>Operation</th>
                    <th style={{ padding: 8 }}>Work Center</th>
                    <th style={{ padding: 8 }}>Expected Time</th>
                    <th style={{ padding: 8 }}>Real Time</th>
                    <th style={{ padding: 8 }}>Efficiency %</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrders.map((wo, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #EEE' }}>
                      <td style={{ padding: 8 }}>{wo.operation}</td>
                      <td style={{ padding: 8 }}>{wo.workCenter}</td>
                      <td style={{ padding: 8 }}>{wo.expected}</td>
                      <td style={{ padding: 8 }}>{wo.real}</td>
                      <td style={{ padding: 8, color: wo.real > wo.expected ? COLORS.priority.urgent : COLORS.status.success, fontWeight: 700 }}>
                        {Math.round((wo.real / wo.expected) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ReportsDashboard;
