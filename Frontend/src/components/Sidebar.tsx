import React from 'react';
import { NavLink } from 'react-router-dom';
import { COLORS } from '../theme';

const links: { label: string; to: string; icon: string }[] = [
  { label: 'Dashboard', to: '/', icon: '🏠' },
  { label: 'Manufacturing Orders', to: '/manufacturing-orders', icon: '🏭' },
  { label: 'Work Orders', to: '/work-orders', icon: '⚙️' },
  { label: 'Inventory', to: '/inventory', icon: '📦' },
  { label: 'Work Centers', to: '/work-centers', icon: '🏗️' },
  { label: 'Stock Ledger', to: '/stock', icon: '📊' },
  { label: 'Reports', to: '/reports', icon: '📈' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside style={{
      width: 240,
      background: COLORS.primary.navy,
      color: '#fff',
      minHeight: '100vh',
      padding: '1.2rem',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        fontWeight: 800, 
        fontSize: 18, 
        marginBottom: 32,
        textAlign: 'center',
        padding: '16px 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        QuantumForge
      </div>
      
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              padding: '0.8rem 1rem',
              color: isActive ? COLORS.secondary.teal : '#fff',
              textDecoration: 'none',
              fontWeight: isActive ? 600 : 400,
              borderRadius: 8,
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              transition: 'all 0.2s',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            })}
          >
            <span style={{ fontSize: 16 }}>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div style={{
        padding: '16px 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12
        }}>
          <div style={{
            width: 40,
            height: 40,
            background: COLORS.secondary.teal,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: 16
          }}>
            JD
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>John Doe</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Manager</div>
          </div>
        </div>
        <button
          onClick={() => {
            // Handle logout
            console.log('Logout clicked');
          }}
          style={{
            width: '100%',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};