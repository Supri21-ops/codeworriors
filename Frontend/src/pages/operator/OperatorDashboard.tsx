import React, { useEffect, useState } from 'react';
// Sidebar provided by layout; remove local Sidebar import
import { Topbar } from '../../components/Topbar';
import WorkOrderList from '../../features/operator/WorkOrderList';
import type { WorkOrder } from '../../features/operator/WorkOrderRow';
import { KpiCard } from '../../components/KpiCard';
import { COLORS } from '../../theme';

const mockWorkOrders: WorkOrder[] = [
  { id: 'WO-001', operation: 'Assembly-1', workCenter: 'Work Center -1', expected: 180, real: 0, status: 'To Do', urgent: true },
  { id: 'WO-002', operation: 'Cutting', workCenter: 'Work Center -2', expected: 120, real: 60, status: 'Started', delayed: true },
  { id: 'WO-003', operation: 'Painting', workCenter: 'Work Center -3', expected: 90, real: 90, status: 'Done' },
];

const OperatorDashboard: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);

  // API fetch (mocked)
  useEffect(() => {
    // fetch(`/api/workorders?assignee=userId&status=`)
    //   .then(res => res.json())
    //   .then(data => setWorkOrders(data.orders));
    // subscribe to wo.events (pseudo-code)
    // const sub = subscribe('wo.events', (event) => { ...update workOrders... });
    // return () => sub.unsubscribe();
  }, []);

  const handleStart = (id: string) => {
    // POST /api/workorders/:id/start
    setWorkOrders(wos => wos.map(wo => wo.id === id ? { ...wo, status: 'Started' } : wo));
  };
  const handlePause = (id: string) => {
    // POST /api/workorders/:id/pause
    setWorkOrders(wos => wos.map(wo => wo.id === id ? { ...wo, status: 'Paused' } : wo));
  };
  const handleComplete = (id: string, elapsed: number) => {
    // POST /api/workorders/:id/complete { elapsed }
    setWorkOrders(wos => wos.map(wo => wo.id === id ? { ...wo, status: 'Done', real: elapsed } : wo));
  };

  const assigned = workOrders.length;
  const completedToday = workOrders.filter(wo => wo.status === 'Done').length;
  const delayed = workOrders.filter(wo => wo.delayed).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      <div style={{ flex: 1 }}>
        <Topbar />
        <main style={{ padding: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>My Work Orders</h2>
          <section style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <KpiCard label="Assigned Work Orders" value={assigned} color={COLORS.primary.blue} />
            <KpiCard label="Completed Today" value={completedToday} color={COLORS.status.success} />
            <KpiCard label="Delayed Tasks" value={delayed} color={COLORS.secondary.amber} />
          </section>
          <WorkOrderList workOrders={workOrders} onStart={handleStart} onPause={handlePause} onComplete={handleComplete} />
        </main>
      </div>
    </div>
  );
};

export default OperatorDashboard;
