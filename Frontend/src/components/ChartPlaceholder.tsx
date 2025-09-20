import React from 'react';
import { COLORS } from '../theme';

interface ChartPlaceholderProps {
  title: string;
  type?: 'bar' | 'line' | 'pie' | 'area';
  height?: number;
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ 
  title, 
  type = 'bar',
  height = 300 
}) => {
  const getChartIcon = () => {
    switch (type) {
      case 'bar': return '📊';
      case 'line': return '📈';
      case 'pie': return '🥧';
      case 'area': return '📉';
      default: return '📊';
    }
  };

  const getChartDescription = () => {
    switch (type) {
      case 'bar': return 'Bar chart showing data distribution';
      case 'line': return 'Line chart showing trends over time';
      case 'pie': return 'Pie chart showing data proportions';
      case 'area': return 'Area chart showing cumulative data';
      default: return 'Chart visualization';
    }
  };

  return (
    <div style={{
      background: COLORS.background.white,
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      border: '1px solid #F3F4F6',
      height: height,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(45deg, ${COLORS.background.lightGray} 25%, transparent 25%), 
                    linear-gradient(-45deg, ${COLORS.background.lightGray} 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, ${COLORS.background.lightGray} 75%), 
                    linear-gradient(-45deg, transparent 75%, ${COLORS.background.lightGray} 75%)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        opacity: 0.1
      }} />

      {/* Chart Icon */}
      <div style={{
        fontSize: 48,
        marginBottom: 16,
        opacity: 0.3
      }}>
        {getChartIcon()}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 18,
        fontWeight: 600,
        color: COLORS.primary.navy,
        margin: '0 0 8px 0',
        textAlign: 'center'
      }}>
        {title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 14,
        color: COLORS.background.steel,
        margin: '0 0 16px 0',
        textAlign: 'center',
        maxWidth: 200
      }}>
        {getChartDescription()}
      </p>

      {/* Placeholder Data */}
      <div style={{
        display: 'flex',
        alignItems: 'end',
        gap: 8,
        marginBottom: 16
      }}>
        {[40, 65, 45, 80, 55, 70, 60].map((height, index) => (
          <div
            key={index}
            style={{
              width: 20,
              height: height,
              background: `linear-gradient(to top, ${COLORS.primary.blue}, ${COLORS.secondary.teal})`,
              borderRadius: '4px 4px 0 0',
              opacity: 0.6
            }}
          />
        ))}
      </div>

      {/* Action Button */}
      <button style={{
        background: COLORS.primary.blue,
        color: 'white',
        border: 'none',
        borderRadius: 8,
        padding: '8px 16px',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = COLORS.secondary.teal;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = COLORS.primary.blue;
      }}
      >
        Configure Chart
      </button>

      {/* Chart Type Badge */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 12,
        background: COLORS.background.lightGray,
        color: COLORS.background.steel,
        padding: '4px 8px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        textTransform: 'uppercase'
      }}>
        {type}
      </div>
    </div>
  );
};