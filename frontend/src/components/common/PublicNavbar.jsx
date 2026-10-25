import React from 'react';
import { Home, Sparkles, HelpCircle, LogIn, UserPlus } from 'lucide-react';
import { getTranslation } from '../../i18n';

export default function PublicNavbar({ 
  currentTab, 
  onNavigate, 
  onOpenAuth, 
  lang = 'en',
  isMobile = false 
}) {
  const t = (k) => getTranslation(k, lang);

  const navItems = [
    { id: 'landing', label: t('home'), icon: Home, action: () => onNavigate('landing') },
    { 
      id: 'features', 
      label: t('features'), 
      icon: Sparkles, 
      action: () => {
        const el = document.getElementById('features-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else onNavigate('landing');
      }
    },
    { 
      id: 'how_it_works', 
      label: t('howItWorks'), 
      icon: HelpCircle, 
      action: () => {
        const el = document.getElementById('how-it-works-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else onNavigate('landing');
      }
    }
  ];

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 10,
                background: isActive ? '#EDE7FF' : 'transparent',
                color: isActive ? '#6F3DFF' : '#334155',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.95rem',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <Icon size={18} color={isActive ? '#6F3DFF' : '#64748B'} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div style={{ height: 1, background: '#E2E8F0', margin: '8px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={() => onOpenAuth('login')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 16px' }}
          >
            <LogIn size={16} />
            <span>{t('login')}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenAuth('register')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 16px' }}
          >
            <UserPlus size={16} />
            <span>{t('signUp')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="public-nav-cluster" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={item.action}
            className={`nav-link ${isActive ? 'active' : ''}`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: isActive ? '#EDE7FF' : 'transparent',
              color: isActive ? '#6F3DFF' : '#585D69',
              fontWeight: isActive ? 700 : 600,
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = '#6F3DFF';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = '#585D69';
            }}
          >
            <Icon size={15} color={isActive ? '#6F3DFF' : 'currentColor'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
