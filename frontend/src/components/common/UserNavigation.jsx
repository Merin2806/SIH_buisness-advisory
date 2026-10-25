import React from 'react';
import { LayoutDashboard, FileText, Landmark, Calculator } from 'lucide-react';
import { getTranslation } from '../../i18n';

export default function UserNavigation({ 
  currentTab, 
  onNavigate, 
  lang = 'en',
  isMobile = false 
}) {
  const t = (k) => getTranslation(k, lang);

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'wizard', label: t('assessmentTab'), icon: FileText },
    { id: 'loan_advisor', label: t('loanAdvisorTab'), icon: Landmark },
    { id: 'budgeter', label: t('budgeterTab'), icon: Calculator }
  ];

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 10,
                background: isActive ? '#EDE7FF' : 'transparent',
                color: isActive ? '#6F3DFF' : '#334155',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.94rem',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <Icon size={18} color={isActive ? '#6F3DFF' : '#64748B'} />
              <span>{item.label}</span>
              {isActive && (
                <span style={{
                  marginLeft: 'auto',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#6F3DFF'
                }} />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="user-nav-cluster" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`nav-link ${isActive ? 'active' : ''}`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: isActive ? '#EDE7FF' : 'transparent',
              color: isActive ? '#6F3DFF' : '#585D69',
              fontWeight: isActive ? 700 : 600,
              fontSize: '0.88rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#6F3DFF';
                e.currentTarget.style.background = '#F8FAFC';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#585D69';
                e.currentTarget.style.background = 'transparent';
              }
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
