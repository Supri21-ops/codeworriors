import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { KpiCard } from '../components/KpiCard';
import { ChartBar } from '../components/ChartBar';
import { ChartDonut } from '../components/ChartDonut';
import { StockLedger } from '../components/StockLedger';
import type { StockItem } from '../components/StockLedger';
import { COLORS } from '../theme';

const sampleStock: StockItem[] = [
  { product: 'Dining Table', unitCost: 1200, unit: 'Unit', totalValue: 600000, onHand: 500, freeToUse: 270, incoming: 0, outgoing: 230 },
  { product: 'Drawer', unitCost: 100, unit: 'Unit', totalValue: 2000, onHand: 20, freeToUse: 20, incoming: 0, outgoing: 0 },
  { product: 'Screws', unitCost: 0.5, unit: 'Piece', totalValue: 500, onHand: 8, freeToUse: 8, incoming: 100, outgoing: 0 },
  { product: 'Glue', unitCost: 5, unit: 'Bottle', totalValue: 200, onHand: 2, freeToUse: 2, incoming: 10, outgoing: 0 },
];

const InventoryDashboard: React.FC = () => {
  const totalProducts = sampleStock.length;
  const lowStock = sampleStock.filter((s) => s.onHand <= 10).length;
  const incoming = sampleStock.reduce((acc, s) => acc + s.incoming, 0);
  const outgoing = sampleStock.reduce((acc, s) => acc + s.outgoing, 0);

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
            <ChartBar
              title="Top 5 Consumed Materials (Bar)"
              data={[
                { name: 'Screws', value: 1200 },
                { name: 'Glue', value: 400 },
                { name: 'Wood', value: 900 },
                { name: 'Paint', value: 600 },
                { name: 'Nails', value: 300 },
              ]}
            />
            <ChartDonut
              title="Stock Distribution (Donut)"
              data={[{ name: 'Raw Materials', value: 45 }, { name: 'Semi-Finished', value: 30 }, { name: 'Finished Goods', value: 25 }]}
            />
          </section>

          <section>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Stock Ledger</div>
            <StockLedger data={sampleStock} lowStockThreshold={10} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default InventoryDashboard;
