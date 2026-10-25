import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

export default function SearchableDropdown({
  label,
  options = [], // [{ value: '...', label: '...' }] or array of strings
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Type to search...',
  disabled = false,
  required = false,
  error,
  helperText,
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  // Normalize options to objects { value, label }
  const normalizedOptions = options.map((opt) => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find(o => o.value === value);

  const filteredOptions = normalizedOptions.filter(o => 
    o.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', position: 'relative', ...style }}>
      {label && (
        <label style={{ 
          fontSize: '0.86rem', 
          fontWeight: 700, 
          color: '#334155',
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}>
          <span>{label}</span>
          {required && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearchTerm('');
          }
        }}
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: '0.92rem',
          borderRadius: 8,
          border: error ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
          background: disabled ? '#F1F5F9' : '#FFFFFF',
          color: selectedOption ? '#0F172A' : '#94A3B8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} color="#64748B" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && !disabled && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderRadius: 10,
          border: '1.5px solid #6F3DFF',
          boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
          marginTop: 6,
          zIndex: 1500,
          maxHeight: 260,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Search bar inside dropdown */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC' }}>
            <Search size={14} color="#64748B" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              autoFocus
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                fontSize: '0.86rem',
                outline: 'none',
                color: '#1E293B'
              }}
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* List of options */}
          <div style={{ overflowY: 'auto', flex: 1, padding: 4 }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '0.84rem', color: '#64748B', textAlign: 'center' }}>
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '0.88rem',
                      borderRadius: 6,
                      border: 'none',
                      background: isSelected ? '#EDE7FF' : 'transparent',
                      color: isSelected ? '#6F3DFF' : '#1E293B',
                      fontWeight: isSelected ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#F1F5F9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} color="#6F3DFF" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error ? (
        <span style={{ fontSize: '0.78rem', color: '#EF4444', fontWeight: 600 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
