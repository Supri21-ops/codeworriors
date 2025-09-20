import React from 'react';
import { Button } from './ui/Button';
import { COLORS } from '../theme';

interface TopbarProps {
  right?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ right }) => (
  <header style={{
    height: 64,
    background: COLORS.primary.blue,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem'
  }}>
    <div style={{ fontWeight: 700 }}>Manufacturing Overview</div>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {right}
      <Button variant="ghost">Profile</Button>
      <Button variant="primary">New Order</Button>
    </div>
  </header>
);
