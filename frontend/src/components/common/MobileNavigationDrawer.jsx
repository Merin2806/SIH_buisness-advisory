import React, { useEffect } from 'react';
import { X, Building2, ShieldCheck, LogOut, User } from 'lucide-react';
import PublicNavbar from './PublicNavbar';
import UserNavigation from './UserNavigation';
import AdminNavigation from './AdminNavigation';
import LanguageSelector from './LanguageSelector';
import VoiceAssistantButton from './VoiceAssistantButton';
import { getTranslation } from '../../i18n';

export default function MobileNavigationDrawer({
  isOpen,
  onClose,
  currentTab,
  onNavigate,
  user,
  onLogout,
  onOpenVoice,
  onOpenAuth,
  lang = 'en',
  onLanguageChange,
  adminSection = 'overview',
  onSelectAdminSection
}) {
  const t = (k) => getTranslation(k, lang);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2000,
      display: 'flex'
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.2s ease'
        }}
      />

      {/* Drawer Content */}
      <div style={{
        position: 'relative',
        width: '85%',
        maxWidth: 360,
        height: '100%',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
        overflowY: 'auto',
        zIndex: 2010
      }}>
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0',
          background: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6F3DFF 0%, #BFE9FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 2px 8px rgba(111, 61, 255, 0.25)'
            }}>
              <Building2 size={18} color="#FFF" />
            </div>
            <div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#13151A' }}>
                RuralBiz <strong style={{ color: '#6F3DFF' }}>AI</strong>
              </span>
              <span style={{
                marginLeft: 6,
                background: '#EDE7FF',
                color: '#6F3DFF',
                fontSize: '0.62rem',
                padding: '2px 5px',
                borderRadius: 4,
                fontWeight: 700
              }}>
                SIH 26091
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: 8,
              padding: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User / Role Profile Header if logged in */}
        {user && (
          <div style={{
            padding: '14px 20px',
            background: user.role === 'admin' ? '#FFFBEB' : '#F5F3FF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: user.role === 'admin' ? '#FDE68A' : '#DDD6FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: user.role === 'admin' ? '#92400E' : '#5B21B6'
              }}>
                {user.role === 'admin' ? <ShieldCheck size={20} /> : <User size={20} />}
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1E293B' }}>
                  {user.full_name || user.email}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'capitalize' }}>
                  {user.role === 'admin' ? 'System Administrator' : 'Rural Entrepreneur'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!user ? (
            <PublicNavbar 
              currentTab={currentTab} 
              onNavigate={(tab) => {
                onNavigate(tab);
                onClose();
              }}
              onOpenAuth={(mode) => {
                onClose();
                onOpenAuth(mode);
              }}
              lang={lang}
              isMobile={true}
            />
          ) : user.role === 'admin' ? (
            <AdminNavigation 
              currentSection={adminSection}
              onSelectSection={(sec) => {
                onSelectAdminSection(sec);
                onClose();
              }}
              lang={lang}
              isMobile={true}
            />
          ) : (
            <UserNavigation 
              currentTab={currentTab}
              onNavigate={(tab) => {
                onNavigate(tab);
                onClose();
              }}
              lang={lang}
              isMobile={true}
            />
          )}

          {/* Voice Assistant Trigger */}
          <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
            <VoiceAssistantButton 
              onClick={() => {
                onClose();
                onOpenVoice();
              }}
              lang={lang}
              isMobile={true}
            />
          </div>

          {/* Language Selector */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: 6 }}>
              Select Language / भाषा बदला
            </div>
            <LanguageSelector 
              currentLang={lang} 
              onLanguageChange={(newLang) => {
                onLanguageChange(newLang);
              }}
              isMobile={true}
            />
          </div>
        </div>

        {/* Bottom Actions for Authenticated User */}
        {user && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #E2E8F0',
            background: '#F8FAFC'
          }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '11px',
                borderRadius: 8,
                border: '1.5px solid #FCA5A5',
                background: '#FEF2F2',
                color: '#DC2626',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              <span>{t('logout')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
