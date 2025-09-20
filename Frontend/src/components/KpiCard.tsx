import React from 'react';

interface KpiCardProps {
  label: string;
  value: number | string;
  color: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  label, 
  value, 
  color, 
  icon, 
  trend, 
  subtitle 
}) => {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      border: '1px solid #F3F4F6',
      minWidth: 200,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Icon */}
      {icon && (
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontSize: 24,
          opacity: 0.1
        }}>
          {icon}
        </div>
      )}

      {/* Value */}
      <div style={{
        fontSize: 32,
        fontWeight: 700,
        color: color,
        marginBottom: 8,
        lineHeight: 1
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      {/* Label */}
      <div style={{
        fontSize: 14,
        fontWeight: 600,
        color: '#4A4A4A',
        marginBottom: 4
      }}>
        {label}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div style={{
          fontSize: 12,
          color: '#8E8E93',
          marginBottom: 8
        }}>
          {subtitle}
        </div>
      )}

      {/* Trend */}
      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 12,
          fontWeight: 600,
          color: trend.isPositive ? '#34C759' : '#FF3B30'
        }}>
          <span>
            {trend.isPositive ? '↗' : '↘'}
          </span>
          <span>
            {Math.abs(trend.value)}%
          </span>
          <span style={{ color: '#8E8E93', fontWeight: 400 }}>
            vs last period
          </span>
        </div>
      )}
    </div>
  );
};