import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, style, ...rest }) => {
  const base: React.CSSProperties = {
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
  };
  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '0.3rem 0.7rem', fontSize: 13 },
    md: { padding: '0.6rem 1rem', fontSize: 15 },
    lg: { padding: '0.8rem 1.3rem', fontSize: 17 },
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: '#1A73E8', color: '#fff' },
    ghost: { background: 'transparent', color: '#1A73E8', border: '1px solid rgba(26,115,232,0.12)' },
    danger: { background: '#FF3B30', color: '#fff' },
  };
  const { size = 'md' } = rest as ButtonProps;
  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant], ...style }} {...rest}>
      {children}
    </button>
  );
};
