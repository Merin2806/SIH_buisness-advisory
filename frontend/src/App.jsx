import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import AssessmentWizard from './components/AssessmentWizard';
import ReportViewer from './components/ReportViewer';
import LoanAdvisor from './components/LoanAdvisor';
import BudgeterPage from './components/BudgeterPage';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import VoiceModal from './components/VoiceModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import { getCurrentUser, setAuthToken, setCurrentUser as saveCurrentUser, api } from './api';
import { getTranslation } from './i18n';

export default function App() {
  const [currentTab, setCurrentTab] = useState('landing'); 
  // 'landing', 'dashboard', 'wizard', 'report', 'loan_advisor', 'budgeter', 'admin'
  const [tabHistory, setTabHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem('ruralbiz_lang') || 'en');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [adminSection, setAdminSection] = useState('overview');

  // Restore authenticated session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const cached = getCurrentUser();
      const token = localStorage.getItem('ruralbiz_token');
      if (token) {
        try {
          // Re-verify with backend to get fresh role and language preference
          const me = await api.getMe();
          const verifiedUser = {
            id: me.id,
            email: me.email,
            full_name: me.full_name,
            role: me.role,
            village: me.village,
            district: me.district
          };
          setCurrentUser(verifiedUser);
          saveCurrentUser(verifiedUser);
          if (me.preferred_language && ['en', 'mr', 'hi'].includes(me.preferred_language)) {
            setLang(me.preferred_language);
            localStorage.setItem('ruralbiz_lang', me.preferred_language);
          }
          // Redirect to appropriate dashboard upon opening if session valid
          if (me.role === 'admin') {
            setCurrentTab('admin');
          } else {
            setCurrentTab('dashboard');
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          api.logout();
          setCurrentUser(null);
          setCurrentTab('landing');
        }
      } else {
        setCurrentTab('landing');
      }
    };
    restoreSession();
  }, []);

  const handleLanguageChange = async (newLang) => {
    setLang(newLang);
    localStorage.setItem('ruralbiz_lang', newLang);
    if (currentUser) {
      try {
        await api.updateLanguage(newLang);
      } catch (err) {
        console.warn('Failed to persist language to backend profile:', err);
      }
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setCurrentTab('landing');
  };

  const handleAuthSuccess = (res) => {
    const userObj = {
      id: res.user_id,
      email: res.email,
      full_name: res.full_name,
      role: res.role
    };
    setCurrentUser(userObj);
    saveCurrentUser(userObj);
    if (res.role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const openAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleStartAssessment = () => {
    if (!currentUser) {
      openAuth('login');
    } else {
      setCurrentTab('wizard');
    }
  };

  const handleAssessmentCompleted = (id) => {
    setSelectedAssessmentId(id);
    setCurrentTab('report');
  };

  const handleViewReport = (id) => {
    setSelectedAssessmentId(id);
    setCurrentTab('report');
  };

  const handleOpenLoanAdvisor = (assessmentId = null) => {
    if (assessmentId) {
      setSelectedAssessmentId(assessmentId);
    }
    setCurrentTab('loan_advisor');
  };

  // Route protection with history tracking
  const navigateTab = (targetTab) => {
    // If route is protected and user is not logged in
    const protectedTabs = ['dashboard', 'wizard', 'report', 'loan_advisor', 'admin'];
    if (protectedTabs.includes(targetTab) && !currentUser) {
      openAuth('login');
      return;
    }
    // If route is admin and user is not admin
    if (targetTab === 'admin' && currentUser?.role !== 'admin') {
      setCurrentTab('dashboard');
      return;
    }
    if (targetTab !== currentTab) {
      setTabHistory((prev) => [...prev, currentTab]);
    }
    setCurrentTab(targetTab);
  };

  const handleGoBack = () => {
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory((prev) => prev.slice(0, -1));
      setCurrentTab(prevTab);
    } else {
      setCurrentTab(currentUser ? (currentUser.role === 'admin' ? 'admin' : 'dashboard') : 'landing');
    }
  };

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        currentTab={currentTab}
        setTab={navigateTab}
        user={currentUser}
        onLogout={handleLogout}
        onOpenVoice={() => setVoiceModalOpen(true)}
        onOpenAuth={openAuth}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        adminSection={adminSection}
        setAdminSection={setAdminSection}
      />

      <main style={{ flex: 1 }}>
        <ErrorBoundary onReset={() => setCurrentTab(currentUser ? 'dashboard' : 'landing')}>
          {/* PUBLIC FLOW: Landing Page */}
          {currentTab === 'landing' && (
            <LandingPage 
              onStartAssessment={handleStartAssessment}
              onExploreBudgeter={() => navigateTab('budgeter')}
              onOpenVoice={() => setVoiceModalOpen(true)}
              onOpenAuth={openAuth}
              lang={lang}
            />
          )}

          {/* AUTHENTICATED USER FLOW */}
          {currentTab === 'dashboard' && currentUser && (
            <UserDashboard 
              user={currentUser}
              onNewAssessment={handleStartAssessment}
              onOpenReport={handleViewReport}
              onOpenBudgeter={() => navigateTab('budgeter')}
              onOpenLoanAdvisor={handleOpenLoanAdvisor}
              onOpenVoice={() => setVoiceModalOpen(true)}
              lang={lang}
            />
          )}

          {currentTab === 'wizard' && currentUser && (
            <AssessmentWizard 
              onComplete={handleAssessmentCompleted}
              onCancel={handleGoBack}
              lang={lang}
            />
          )}

          {currentTab === 'report' && currentUser && selectedAssessmentId && (
            <ReportViewer 
              assessmentId={selectedAssessmentId}
              onBack={handleGoBack}
              onOpenLoanAdvisor={() => navigateTab('loan_advisor')}
              lang={lang}
            />
          )}

          {currentTab === 'loan_advisor' && currentUser && (
            <LoanAdvisor 
              user={currentUser}
              initialAssessmentId={selectedAssessmentId}
              onStartNewAssessment={handleStartAssessment}
              onBack={handleGoBack}
              lang={lang}
            />
          )}

          {currentTab === 'budgeter' && (
            <BudgeterPage 
              user={currentUser} 
              onBack={handleGoBack}
              lang={lang} 
            />
          )}

          {/* ADMIN FLOW */}
          {currentTab === 'admin' && currentUser?.role === 'admin' && (
            <AdminDashboard 
              user={currentUser} 
              lang={lang}
              activeSection={adminSection}
              onSectionChange={setAdminSection}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal 
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          lang={lang}
        />
      )}

      {/* Voice Assistant Modal */}
      {voiceModalOpen && (
        <VoiceModal 
          onClose={() => setVoiceModalOpen(false)}
          onStartWithPrompt={(prompt) => {
            handleStartAssessment();
          }}
          lang={lang}
        />
      )}
    </div>
  );
}
