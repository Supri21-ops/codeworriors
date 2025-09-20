import React from 'react';
import { COLORS } from '../theme';

interface KpiCardProps {
  label: string;
  value: string | number;
  color: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, color }) => (
  <div
    style={{
      background: COLORS.background.white,
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      padding: '1.2rem 1.4rem',
      minWidth: 180,
      marginRight: 12,
      borderLeft: `6px solid ${color}`,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <span style={{ color: COLORS.background.steel, fontSize: 13 }}>{label}</span>
    <span style={{ color, fontWeight: 700, fontSize: 24 }}>{value}</span>
  </div>
);
