import React from 'react';
import { Button } from './ui/Button';
import { COLORS } from '../theme';

export const Topbar: React.FC = () => (
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
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="ghost">Profile</Button>
      <Button variant="primary">New Order</Button>
    </div>
  </header>
);
