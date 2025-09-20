import React from 'react';
import { COLORS } from '../../theme';

export interface WorkCenter {
  id: string;
  name: string;
  currentTask: string;
  utilization: number;
  cost: number;
  status: string;
  downtime: number;
  usage: number[];
}

interface Props {
  data: WorkCenter[];
  downtimeThreshold?: number;
  onDowntime?: (id: string) => void;
}

export const WorkCenterTable: React.FC<Props> = ({ data, downtimeThreshold = 10, onDowntime }) => (
  <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', color: COLORS.background.steel }}>
          <th style={{ padding: 8 }}>Name</th>
          <th style={{ padding: 8 }}>Current Task</th>
          <th style={{ padding: 8 }}>Utilization %</th>
          <th style={{ padding: 8 }}>Cost/hour</th>
          <th style={{ padding: 8 }}>Status</th>
          <th style={{ padding: 8 }}>Downtime (hrs)</th>
          <th style={{ padding: 8 }}></th>
        </tr>
      </thead>
      <tbody>
        {data.map((wc) => (
          <tr key={wc.id} style={{ borderTop: '1px solid #EEE' }}>
            <td style={{ padding: 8 }}>{wc.name}</td>
            <td style={{ padding: 8 }}>{wc.currentTask}</td>
            <td style={{ padding: 8 }}>{wc.utilization}%</td>
            <td style={{ padding: 8 }}>{wc.cost}</td>
            <td style={{ padding: 8 }}>{wc.status}</td>
            <td style={{ padding: 8, color: wc.downtime > downtimeThreshold ? COLORS.priority.urgent : 'inherit', fontWeight: wc.downtime > downtimeThreshold ? 700 : 400 }}>{wc.downtime}</td>
            <td style={{ padding: 8 }}>
              <button
                style={{ background: COLORS.priority.urgent, color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => onDowntime && onDowntime(wc.id)}
              >
                Downtime
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default WorkCenterTable;
