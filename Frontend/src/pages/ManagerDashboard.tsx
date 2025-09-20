import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { KpiCard } from '../components/KpiCard';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { OrdersTable } from '../components/OrdersTable';
import type { Order } from '../components/OrdersTable';
import { COLORS } from '../theme';

const sampleOrders: Order[] = [
  { id: 'MO-0001', product: 'Dining Table', quantity: 3, priority: 'normal', deadline: '2025-09-30', status: 'To Do' },
  { id: 'MO-0002', product: 'Drawer', quantity: 10, priority: 'urgent', deadline: '2025-09-22', status: 'In Progress' },
  { id: 'MO-0003', product: 'Chair', quantity: 25, priority: 'medium', deadline: '2025-10-05', status: 'Planned' },
];

const ManagerDashboard: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <main style={{ padding: 20 }}>
          <section style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <KpiCard label="Total Manufacturing Orders" value={128} color={COLORS.primary.blue} />
            <KpiCard label="Orders Completed" value={72} color={COLORS.status.success} />
            <KpiCard label="Orders In Progress" value={34} color={COLORS.secondary.amber} />
            <KpiCard label="Urgent Orders" value={6} color={COLORS.priority.urgent} />
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <ChartPlaceholder title="Orders by Status (Bar)" />
            <ChartPlaceholder title="Production Throughput (Line)" />
          </section>

          <section>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Active Manufacturing Orders</div>
            <OrdersTable data={sampleOrders} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
