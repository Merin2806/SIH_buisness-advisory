import React from 'react';

export default function PageHeader({ 
  title, 
  subtitle, 
  badge, 
  actions,
  breadcrumbs 
}) {
  return (
    <div className="page-header" style={{
      marginBottom: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
      {breadcrumbs && (
        <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
          {breadcrumbs}
        </div>
      )}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#13151A',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            {title}
          </h1>
          {badge && (
            <div>{badge}</div>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {actions}
          </div>
        )}
      </div>
      {subtitle && (
        <p style={{
          fontSize: '0.94rem',
          color: '#585D69',
          margin: 0,
          maxWidth: 760,
          lineHeight: 1.5
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
