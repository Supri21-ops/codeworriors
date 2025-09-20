import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { KpiCard } from '../../components/KpiCard';
import { COLORS } from '../../theme';
import { StockTable } from '../../features/inventory/StockTable';
import { TopConsumedBarChart } from '../../features/inventory/TopConsumedBarChart';
import { StockDonutChart } from '../../features/inventory/StockDonutChart';

const StockDashboard: React.FC = () => {
  // Mock KPI data
  const totalProducts = 12;
  const lowStock = 2;
  const incoming = 120;
  const outgoing = 80;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <main style={{ padding: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Stock Overview</h2>
          <section style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <KpiCard label="Total Products in Stock" value={totalProducts} color={COLORS.secondary.teal} />
            <KpiCard label="Low Stock Items" value={lowStock} color={COLORS.priority.urgent} />
            <KpiCard label="Incoming Stock" value={incoming} color={COLORS.primary.blue} />
            <KpiCard label="Outgoing Stock" value={outgoing} color={COLORS.secondary.amber} />
          </section>
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginBottom: 20 }}>
            <TopConsumedBarChart />
            <StockDonutChart />
          </section>
          <section>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Stock Table</div>
            <StockTable />
          </section>
        </main>
      </div>
    </div>
  );
};

export default StockDashboard;
