import React from 'react';
import { NavLink } from 'react-router-dom';
import { COLORS } from '../theme';

const links: { label: string; to: string }[] = [
  { label: 'Manager Dashboard', to: '/' },
  { label: 'Operator Dashboard', to: '/operator' },
  { label: 'Inventory Dashboard', to: '/inventory' },
  { label: 'Work Center Dashboard', to: '/work-centers' },
  { label: 'Reports Dashboard', to: '/reports' },
];

export const Sidebar: React.FC = () => {
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
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            style={({ isActive }) => ({
              padding: '0.6rem 0.4rem',
              color: isActive ? COLORS.primary.blue : '#fff',
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              borderRadius: 6,
              background: isActive ? 'rgba(26,115,232,0.15)' : 'transparent',
              transition: 'background 0.2s, color 0.2s',
              cursor: 'pointer',
            })}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
