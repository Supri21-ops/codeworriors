export const COLORS = {
  primary: {
    blue: '#1A73E8',
    navy: '#0B1D39',
  },
  secondary: {
    teal: '#00BFA6',
    amber: '#FFB300',
    indigo: '#6C63FF',
  },
  priority: {
    urgent: '#FF3B30',
    medium: '#FF9500',
    normal: '#8E8E93',
  },
  background: {
    lightGray: '#F5F7FA',
    white: '#FFFFFF',
    steel: '#4A4A4A',
  },
  status: {
    success: '#34C759',
    inProgress: '#007AFF',
    delayed: '#FF6F00',
    cancelled: '#5E5E5E',
  },
};

export type ColorKey = keyof typeof COLORS;
