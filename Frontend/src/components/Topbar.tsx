import React, { useState } from 'react';
import { COLORS } from '../theme';

<<<<<<< HEAD
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
=======
export const Topbar: React.FC = () => {
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
          Manufacturing Dashboard
        </h1>
        <div style={{
          padding: '4px 12px',
          background: COLORS.status.success,
          color: 'white',
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 600
        }}>
          LIVE
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
              border: '1px solid #E5E7EB',
              borderRadius: 20,
              fontSize: 14,
              width: 200,
              outline: 'none'
            }}
          />
          <div style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: COLORS.background.steel
          }}>
            🔍
          </div>
        </div>

        {/* Notifications */}
        <button style={{
          background: 'none',
          border: 'none',
          padding: 8,
          cursor: 'pointer',
          position: 'relative'
        }}>
          <div style={{ fontSize: 20, color: COLORS.background.steel }}>
            🔔
          </div>
          <div style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 8,
            height: 8,
            background: COLORS.priority.urgent,
            borderRadius: '50%'
          }} />
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
              cursor: 'pointer',
              borderRadius: 8
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              background: COLORS.primary.blue,
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
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.primary.navy }}>
                John Doe
              </div>
              <div style={{ fontSize: 12, color: COLORS.background.steel }}>
                Manager
              </div>
            </div>
            <div style={{ fontSize: 12, color: COLORS.background.steel }}>
              ▼
            </div>
          </button>

          {isProfileOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: COLORS.background.white,
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minWidth: 200,
              zIndex: 1000
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.primary.navy }}>
                  John Doe
                </div>
                <div style={{ fontSize: 12, color: COLORS.background.steel }}>
                  john.doe@company.com
                </div>
              </div>
              <div style={{ padding: 8 }}>
                <button style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 4,
                  fontSize: 14,
                  color: COLORS.primary.navy
                }}>
                  Profile Settings
                </button>
                <button style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 4,
                  fontSize: 14,
                  color: COLORS.primary.navy
                }}>
                  Preferences
                </button>
                <button style={{
                  width: '100%',
                  padding: '8px 12px',
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
      </div>
    </header>
  );
};
>>>>>>> 3f96c8f9e2887f062742e21efdbbf5fcf52c1b7f
