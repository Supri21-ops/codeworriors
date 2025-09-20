import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { KpiCard } from '../components/KpiCard';
import { TaskList } from '../components/TaskList';
import type { Task } from '../components/TaskList';
import { MiniCalendar } from '../components/MiniCalendar';
import { COLORS } from '../theme';

const sampleTasks: Task[] = [
  { id: 'WO-001', operation: 'Assembly-1', workCenter: 'Work Center -1', status: 'To Do', priority: 'normal' },
  { id: 'WO-002', operation: 'Cutting', workCenter: 'Work Center -2', status: 'Started', priority: 'urgent' },
  { id: 'WO-003', operation: 'Painting', workCenter: 'Work Center -3', status: 'Paused', priority: 'medium' },
];

const OperatorDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>My Work Orders</h2>

        <section style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <KpiCard label="Assigned Work Orders" value={12} color={COLORS.primary.blue} />
          <KpiCard label="Completed Today" value={4} color={COLORS.status.success} />
          <KpiCard label="Delayed Tasks" value={1} color={COLORS.priority.urgent} />
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          <TaskList tasks={sampleTasks} />
          <MiniCalendar />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default OperatorDashboard;
