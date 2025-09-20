import React, { useEffect, useState } from 'react';
// Sidebar is provided by the main layout; remove local Sidebar import
import { Topbar } from '../../components/Topbar';
import { KpiCard } from '../../components/KpiCard';
import UtilizationHeatmap from '../../features/workcenter/UtilizationHeatmap';
import CostBarChart from '../../features/workcenter/CostBarChart';
import WorkCenterTable from '../../features/workcenter/WorkCenterTable';
import type { WorkCenter } from '../../features/workcenter/WorkCenterTable';
import { COLORS } from '../../theme';

const API_URL = '/api/workcenters';
const DOWNTIME_THRESHOLD = 10;

const WorkCenterDashboard: React.FC = () => {
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [heatmapData, setHeatmapData] = useState<Array<{ name: string; usage: number[] }>>([]);

  // Fetch work centers
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setWorkCenters(data.centers);
  setHeatmapData(data.centers.map((wc: WorkCenter) => ({ name: wc.name, usage: wc.usage })));
      });
    // Subscribe to events (pseudo-code)
    // const sub = subscribe('workcenter.events', (event) => { ...update state... });
    // return () => sub.unsubscribe();
  }, []);

  // POST downtime
  const handleDowntime = (id: string) => {
    fetch(`${API_URL}/${id}/downtime`, { method: 'POST' })
      .then(() => {
        setWorkCenters((prev) => prev.map((wc) => wc.id === id ? { ...wc, downtime: wc.downtime + 1 } : wc));
      });
  };

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
            <UtilizationHeatmap data={heatmapData} />
            <CostBarChart data={workCenters.map(wc => ({ name: wc.name, cost: wc.cost }))} />
          </section>

          <section>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Work Centers</div>
            <WorkCenterTable data={workCenters} downtimeThreshold={DOWNTIME_THRESHOLD} onDowntime={handleDowntime} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default WorkCenterDashboard;
