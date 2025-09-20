import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { KpiCard } from '../../components/KpiCard';
import { COLORS } from '../../theme';
import { StockTable } from '../../features/inventory/StockTable';
import { TopConsumedBarChart } from '../../features/inventory/TopConsumedBarChart';
import { StockDonutChart } from '../../features/inventory/StockDonutChart';
import { 
  stockDashboardService, 
  type StockDashboardSummary,
  type TopConsumedItem,
  type StockDistribution,
  type StockTableItem,
  type LowStockAlert
} from '../../services/stock-dashboard.service';
import toast from 'react-hot-toast';

const StockDashboard: React.FC = () => {
  const [summary, setSummary] = useState<StockDashboardSummary | null>(null);
  const [topConsumed, setTopConsumed] = useState<TopConsumedItem[]>([]);
  const [distribution, setDistribution] = useState<StockDistribution[]>([]);
  const [stockData, setStockData] = useState<StockTableItem[]>([]);
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [summaryData, topConsumedData, distributionData, stockTableData, alertsData] = await Promise.all([
          stockDashboardService.getDashboardSummary(),
          stockDashboardService.getTopConsumedItems(5),
          stockDashboardService.getStockDistribution(),
          stockDashboardService.getStockTableData({ limit: 20 }),
          stockDashboardService.getLowStockAlerts()
        ]);

        setSummary(summaryData);
        setTopConsumed(topConsumedData);
        setDistribution(distributionData);
        setStockData(stockTableData.data);
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching stock dashboard data:', error);
        toast.error('Failed to load stock dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await stockDashboardService.acknowledgeAlert(alertId);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alert acknowledged');
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast.error('Failed to acknowledge alert');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div>Loading stock dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Stock Overview</h2>
        
        {/* Low Stock Alerts */}
        {alerts.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <div style={{ 
              background: '#FEF2F2', 
              border: '1px solid #FECACA', 
              borderRadius: 8, 
              padding: 12 
            }}>
              <h3 style={{ color: '#B91C1C', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                Stock Alerts ({alerts.length})
              </h3>
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '6px 0',
                  borderBottom: '1px solid #FECACA'
                }}>
                  <span style={{ fontSize: 13, color: '#7F1D1D' }}>
                    {alert.stockItem.name}: {alert.message}
                  </span>
                  <button
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                    style={{
                      background: '#DC2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      padding: '4px 8px',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* KPI Cards */}
        <section style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <KpiCard 
            label="Total Products in Stock" 
            value={summary?.totalProducts || 0} 
            color={COLORS.secondary.teal} 
          />
          <KpiCard 
            label="Low Stock Items" 
            value={summary?.lowStockItems || 0} 
            color={COLORS.priority.urgent} 
          />
          <KpiCard 
            label="Incoming Stock" 
            value={summary?.incomingStock || 0} 
            color={COLORS.primary.blue} 
          />
          <KpiCard 
            label="Outgoing Stock" 
            value={summary?.outgoingStock || 0} 
            color={COLORS.secondary.amber} 
          />
          {summary && (
            <KpiCard 
              label="Total Value" 
              value={`$${summary.totalValue.toLocaleString()}`} 
              color={COLORS.status.success} 
            />
          )}
        </section>

        {/* Charts */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginBottom: 20 }}>
          <TopConsumedBarChart data={topConsumed} />
          <StockDonutChart data={distribution} />
        </section>

        {/* Stock Table */}
        <section>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Stock Table</div>
          <StockTable data={stockData} />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default StockDashboard;
