import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import WorkOrderList from '../../features/operator/WorkOrderList';
import type { WorkOrder } from '../../features/operator/WorkOrderRow';
import { KpiCard } from '../../components/KpiCard';
import { COLORS } from '../../theme';
import { operatorService, type OperatorTask, type OperatorDashboardSummary } from '../../services/operator.service';
import toast from 'react-hot-toast';

const OperatorDashboard: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [summary, setSummary] = useState<OperatorDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert OperatorTask to WorkOrder format for compatibility
  const convertTaskToWorkOrder = (task: OperatorTask): WorkOrder => ({
    id: task.id,
    operation: task.title,
    workCenter: task.workOrder.workCenter.name,
    expected: task.estimatedDuration,
    real: task.actualDuration || 0,
    status: task.status === 'PENDING' ? 'To Do' : 
           task.status === 'IN_PROGRESS' ? 'Started' :
           task.status === 'PAUSED' ? 'Paused' : 'Done',
    urgent: task.priority === 'URGENT',
    delayed: false // This would need to be calculated based on estimated completion time
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard summary and tasks in parallel
        const [summaryData, tasksData] = await Promise.all([
          operatorService.getDashboardSummary(),
          operatorService.getTasks({ limit: 50 })
        ]);

        setSummary(summaryData);
        const convertedWorkOrders = tasksData.data.map(convertTaskToWorkOrder);
        setWorkOrders(convertedWorkOrders);
      } catch (error) {
        console.error('Error fetching operator dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStart = async (id: string) => {
    try {
      await operatorService.startTask(id);
      setWorkOrders(wos => wos.map(wo => wo.id === id ? { ...wo, status: 'Started' } : wo));
      toast.success('Task started successfully');
    } catch (error) {
      console.error('Error starting task:', error);
      toast.error('Failed to start task');
    }
  };

  const handlePause = async (id: string) => {
    try {
      await operatorService.pauseTask(id);
      setWorkOrders(wos => wos.map(wo => wo.id === id ? { ...wo, status: 'Paused' } : wo));
      toast.success('Task paused successfully');
    } catch (error) {
      console.error('Error pausing task:', error);
      toast.error('Failed to pause task');
    }
  };

  const handleComplete = async (id: string, elapsed: number) => {
    try {
      await operatorService.completeTask(id, `Task completed in ${elapsed} seconds`);
      setWorkOrders(wos => wos.map(wo => wo.id === id ? { ...wo, status: 'Done', real: elapsed } : wo));
      toast.success('Task completed successfully');
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  };

  // Calculate summary values
  const assigned = summary?.totalTasks || workOrders.length;
  const completedToday = summary?.todayCompletedTasks || workOrders.filter(wo => wo.status === 'Done').length;
  const delayed = summary?.overdueTasks || workOrders.filter(wo => wo.delayed).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div>Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main style={{ padding: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>My Work Orders</h2>
        <section style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <KpiCard label="Assigned Work Orders" value={assigned} color={COLORS.primary.blue} />
          <KpiCard label="Completed Today" value={completedToday} color={COLORS.status.success} />
          <KpiCard label="Delayed Tasks" value={delayed} color={COLORS.secondary.amber} />
          {summary && (
            <KpiCard 
              label="Productivity Score" 
              value={`${summary.productivityScore}%`} 
              color={COLORS.secondary.indigo} 
            />
          )}
        </section>
        <WorkOrderList workOrders={workOrders} onStart={handleStart} onPause={handlePause} onComplete={handleComplete} />
      </main>
    </DashboardLayout>
  );
};

export default OperatorDashboard;
