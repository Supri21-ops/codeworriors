import React from 'react';
import { TimerButton } from './TimerButton';
import { COLORS } from '../../theme';

export interface WorkOrder {
  id: string;
  operation: string;
  workCenter: string;
  expected: number;
  real: number;
  status: 'To Do' | 'Started' | 'Paused' | 'Done';
  urgent?: boolean;
  delayed?: boolean;
}

interface Props {
  workOrder: WorkOrder;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onComplete: (id: string, elapsed: number) => void;
}

export const WorkOrderRow: React.FC<Props> = ({ workOrder, onStart, onPause, onComplete }) => (
  <tr style={{ borderTop: '1px solid #EEE' }}>
    <td style={{ padding: 8 }}>{workOrder.operation}</td>
    <td style={{ padding: 8 }}>{workOrder.workCenter}</td>
    <td style={{ padding: 8 }}>{workOrder.expected}</td>
    <td style={{ padding: 8 }}>{workOrder.real}</td>
    <td style={{ padding: 8 }}>
      {workOrder.urgent && <span style={{ background: COLORS.priority.urgent, color: '#fff', padding: '0.25rem 0.7rem', borderRadius: 999, fontWeight: 700, fontSize: 12, marginRight: 6 }}>URGENT</span>}
      {workOrder.delayed && <span style={{ background: COLORS.secondary.amber, color: '#fff', padding: '0.25rem 0.7rem', borderRadius: 999, fontWeight: 700, fontSize: 12 }}>DELAYED</span>}
      <span>{workOrder.status}</span>
    </td>
    <td style={{ padding: 8 }}>
      <TimerButton
        status={workOrder.status}
        onStart={() => onStart(workOrder.id)}
        onPause={() => onPause(workOrder.id)}
        onComplete={(elapsed) => onComplete(workOrder.id, elapsed)}
        initialSeconds={workOrder.real}
      />
    </td>
  </tr>
);

export default WorkOrderRow;
