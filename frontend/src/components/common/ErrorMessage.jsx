import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

export default function ErrorMessage({
  message,
  onDismiss,
  onRetry,
  type = 'error', // 'error', 'warning', 'info'
  style = {}
}) {
  if (!message) return null;

  const isWarning = type === 'warning';
  const isInfo = type === 'info';

  let bg = '#FEF2F2';
  let border = '#FCA5A5';
  let text = '#991B1B';
  let iconColor = '#DC2626';

  if (isWarning) {
    bg = '#FFFBEB';
    border = '#FDE68A';
    text = '#92400E';
    iconColor = '#D97706';
  } else if (isInfo) {
    bg = '#F0F9FF';
    border = '#BAE6FD';
    text = '#0369A1';
    iconColor = '#0284C7';
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 16px',
      borderRadius: 10,
      background: bg,
      border: `1.5px solid ${border}`,
      color: text,
      fontSize: '0.88rem',
      lineHeight: 1.5,
      ...style
    }}>
      <AlertCircle size={18} color={iconColor} style={{ flexShrink: 0, marginTop: 2 }} />

      <div style={{ flex: 1 }}>
        <div>{message}</div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              marginTop: 6,
              background: 'none',
              border: 'none',
              color: iconColor,
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            <RefreshCw size={12} />
            <span>Retry</span>
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          style={{
            background: 'none',
            border: 'none',
            color: text,
            cursor: 'pointer',
            padding: 2,
            opacity: 0.7
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
