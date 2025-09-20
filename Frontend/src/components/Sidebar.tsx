import React from 'react';
import { COLORS } from '../theme';

interface SidebarProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage = 'dashboard' }) => {
  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'workorders', label: 'Work Orders', icon: '⚙️' },
    { id: 'inventory', label: 'Stock Ledger', icon: '📦' },
    { id: 'bom', label: 'Bills of Materials', icon: '📋' },
    { id: 'workcenters', label: 'Work Centers', icon: '🏭' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleMenuClick = (menuId: string) => {
    if (onNavigate) {
      onNavigate(menuId);
    } else if ((window as any).navigateTo) {
      (window as any).navigateTo(menuId);
    }
  };

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
        CodeWarrior
      </div>
      
      <nav style={{ flex: 1 }}>
        {menu.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleMenuClick(item.id)}
            style={{ 
              padding: '12px 16px', 
              cursor: 'pointer', 
              color: currentPage === item.id ? COLORS.secondary.teal : '#fff',
              background: currentPage === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderRadius: 8,
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s',
              fontWeight: currentPage === item.id ? 600 : 400
            }}
            onMouseOver={(e) => {
              if (currentPage !== item.id) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }
            }}
            onMouseOut={(e) => {
              if (currentPage !== item.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
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
            if ((window as any).handleLogout) {
              (window as any).handleLogout();
            }
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