import React from 'react';
import { CheckCircle2, AlertCircle, Info, Database } from 'lucide-react';

export default function StatusBadge({ 
  status = 'active', // 'active', 'verified', 'pending', 'osm', 'synthetic', 'alert'
  label,
  size = 'md' 
}) {
  let bg = '#ECFDF5';
  let text = '#047857';
  let border = '#A7F3D0';
  let Icon = CheckCircle2;

  switch (status.toLowerCase()) {
    case 'verified':
    case 'active':
    case 'success':
      bg = '#ECFDF5';
      text = '#047857';
      border = '#A7F3D0';
      Icon = CheckCircle2;
      break;
    case 'osm':
    case 'observed_osm':
      bg = '#F0F9FF';
      text = '#0369A1';
      border = '#BAE6FD';
      Icon = Database;
      break;
    case 'pending':
    case 'pending verification':
      bg = '#FFFBEB';
      text = '#B45309';
      border = '#FDE68A';
      Icon = AlertCircle;
      break;
    case 'synthetic':
    case 'synthetic_demo':
      bg = '#FEF3C7';
      text = '#92400E';
      border = '#FCD34D';
      Icon = Info;
      break;
    case 'error':
    case 'alert':
    case 'high risk':
      bg = '#FEF2F2';
      text = '#B91C1C';
      border = '#FCA5A5';
      Icon = AlertCircle;
      break;
    case 'brand':
    case 'ultraviolet':
      bg = '#EDE7FF';
      text = '#6F3DFF';
      border = '#C4B5FD';
      Icon = CheckCircle2;
      break;
    default:
      bg = '#F1F5F9';
      text = '#475569';
      border = '#CBD5E1';
      Icon = Info;
  }

  const isSmall = size === 'sm';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: isSmall ? '2px 8px' : '4px 10px',
      borderRadius: 999,
      fontSize: isSmall ? '0.72rem' : '0.78rem',
      fontWeight: 700,
      background: bg,
      color: text,
      border: `1px solid ${border}`,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap'
    }}>
      <Icon size={isSmall ? 12 : 14} />
      <span>{label || status}</span>
    </span>
  );
}
