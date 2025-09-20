import React from 'react';
import { COLORS } from '../../theme';

interface Props {
  data: Array<{ name: string; usage: number[] }>;
}

// Simple heatmap: rows = work centers, columns = hours (usage)
export const UtilizationHeatmap: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Usage Heatmap</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ padding: 6 }}>Work Center</th>
            {Array.from({ length: 24 }, (_, i) => (
              <th key={i} style={{ padding: 2 }}>{i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.name}>
              <td style={{ padding: 6 }}>{row.name}</td>
              {row.usage.map((u, i) => (
                <td key={i} style={{ background: `rgba(26,115,232,${u / 100})`, width: 16, height: 16 }} title={u.toString()} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UtilizationHeatmap;
