import React from 'react';
import { COLORS } from '../theme';

export const Sidebar: React.FC = () => {
  const menu = [
    'Manufacturing Orders',
    'Work Orders',
    'Work Centers',
    'Stock Ledger',
    'Bills of Materials',
  ];

  return (
    <aside style={{
      width: 240,
      background: COLORS.primary.navy,
      color: '#fff',
      minHeight: '100vh',
      padding: '1.2rem',
      boxSizing: 'border-box'
    }}>
      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 24 }}>CodeWarrior</div>
      <nav>
        {menu.map((m) => (
          <div key={m} style={{ padding: '0.6rem 0', cursor: 'pointer', color: '#fff' }}>{m}</div>
        ))}
      </nav>
    </aside>
  );
};
