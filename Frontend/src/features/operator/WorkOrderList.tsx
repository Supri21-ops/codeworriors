import React from 'react';
import WorkOrderRow, { WorkOrder } from './WorkOrderRow';

interface Props {
  workOrders: WorkOrder[];
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onComplete: (id: string, elapsed: number) => void;
}

export const WorkOrderList: React.FC<Props> = ({ workOrders, onStart, onPause, onComplete }) => (
  <div style={{ background: '#fff', borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left' }}>
          <th style={{ padding: 8 }}>Operation</th>
          <th style={{ padding: 8 }}>Work Center</th>
          <th style={{ padding: 8 }}>Expected Duration</th>
          <th style={{ padding: 8 }}>Real Duration</th>
          <th style={{ padding: 8 }}>Status</th>
          <th style={{ padding: 8 }}>Timer</th>
        </tr>
      </thead>
      <tbody>
        {workOrders.map((wo) => (
          <WorkOrderRow key={wo.id} workOrder={wo} onStart={onStart} onPause={onPause} onComplete={onComplete} />
        ))}
      </tbody>
    </table>
  </div>
);

export default WorkOrderList;
