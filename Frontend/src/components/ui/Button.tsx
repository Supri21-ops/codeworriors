import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, style, ...rest }) => {
  const base: React.CSSProperties = {
    padding: '0.6rem 1rem',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: '#1A73E8', color: '#fff' },
    ghost: { background: 'transparent', color: '#1A73E8', border: '1px solid rgba(26,115,232,0.12)' },
    danger: { background: '#FF3B30', color: '#fff' },
  };

  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {children}
    </button>
  );
};
