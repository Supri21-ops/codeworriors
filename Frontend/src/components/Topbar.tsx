import React, { useState } from 'react';
import { COLORS } from '../theme';

interface TopbarProps {
  title?: string;
  right?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ title = "Manufacturing Dashboard", right }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header style={{
      background: COLORS.background.white,
      padding: '16px 24px',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h1 style={{
          fontSize: 20,
          fontWeight: 700,
          color: COLORS.primary.navy,
          margin: 0
        }}>
          {title}
        </h1>
        <div style={{
          padding: '4px 12px',
          background: COLORS.status.success + '20',
          color: COLORS.status.success,
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 500
        }}>
          System Online
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search..."
            style={{
              padding: '8px 16px 8px 40px',
              border: '1px solid #D1D5DB',
              borderRadius: 8,
              width: 200,
              fontSize: 14
            }}
          />
          <span style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6B7280',
            fontSize: 16
          }}>
            🔍
          </span>
        </div>

        {/* Notifications */}
        <button style={{
          background: 'none',
          border: 'none',
          padding: 8,
          borderRadius: 6,
          cursor: 'pointer',
          color: '#6B7280',
          position: 'relative'
        }}>
          🔔
          <span style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 8,
            height: 8,
            background: COLORS.priority.urgent,
            borderRadius: '50%'
          }}></span>
        </button>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              padding: 8,
              borderRadius: 8,
              cursor: 'pointer',
              color: COLORS.primary.navy
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              background: COLORS.secondary.teal,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
              fontSize: 14
            }}>
              JD
            </div>
            <span style={{ fontSize: 14, fontWeight: 500 }}>John Doe</span>
            <span style={{ fontSize: 12, color: '#6B7280' }}>▼</span>
          </button>

          {isProfileOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              minWidth: 200,
              zIndex: 1000
            }}>
              <div style={{ padding: 16, borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>John Doe</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Manager</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>john.doe@company.com</div>
              </div>
              <div style={{ padding: 8 }}>
                <button style={{
                  width: '100%',
                  padding: '8px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 4,
                  fontSize: 14
                }}>
                  Profile Settings
                </button>
                <button style={{
                  width: '100%',
                  padding: '8px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 4,
                  fontSize: 14,
                  color: COLORS.priority.urgent
                }}>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {right}
      </div>
    </header>
  );
};