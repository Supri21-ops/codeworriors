import React from 'react';
import { COLORS } from '../theme';

export const MiniCalendar: React.FC = () => {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return (
    <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', width: 260 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Upcoming Shifts</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {days.map((d) => (
          <div key={d} style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4F8', color: COLORS.background.steel, fontSize: 12 }}>{d[0]}</div>
        ))}
      </div>
      <div style={{ fontSize: 13, color: COLORS.background.steel }}>
        <div style={{ marginBottom: 6 }}><strong>Tomorrow</strong>: Shift A (09:00 - 17:00)</div>
        <div style={{ marginBottom: 6 }}><strong>Fri</strong>: Shift B (13:00 - 21:00)</div>
        <div><strong>Sat</strong>: Off</div>
      </div>
    </div>
  );
};
