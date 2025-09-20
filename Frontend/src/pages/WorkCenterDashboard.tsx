import React from 'react';
// Sidebar provided by app layout; remove local Sidebar import
import { Topbar } from '../components/Topbar';
import { KpiCard } from '../components/KpiCard';
import { ChartBar } from '../components/ChartBar';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { COLORS } from '../theme';

const workCenters = [
  { name: 'Work Center -1', currentTask: 'Assembly', utilization: 85, cost: 50, status: 'Active', downtime: 2 },
  { name: 'Work Center -2', currentTask: 'Cutting', utilization: 60, cost: 40, status: 'Active', downtime: 0 },
  { name: 'Work Center -3', currentTask: 'Painting', utilization: 30, cost: 35, status: 'Inactive', downtime: 12 },
  { name: 'Work Center -4', currentTask: 'Polishing', utilization: 50, cost: 45, status: 'Active', downtime: 5 },
];

const costData = workCenters.map(wc => ({ name: wc.name, value: wc.cost }));

const WorkCenterDashboard: React.FC = () => {
  const totalCenters = workCenters.length;
  const activeCenters = workCenters.filter(wc => wc.status === 'Active').length;
  const downtime = workCenters.reduce((acc, wc) => acc + wc.downtime, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      <div style={{ flex: 1 }}>
        <Topbar />
        <main style={{ padding: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Work Center Utilization</h2>

          <section style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <KpiCard label="Total Work Centers" value={totalCenters} color={COLORS.primary.blue} />
            <KpiCard label="Active Work Centers" value={activeCenters} color={COLORS.status.success} />
            <KpiCard label="Downtime Hours" value={downtime} color={COLORS.priority.urgent} />
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginBottom: 20 }}>
            <ChartPlaceholder title="Work Center Usage (Heatmap)" />
            <ChartBar title="Cost per Work Center (Bar)" data={costData} />
          </section>

          <section>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Work Centers</div>
            <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: COLORS.background.steel }}>
                    <th style={{ padding: 8 }}>Name</th>
                    <th style={{ padding: 8 }}>Current Task</th>
                    <th style={{ padding: 8 }}>Utilization %</th>
                    <th style={{ padding: 8 }}>Cost/hour</th>
                    <th style={{ padding: 8 }}>Status</th>
                    <th style={{ padding: 8 }}>Downtime (hrs)</th>
                  </tr>
                </thead>
                <tbody>
                  {workCenters.map((wc) => (
                    <tr key={wc.name} style={{ borderTop: '1px solid #EEE' }}>
                      <td style={{ padding: 8 }}>{wc.name}</td>
                      <td style={{ padding: 8 }}>{wc.currentTask}</td>
                      <td style={{ padding: 8 }}>{wc.utilization}%</td>
                      <td style={{ padding: 8 }}>{wc.cost}</td>
                      <td style={{ padding: 8 }}>{wc.status}</td>
                      <td style={{ padding: 8, color: wc.downtime > 10 ? COLORS.priority.urgent : 'inherit', fontWeight: wc.downtime > 10 ? 700 : 400 }}>{wc.downtime}</td>
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

export default WorkCenterDashboard;
