import React from 'react';

export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  min,
  max,
  step,
  style = {}
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', ...style }}>
      {label && (
        <label 
          htmlFor={id} 
          style={{ 
            fontSize: '0.86rem', 
            fontWeight: 700, 
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <span>{label}</span>
          {required && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div style={{
            position: 'absolute',
            left: 12,
            color: '#64748B',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Icon size={16} />
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          style={{
            width: '100%',
            padding: Icon ? '10px 14px 10px 38px' : '10px 14px',
            fontSize: '0.92rem',
            borderRadius: 8,
            border: error ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
            background: disabled ? '#F1F5F9' : '#FFFFFF',
            color: disabled ? '#64748B' : '#0F172A',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            cursor: disabled ? 'not-allowed' : 'text'
          }}
          onFocus={(e) => {
            if (!error && !disabled) e.target.style.borderColor = '#6F3DFF';
          }}
          onBlur={(e) => {
            if (!error && !disabled) e.target.style.borderColor = '#CBD5E1';
          }}
        />
      </div>

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
