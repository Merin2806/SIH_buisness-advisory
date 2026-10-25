import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  User
} from 'lucide-react';
import { 
  PublicNavbar, 
  UserNavigation, 
  AdminNavigation, 
  MobileNavigationDrawer, 
  LanguageSelector, 
  VoiceAssistantButton 
} from './common';
import { getTranslation } from '../i18n';

export default function Navbar({ 
  currentTab, 
  setTab, 
  user, 
  onLogout, 
  onOpenVoice, 
  onOpenAuth, 
  lang = 'en', 
  onLanguageChange,
  adminSection = 'overview',
  setAdminSection
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const t = (k) => getTranslation(k, lang);

  const handleBrandClick = () => {
    if (!user) {
      setTab('landing');
    } else if (user.role === 'admin') {
      setTab('admin');
      if (setAdminSection) setAdminSection('overview');
    } else {
      setTab('dashboard');
    }
    setMobileDrawerOpen(false);
  };

  const handleSelectAdminSection = (sec) => {
    setTab('admin');
    if (setAdminSection) setAdminSection(sec);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      <header className="site-header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        height: 'var(--navbar-height, 68px)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container" style={{
          width: '100%',
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          {/* Group 1: Brand Identity */}
          <div 
            className="nav-brand" 
            onClick={handleBrandClick}
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10,
              flexShrink: 0 
            }}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6F3DFF 0%, #BFE9FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 4px 12px rgba(111, 61, 255, 0.28)'
            }}>
              <Building2 size={22} color="#FFF" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#13151A', letterSpacing: '-0.02em' }}>
                  RuralBiz <strong style={{ color: '#6F3DFF' }}>AI</strong>
                </span>
                <span className="nav-brand-badge" style={{ 
                  background: '#EDE7FF', 
                  color: '#6F3DFF', 
                  fontSize: '0.68rem', 
                  padding: '2px 7px', 
                  borderRadius: 5, 
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}>
                  SIH 26091
                </span>
              </div>
            </div>
          </div>

          {/* Group 2: Desktop Navigation Links (Hidden on mobile) */}
          <nav className="desktop-nav-links" style={{
            display: 'none', // Handled via responsive class/media queries in index.css
            alignItems: 'center'
          }}>
            {!user ? (
              <PublicNavbar 
                currentTab={currentTab} 
                onNavigate={setTab} 
                onOpenAuth={onOpenAuth} 
                lang={lang} 
              />
            ) : user.role === 'admin' ? (
              <AdminNavigation 
                currentSection={adminSection} 
                onSelectSection={handleSelectAdminSection} 
                lang={lang} 
              />
            ) : (
              <UserNavigation 
                currentTab={currentTab} 
                onNavigate={setTab} 
                lang={lang} 
              />
            )}
          </nav>

          {/* Group 3: Utility Cluster & Profile */}
          <div className="nav-utility-cluster" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Language Selector (Always accessible) */}
            <div className="desktop-only-widget">
              <LanguageSelector 
                currentLang={lang} 
                onLanguageChange={onLanguageChange} 
              />
            </div>

            {/* Voice Assistant Mic Trigger */}
            <div className="desktop-only-widget">
              <VoiceAssistantButton 
                onClick={onOpenVoice} 
                lang={lang} 
                showLabel={false} 
              />
            </div>

            {/* Desktop Auth State */}
            <div className="desktop-only-widget">
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    background: user.role === 'admin' ? '#FEF3C7' : '#EDE7FF',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: user.role === 'admin' ? '#B45309' : '#6F3DFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    border: user.role === 'admin' ? '1px solid #FDE68A' : '1px solid #DDD6FE'
                  }}>
                    {user.role === 'admin' ? <ShieldCheck size={14} /> : <User size={14} />}
                    <span>{user.full_name?.split(' ')[0] || user.email?.split('@')[0]}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={onLogout}
                    style={{
                      border: '1.5px solid #E2E8F0',
                      background: '#FFFFFF',
                      color: '#64748B',
                      padding: '7px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 0.15s ease'
                    }}
                    title={t('logout')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FCA5A5';
                      e.currentTarget.style.color = '#DC2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.color = '#64748B';
                    }}
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button 
                    type="button"
                    onClick={() => onOpenAuth('login')}
                    className="btn-secondary"
                    style={{ padding: '7px 14px', fontSize: '0.84rem' }}
                  >
                    <LogIn size={14} />
                    <span>{t('login')}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => onOpenAuth('register')}
                    className="btn-primary"
                    style={{ padding: '7px 14px', fontSize: '0.84rem' }}
                  >
                    <UserPlus size={14} />
                    <span>{t('signUp')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Voice Trigger (Compact for small screens) */}
            <div className="mobile-only-widget">
              <button
                type="button"
                onClick={onOpenVoice}
                aria-label="Voice Assistant"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  border: '1.5px solid #BFE9FF',
                  background: '#F0F9FF',
                  color: '#6F3DFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <VoiceAssistantButton onClick={onOpenVoice} lang={lang} showLabel={false} />
              </button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className="mobile-hamburger-btn"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              aria-label={mobileDrawerOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileDrawerOpen}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#1E293B',
                display: 'none', // Shown on mobile via CSS
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Modal */}
      <MobileNavigationDrawer 
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        currentTab={currentTab}
        onNavigate={setTab}
        user={user}
        onLogout={onLogout}
        onOpenVoice={onOpenVoice}
        onOpenAuth={onOpenAuth}
        lang={lang}
        onLanguageChange={onLanguageChange}
        adminSection={adminSection}
        onSelectAdminSection={handleSelectAdminSection}
      />
    </>
  );
}
