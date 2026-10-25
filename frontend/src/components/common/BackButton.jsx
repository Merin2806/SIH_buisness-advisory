import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ 
  onClick, 
  label = 'Back', 
  style = {},
  variant = 'secondary'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 8,
        fontSize: '0.84rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        ...style
      }}
      title={label}
      aria-label={label}
    >
      <ArrowLeft size={16} />
      <span>{label}</span>
    </button>
  );
}
