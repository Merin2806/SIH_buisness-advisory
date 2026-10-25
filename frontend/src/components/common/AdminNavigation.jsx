import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  BookOpen, 
  Activity 
} from 'lucide-react';
import { getTranslation } from '../../i18n';

export default function AdminNavigation({ 
  currentSection = 'overview', 
  onSelectSection, 
  lang = 'en',
  isMobile = false 
}) {
  const t = (k) => getTranslation(k, lang);

  const adminTabs = [
    { id: 'overview', label: t('adminDashboard') || 'Dashboard', icon: LayoutDashboard },
    { id: 'yojanas', label: t('yojanaManagement') || 'Yojana Management', icon: FileText },
    { id: 'panel', label: t('adminPanel') || 'Admin Panel', icon: ShieldCheck },
    { id: 'geo', label: 'Geographic Data', icon: MapPin },
    { id: 'categories', label: t('categories') || 'Business Categories', icon: Layers },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'health', label: 'Integration Status', icon: Activity }
  ];

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
        <div style={{ 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          color: '#B45309', 
          background: '#FEF3C7', 
          padding: '4px 10px', 
          borderRadius: 6, 
          marginBottom: 6,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6
        }}>
          <ShieldCheck size={13} />
          <span>ADMINISTRATOR CONSOLE</span>
        </div>
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectSection(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 8,
                background: isActive ? '#6F3DFF' : 'transparent',
                color: isActive ? '#FFFFFF' : '#334155',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} color={isActive ? '#FFFFFF' : '#64748B'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="admin-nav-cluster" style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto', maxWidth: '100%' }}>
      {adminTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentSection === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectSection(tab.id)}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: isActive ? '#6F3DFF' : 'transparent',
              color: isActive ? '#FFFFFF' : '#585D69',
              fontWeight: isActive ? 700 : 600,
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              border: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#6F3DFF';
                e.currentTarget.style.background = '#EDE7FF';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#585D69';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <Icon size={14} color={isActive ? '#FFFFFF' : 'currentColor'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
