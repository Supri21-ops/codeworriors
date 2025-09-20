import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { KpiCard } from '../../components/KpiCard';
import { COLORS } from '../../theme';
import { DelayTrendChart } from '../../features/reports/DelayTrendChart';
import { OperatorEfficiencyChart } from '../../features/reports/OperatorEfficiencyChart';
import { WorkOrderAnalysisTable } from '../../features/reports/WorkOrderAnalysisTable';
import { ExportButtons } from '../../features/reports/ExportButtons';

const ReportsPage: React.FC = () => {
  // Mock KPI data
  const completedOnTime = 78; // %
  const avgDelay = 1.2; // hours
  const operatorEff = 92; // %

  // Filters
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [operator, setOperator] = useState('');
  const [workCenter, setWorkCenter] = useState('');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <main style={{ padding: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Production Analytics</h2>
          <section style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <KpiCard label="Orders Completed On Time (%)" value={completedOnTime} color={COLORS.status.success} />
            <KpiCard label="Average Delay (hours)" value={avgDelay} color={COLORS.priority.urgent} />
            <KpiCard label="Operator Efficiency (%)" value={operatorEff} color={COLORS.secondary.indigo} />
          </section>
          <section style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div>
              <label>Date Range: </label>
              <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} />
              <span> - </span>
              <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} />
            </div>
            <div>
              <label>Operator: </label>
              <input type="text" value={operator} onChange={e => setOperator(e.target.value)} placeholder="All" />
            </div>
            <div>
              <label>Work Center: </label>
              <input type="text" value={workCenter} onChange={e => setWorkCenter(e.target.value)} placeholder="All" />
            </div>
          </section>
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <DelayTrendChart />
            <OperatorEfficiencyChart />
          </section>
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Work Order Analysis</div>
              <ExportButtons from={dateRange.from} to={dateRange.to} />
            </div>
            <WorkOrderAnalysisTable operator={operator} workCenter={workCenter} from={dateRange.from} to={dateRange.to} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
