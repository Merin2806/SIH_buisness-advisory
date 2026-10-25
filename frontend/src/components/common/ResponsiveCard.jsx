import React from 'react';

export default function ResponsiveCard({
  children,
  className = '',
  style = {},
  onClick,
  hoverable = false,
  padding = '20px'
}) {
  return (
    <div
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        border: '1px solid #E2E8F0',
        padding: padding,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        width: '100%',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {children}
    </div>
  );
}
