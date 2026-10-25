import React from 'react';

export default function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  size = 'md', // 'sm', 'md', 'lg'
  fullWidth = false,
  style = {}
}) {
  const getPadding = () => {
    if (size === 'sm') return '7px 14px';
    if (size === 'lg') return '14px 28px';
    return '11px 22px';
  };

  const getFontSize = () => {
    if (size === 'sm') return '0.84rem';
    if (size === 'lg') return '1.02rem';
    return '0.92rem';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="btn-primary"
      style={{
        padding: getPadding(),
        fontSize: getFontSize(),
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style
      }}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span className="spinner-mini" style={{
            width: 14,
            height: 14,
            border: '2px solid rgba(255,255,255,0.4)',
            borderTopColor: '#FFF',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <span>Processing...</span>
        </span>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : 17} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
