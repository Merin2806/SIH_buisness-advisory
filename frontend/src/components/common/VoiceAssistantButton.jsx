import React from 'react';
import { Mic } from 'lucide-react';

export default function VoiceAssistantButton({ 
  onClick, 
  lang = 'en',
  isMobile = false,
  showLabel = true 
}) {
  const getVoiceLabel = () => {
    if (lang === 'mr') return 'आवाज़ सहाय्यक';
    if (lang === 'hi') return 'वॉयस असिस्टेंट';
    return 'Voice AI';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Activate Bhashini Indic Voice Assistant"
      title="Bhashini Indic Voice Assistant (Hindi / Marathi / English)"
      style={{
        border: '1.5px solid #BFE9FF',
        background: '#F0F9FF',
        color: '#6F3DFF',
        padding: isMobile ? '10px 16px' : '7px 14px',
        borderRadius: 8,
        fontSize: isMobile ? '0.9rem' : '0.82rem',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(111, 61, 255, 0.12)',
        width: isMobile ? '100%' : 'auto'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#EDE7FF';
        e.currentTarget.style.borderColor = '#6F3DFF';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#F0F9FF';
        e.currentTarget.style.borderColor = '#BFE9FF';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6F3DFF 0%, #8254FF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF'
      }}>
        <Mic size={13} color="#FFF" />
      </div>
      {(showLabel || isMobile) && (
        <span style={{ letterSpacing: '0.01em' }}>{getVoiceLabel()}</span>
      )}
    </button>
  );
}
