import React from 'react';

interface ChartPlaceholderProps {
  title?: string;
  height?: number;
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ title, height = 240 }) => (
  <div style={{
    background: '#fff',
    borderRadius: 10,
    padding: 12,
    minHeight: height,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  }}>
    <div style={{ color: '#333', fontWeight: 700, marginBottom: 12 }}>{title}</div>
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
      Chart placeholder
    </div>
  </div>
);
