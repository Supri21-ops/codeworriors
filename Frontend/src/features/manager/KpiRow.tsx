import React from 'react';
import { KpiCard } from '../../components/KpiCard';
import { COLORS } from '../../theme';

export interface KpiData {
  total: number;
  completed: number;
  inProgress: number;
  urgent: number;
}

interface Props {
  data: KpiData;
}

export const KpiRow: React.FC<Props> = ({ data }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
    <KpiCard label="Total Manufacturing Orders" value={data.total} color={COLORS.primary.blue} />
    <KpiCard label="Orders Completed" value={data.completed} color={COLORS.status.success} />
    <KpiCard label="Orders In Progress" value={data.inProgress} color={COLORS.secondary.amber} />
    <KpiCard label="Urgent Orders" value={data.urgent} color={COLORS.priority.urgent} />
  </div>
);

export default KpiRow;
