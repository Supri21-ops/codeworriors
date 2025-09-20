import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { KpiCard } from '../../components/KpiCard';
import { COLORS } from '../../theme';
import { DelayTrendChart } from '../../features/reports/DelayTrendChart';
import { OperatorEfficiencyChart } from '../../features/reports/OperatorEfficiencyChart';
import { WorkOrderAnalysisTable } from '../../features/reports/WorkOrderAnalysisTable';

import { 
  reportsService, 
  type ReportSummary,
  type DelayTrendData,
  type OperatorEfficiencyData,
  type WorkOrderAnalysisData,
  type ReportFilters
} from '../../services/reports.service';
import toast from 'react-hot-toast';

const ReportsPage: React.FC = () => {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [delayTrend, setDelayTrend] = useState<DelayTrendData[]>([]);
  const [operatorEfficiency, setOperatorEfficiency] = useState<OperatorEfficiencyData[]>([]);
  const [workOrderAnalysis, setWorkOrderAnalysis] = useState<WorkOrderAnalysisData[]>([]);
  const [availableOperators, setAvailableOperators] = useState<Array<{ id: string; firstName: string; lastName: string; employeeId: string }>>([]);
  const [availableWorkCenters, setAvailableWorkCenters] = useState<Array<{ id: string; name: string; code: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [operator, setOperator] = useState('');
  const [workCenter, setWorkCenter] = useState('');

  // Fetch data when component mounts or filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const filters: ReportFilters = {
          dateFrom: dateRange.from || undefined,
          dateTo: dateRange.to || undefined,
          operatorId: operator || undefined,
          workCenterId: workCenter || undefined
        };

        // Fetch all data in parallel
        const [summaryData, delayTrendData, operatorEfficiencyData, workOrderAnalysisData, operatorsData, workCentersData] = await Promise.all([
          reportsService.getReportSummary(filters),
          reportsService.getDelayTrend(filters),
          reportsService.getOperatorEfficiency(filters),
          reportsService.getWorkOrderAnalysis(filters),
          reportsService.getAvailableOperators(),
          reportsService.getAvailableWorkCenters()
        ]);

        setSummary(summaryData);
        setDelayTrend(delayTrendData);
        setOperatorEfficiency(operatorEfficiencyData);
        setWorkOrderAnalysis(workOrderAnalysisData.data);
        setAvailableOperators(operatorsData);
        setAvailableWorkCenters(workCentersData);
      } catch (error) {
        console.error('Error fetching reports data:', error);
        toast.error('Failed to load reports data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange.from, dateRange.to, operator, workCenter]);

  const handleExport = async (format: 'EXCEL' | 'PDF' | 'CSV') => {
    try {
      await reportsService.downloadReport({
        format,
        reportType: 'WORK_ORDER_ANALYSIS',
        filters: {
          dateFrom: dateRange.from || undefined,
          dateTo: dateRange.to || undefined,
          operatorId: operator || undefined,
          workCenterId: workCenter || undefined
        },
        fileName: `work_order_analysis_${new Date().toISOString().split('T')[0]}`
      });
      toast.success(`Report exported as ${format}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div>Loading reports...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main style={{ padding: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Production Analytics</h2>
        
        {/* KPI Cards */}
        <section style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <KpiCard 
            label="Orders Completed On Time (%)" 
            value={summary?.ordersCompletedOnTime || 0} 
            color={COLORS.status.success} 
          />
          <KpiCard 
            label="Average Delay (hours)" 
            value={summary?.averageDelay || 0} 
            color={COLORS.priority.urgent} 
          />
          <KpiCard 
            label="Operator Efficiency (%)" 
            value={summary?.operatorEfficiency || 0} 
            color={COLORS.secondary.indigo} 
          />
          {summary && (
            <KpiCard 
              label="Active Operators" 
              value={`${summary.activeOperators}/${summary.totalOperators}`} 
              color={COLORS.primary.blue} 
            />
          )}
        </section>

        {/* Filters */}
        <section style={{ display: 'flex', gap: 16, marginBottom: 20, padding: 16, background: COLORS.background.white, borderRadius: 8 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600 }}>Date Range:</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input 
                type="date" 
                value={dateRange.from} 
                onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
                style={{ padding: '6px 8px', border: '1px solid #D1D5DB', borderRadius: 4 }}
              />
              <span>—</span>
              <input 
                type="date" 
                value={dateRange.to} 
                onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
                style={{ padding: '6px 8px', border: '1px solid #D1D5DB', borderRadius: 4 }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600 }}>Operator:</label>
            <select 
              value={operator} 
              onChange={e => setOperator(e.target.value)}
              style={{ padding: '6px 8px', border: '1px solid #D1D5DB', borderRadius: 4, minWidth: 120 }}
            >
              <option value="">All Operators</option>
              {availableOperators.map(op => (
                <option key={op.id} value={op.id}>
                  {op.firstName} {op.lastName} ({op.employeeId})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600 }}>Work Center:</label>
            <select 
              value={workCenter} 
              onChange={e => setWorkCenter(e.target.value)}
              style={{ padding: '6px 8px', border: '1px solid #D1D5DB', borderRadius: 4, minWidth: 120 }}
            >
              <option value="">All Work Centers</option>
              {availableWorkCenters.map(wc => (
                <option key={wc.id} value={wc.id}>
                  {wc.name} ({wc.code})
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Charts */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <DelayTrendChart data={delayTrend} />
          <OperatorEfficiencyChart data={operatorEfficiency} />
        </section>

        {/* Work Order Analysis */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Work Order Analysis</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleExport('EXCEL')}
                style={{
                  padding: '6px 12px',
                  background: COLORS.status.success,
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Export Excel
              </button>
              <button
                onClick={() => handleExport('PDF')}
                style={{
                  padding: '6px 12px',
                  background: COLORS.priority.urgent,
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Export PDF
              </button>
              <button
                onClick={() => handleExport('CSV')}
                style={{
                  padding: '6px 12px',
                  background: COLORS.primary.blue,
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Export CSV
              </button>
            </div>
          </div>
          <WorkOrderAnalysisTable 
            data={workOrderAnalysis}
            operator={operator} 
            workCenter={workCenter} 
            from={dateRange.from} 
            to={dateRange.to} 
          />
        </section>
      </main>
    </DashboardLayout>
  );
};

export default ReportsPage;
