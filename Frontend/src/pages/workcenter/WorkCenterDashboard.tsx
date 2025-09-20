import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { KpiCard } from '../../components/KpiCard';
import UtilizationHeatmap from '../../features/workcenter/UtilizationHeatmap';
import CostBarChart from '../../features/workcenter/CostBarChart';
import WorkCenterTable from '../../features/workcenter/WorkCenterTable';
import type { WorkCenter as UIWorkCenter } from '../../features/workcenter/WorkCenterTable';
import { COLORS } from '../../theme';
import { workCenterService, WorkCenter } from '../../services/workcenter.service';
import { toast } from 'react-hot-toast';

const DOWNTIME_THRESHOLD = 10;

const WorkCenterDashboard: React.FC = () => {
  const [workCenters, setWorkCenters] = useState<UIWorkCenter[]>([]);
  const [heatmapData, setHeatmapData] = useState<Array<{ name: string; usage: number[] }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch work centers
  useEffect(() => {
    setLoading(true);
    workCenterService.getWorkCenters()
      .then((data) => {
        // Transform backend data to match UI component requirements
        const uiWorkCenters = data.map((wc: WorkCenter): UIWorkCenter => ({
          id: wc.id,
          name: wc.name,
          currentTask: 'Processing', // Default value for demo
          utilization: Math.floor(Math.random() * 100), // Random utilization for demo
          cost: Math.floor(Math.random() * 100) + 20, // Random cost for demo
          status: wc.isActive ? 'Active' : 'Inactive',
          downtime: wc.downtime || 0,
          // Generate random usage pattern for demo
          usage: Array(7).fill(0).map(() => Math.floor(Math.random() * 100))
        }));
        
        setWorkCenters(uiWorkCenters);
        setHeatmapData(uiWorkCenters.map((wc) => ({ name: wc.name, usage: wc.usage })));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch work centers:', err);
        setError('Failed to load work centers. Please try again.');
        setLoading(false);
        toast.error('Failed to load work centers');
      });
  }, []);

  // Handle downtime reporting
  const handleDowntime = async (id: string) => {
    try {
      await workCenterService.reportDowntime(id);
      // Update local state to reflect the change
      setWorkCenters((prev) => prev.map((wc) => 
        wc.id === id ? { ...wc, downtime: wc.downtime + 1 } : wc
      ));
      toast.success('Downtime reported successfully');
    } catch (error) {
      console.error('Failed to report downtime:', error);
      toast.error('Failed to report downtime');
    }
  };

  const totalCenters = workCenters.length;
  const activeCenters = workCenters.filter(wc => wc.status === 'Active').length;
  const downtime = workCenters.reduce((acc, wc) => acc + wc.downtime, 0);

  return (
    <DashboardLayout>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Work Center Utilization</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading work centers...</p>
          </div>
        ) : error ? (
          <div style={{ 
            padding: '20px', 
            background: '#FEE2E2', 
            color: '#B91C1C',
            borderRadius: '8px',
            marginBottom: '20px' 
          }}>
            {error}
            <button 
              onClick={() => window.location.reload()} 
              style={{
                background: '#B91C1C',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                marginLeft: '16px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkCenterDashboard;
