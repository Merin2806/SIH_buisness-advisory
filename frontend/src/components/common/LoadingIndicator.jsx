import React from 'react';

export default function LoadingIndicator({ 
  message = 'Loading data...',
  size = 'md' 
}) {
  const spinnerSize = size === 'sm' ? 24 : size === 'lg' ? 48 : 36;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      gap: 14
    }}>
      <div 
        className="app-spinner"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderRadius: '50%',
          border: '3px solid #EDE7FF',
          borderTopColor: '#6F3DFF',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      {message && (
        <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
          {message}
        </span>
      )}
    </div>
  );
}
