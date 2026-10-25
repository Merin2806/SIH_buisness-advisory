import React from 'react';
import { Inbox } from 'lucide-react';
import PrimaryButton from './PrimaryButton';

export default function EmptyState({
  title = 'No records found',
  description = 'There are currently no items to display.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  style = {}
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      background: '#FFFFFF',
      borderRadius: 16,
      border: '1.5px dashed #CBD5E1',
      gap: 14,
      ...style
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 14,
        background: '#EDE7FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6F3DFF'
      }}>
        <Icon size={28} />
      </div>

      <div style={{ maxWidth: 420 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <div style={{ marginTop: 8 }}>
          <PrimaryButton onClick={onAction} size="sm">
            {actionLabel}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
