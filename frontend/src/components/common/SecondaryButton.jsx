import React from 'react';

export default function SecondaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  icon: Icon,
  size = 'md',
  fullWidth = false,
  variant = 'default', // 'default', 'danger'
  style = {}
}) {
  const getPadding = () => {
    if (size === 'sm') return '7px 12px';
    if (size === 'lg') return '13px 26px';
    return '10px 20px';
  };

  const getFontSize = () => {
    if (size === 'sm') return '0.84rem';
    if (size === 'lg') return '1rem';
    return '0.9rem';
  };

  const isDanger = variant === 'danger';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={isDanger ? 'btn-danger' : 'btn-secondary'}
      style={{
        padding: getPadding(),
        fontSize: getFontSize(),
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: isDanger ? '1.5px solid #FCA5A5' : '1.5px solid #CBD5E1',
        background: isDanger ? '#FEF2F2' : '#FFFFFF',
        color: isDanger ? '#DC2626' : '#1E293B',
        borderRadius: 10,
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 0.15s ease',
        ...style
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      <span>{children}</span>
    </button>
  );
}
