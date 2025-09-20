import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import KpiRow, { KpiData } from '../../features/manager/KpiRow';
import OrdersByStatusChart, { StatusData } from '../../features/manager/OrdersByStatusChart';
import ThroughputLineChart, { ThroughputData } from '../../features/manager/ThroughputLineChart';
import ActiveOrdersTable, { Order } from '../../features/manager/ActiveOrdersTable';
import { COLORS } from '../../theme';

const mockKpi: KpiData = { total: 128, completed: 72, inProgress: 34, urgent: 6 };
const mockStatus: StatusData[] = [
  { status: 'Planned', count: 20 },
  { status: 'In Progress', count: 34 },
  { status: 'Done', count: 72 },
  { status: 'Cancelled', count: 2 },
];
const mockThroughput: ThroughputData[] = Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, value: Math.floor(Math.random() * 20 + 10) }));
const mockOrders: Order[] = [
  { id: 'MO-0001', reference: 'MO-0001', product: 'Dining Table', quantity: 3, priority: 8, deadline: '2025-09-30', status: 'Planned' },
  { id: 'MO-0002', reference: 'MO-0002', product: 'Drawer', quantity: 10, priority: 12, deadline: '2025-09-22', status: 'In Progress' },
  { id: 'MO-0003', reference: 'MO-0003', product: 'Chair', quantity: 25, priority: 45, deadline: '2025-10-05', status: 'Done' },
];

const DashboardPage: React.FC = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const [state, setState] = useState('');
  const [priority, setPriority] = useState('');
  const [product, setProduct] = useState('');

  // API fetch (mocked)
  useEffect(() => {
    // fetch(`/api/manufacturing?state=${state}&priority=${priority}&product=${product}`)
    //   .then(res => res.json())
    //   .then(data => setOrders(data.orders));
    // subscribe to mo.events (pseudo-code)
    // const sub = subscribe('mo.events', (event) => { ...update orders... });
    // return () => sub.unsubscribe();
  }, [state, priority, product]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <main style={{ padding: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Manufacturing Overview</h2>
          <KpiRow data={mockKpi} />
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <OrdersByStatusChart data={mockStatus} />
            <ThroughputLineChart data={mockThroughput} />
          </section>
          <section>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <select value={state} onChange={e => setState(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #eee' }}>
                <option value="">All States</option>
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #eee' }}>
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="medium">Medium</option>
                <option value="normal">Normal</option>
              </select>
              <input value={product} onChange={e => setProduct(e.target.value)} placeholder="Search Product" style={{ padding: 8, borderRadius: 8, border: '1px solid #eee', flex: 1 }} />
            </div>
            <ActiveOrdersTable data={orders} onView={id => window.location.href = `/manufacturing/orders/${id}`} onConfirm={id => alert(`Confirm order ${id}`)} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
