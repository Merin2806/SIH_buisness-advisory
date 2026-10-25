import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSelector({ 
  currentLang = 'en', 
  onLanguageChange,
  isMobile = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
  ];

  const activeLang = languages.find(l => l.code === currentLang) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select application language"
        aria-expanded={isOpen}
        style={{
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderRadius: 8,
          padding: isMobile ? '8px 12px' : '6px 12px',
          fontSize: isMobile ? '0.9rem' : '0.82rem',
          fontWeight: 600,
          color: '#1E293B',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          width: isMobile ? '100%' : 'auto',
          justifyContent: isMobile ? 'space-between' : 'flex-start'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#6F3DFF';
          e.currentTarget.style.background = '#EDE7FF';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = '#CBD5E1';
            e.currentTarget.style.background = '#F8FAFC';
          }
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Globe size={15} color="#6F3DFF" />
          <span>{activeLang.native}</span>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>({activeLang.code.toUpperCase()})</span>
        </span>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div style={{
          position: isMobile ? 'static' : 'absolute',
          top: '120%',
          right: 0,
          background: '#FFFFFF',
          borderRadius: 10,
          boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
          border: '1px solid #E2E8F0',
          padding: 6,
          minWidth: isMobile ? '100%' : 160,
          zIndex: 1200,
          marginTop: isMobile ? 6 : 0
        }}>
          {languages.map((l) => {
            const isSelected = currentLang === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  onLanguageChange(l.code);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: isSelected ? '#EDE7FF' : 'transparent',
                  color: isSelected ? '#6F3DFF' : '#1E293B',
                  border: 'none',
                  padding: '9px 12px',
                  borderRadius: 6,
                  fontSize: '0.86rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#F1F5F9';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div>
                  <div style={{ fontWeight: isSelected ? 700 : 600 }}>{l.native}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{l.label}</div>
                </div>
                {isSelected && <Check size={14} color="#6F3DFF" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
