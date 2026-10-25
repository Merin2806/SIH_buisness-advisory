import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calculator, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  TrendingUp, 
  CreditCard, 
  AlertTriangle,
  Info,
  Volume2,
  VolumeX,
  Phone,
  Landmark,
  Layers,
  ArrowRight,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  HelpCircle,
  Wallet,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../api';
import { getTranslation } from '../i18n';
import { INDIAN_BANKS_LIST } from '../data/indiaLocations';

export default function LoanAdvisor({ 
  user, 
  initialAssessmentId = null, 
  onStartNewAssessment,
  lang = 'en'
}) {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(initialAssessmentId);
  const [adviceData, setAdviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, yojanas, banks, steps, documents, emi, risks
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Banking Details Form State
  const [hasBankAccount, setHasBankAccount] = useState(true);
  const [selectedBanks, setSelectedBanks] = useState(["Bank of Baroda", "Bank of Maharashtra"]);
  const [bankSearch, setBankSearch] = useState("");
  const [customBankName, setCustomBankName] = useState("");
  const [accountTypes, setAccountTypes] = useState(["Savings Account"]);
  const [preferExistingBank, setPreferExistingBank] = useState(true);
  const [hasPreviousBusinessLoan, setHasPreviousBusinessLoan] = useState(false);
  const [isSavingBanking, setIsSavingBanking] = useState(false);
  const [bankingSavedMsg, setBankingSavedMsg] = useState("");
  const [isBankingOpen, setIsBankingOpen] = useState(true);

  const t = (k) => getTranslation(k, lang);

  useEffect(() => {
    loadUserAssessments();
  }, []);

  useEffect(() => {
    if (selectedAssessmentId) {
      loadLoanAdvice(selectedAssessmentId);
    }
  }, [selectedAssessmentId]);

  const loadUserAssessments = async () => {
    setLoading(true);
    try {
      const data = await api.getAssessments();
      setAssessments(data);
      if (data && data.length > 0) {
        if (!selectedAssessmentId) {
          setSelectedAssessmentId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load assessments:', err);
      setError('Could not load your saved assessments.');
    } finally {
      setLoading(false);
    }
  };

  const loadLoanAdvice = async (id) => {
    setLoading(true);
    setError('');
    try {
      const advice = await api.getLoanAdvice(id);
      setAdviceData(advice);
    } catch (err) {
      console.error('Failed to load loan advice:', err);
      setError(err.message || 'Unable to retrieve loan guidance for this assessment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adviceData?.user_banking_details) {
      const b = adviceData.user_banking_details;
      if (b.has_bank_account !== undefined) setHasBankAccount(b.has_bank_account);
      if (Array.isArray(b.selected_banks)) setSelectedBanks(b.selected_banks);
      if (b.custom_bank_name) setCustomBankName(b.custom_bank_name);
      if (Array.isArray(b.account_types)) setAccountTypes(b.account_types);
      if (b.prefer_existing_bank !== undefined) setPreferExistingBank(b.prefer_existing_bank);
      if (b.has_previous_business_loan !== undefined) setHasPreviousBusinessLoan(b.has_previous_business_loan);
    }
  }, [adviceData]);

  const handleToggleBank = (bank) => {
    if (selectedBanks.includes(bank)) {
      setSelectedBanks(selectedBanks.filter(b => b !== bank));
    } else {
      setSelectedBanks([...selectedBanks, bank]);
    }
  };

  const handleToggleAccountType = (type) => {
    if (accountTypes.includes(type)) {
      setAccountTypes(accountTypes.filter(t => t !== type));
    } else {
      setAccountTypes([...accountTypes, type]);
    }
  };

  const handleSaveBankingDetails = async () => {
    setIsSavingBanking(true);
    setBankingSavedMsg('');
    setError('');
    try {
      await api.saveBankingDetails({
        assessment_id: selectedAssessmentId,
        has_bank_account: hasBankAccount,
        selected_banks: selectedBanks,
        custom_bank_name: customBankName,
        account_types: accountTypes,
        prefer_existing_bank: preferExistingBank,
        has_previous_business_loan: hasPreviousBusinessLoan
      });
      setBankingSavedMsg('Your banking preferences have been saved. Schemes & bank recommendations have been recalculated!');
      await loadLoanAdvice(selectedAssessmentId);
    } catch (err) {
      setError(err.message || 'Failed to save banking preferences.');
    } finally {
      setIsSavingBanking(false);
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'mr') utterance.lang = 'mr-IN';
    else if (lang === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (loading && !adviceData) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="spinner" style={{ margin: '0 auto 16px auto' }}></div>
        <p>Evaluating verified government schemes and bank financing options...</p>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', maxWidth: 600, margin: '0 auto' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#EDE7FF',
            color: '#6F3DFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Landmark size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: 10 }}>No Business Assessment Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24 }}>
            To generate personalized government scheme matching (Mudra, NABARD, PMEGP) and calculate exact EMIs, please complete a business assessment first.
          </p>
          <button 
            onClick={onStartNewAssessment}
            className="btn-primary"
            style={{ padding: '12px 24px' }}
          >
            <span>Start Business Assessment</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  const {
    business_name,
    category_name,
    active_scheme_name,
    section_a_loan_sizing: secA,
    section_b_scheme_comparison: schemes,
    section_c_participating_banks: banks,
    section_d_application_steps: steps,
    section_e_document_checklist: documents,
    section_f_emi_breakdown: emi,
    section_g_financial_guidance: guidance
  } = adviceData || {};

  return (
    <div className="container" style={{ padding: '36px 24px 80px 24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6F3DFF 0%, #3B1B99 100%)',
        borderRadius: 20,
        padding: '30px 36px',
        color: '#FFFFFF',
        marginBottom: 28,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: '0 10px 25px rgba(111, 61, 255, 0.25)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.16)', padding: '4px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>
            <ShieldCheck size={14} color="#BFE9FF" />
            <span>SIH 26091 • Verified Financial Structuring Engine</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', marginBottom: 6 }}>
            {t('loanAdvisorTitle')}
          </h1>
          <p style={{ color: '#E2E8F0', fontSize: '0.92rem' }}>
            {t('loanAdvisorSubtitle')}
          </p>
        </div>

        {/* Assessment Switcher Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '6px 14px', borderRadius: 12 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#BFE9FF', fontWeight: 600 }}>Active Assessment</label>
            <select
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(Number(e.target.value))}
              style={{
                background: 'transparent',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {assessments.map((a) => (
                <option key={a.id} value={a.id} style={{ color: '#13151A' }}>
                  {a.proposed_business_name} (₹{a.estimated_project_cost?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => speakText(`Loan advisory for ${business_name}. Recommended loan principal is ₹${emi?.loan_principal?.toLocaleString()} under ${active_scheme_name}. Monthly EMI is ₹${emi?.monthly_emi?.toLocaleString()}. ${secA?.affordability_verdict}`)}
            style={{
              background: isSpeaking ? '#EF4444' : '#BFE9FF',
              color: isSpeaking ? '#FFFFFF' : '#13151A',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isSpeaking ? t('stopAudio') : t('readAloud')}</span>
          </button>
        </div>
      </div>

      {/* INITIAL SECTION: Your Banking Details */}
      <div className="card" style={{
        marginBottom: 28,
        border: '1.5px solid #6F3DFF',
        background: 'linear-gradient(180deg, #FAF8FF 0%, #FFFFFF 100%)',
        boxShadow: '0 4px 20px rgba(111, 61, 255, 0.08)'
      }}>
        <div className="loan-advisor-banking-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#6F3DFF',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Landmark size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', color: '#1E293B', margin: 0 }}>Your Banking Details</h2>
                <span style={{ fontSize: '0.72rem', background: '#EDE7FF', color: '#6F3DFF', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                  Personalized Financing Match
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 2 }}>
                Tell us where you bank so we prioritize your relationship branch for Mudra, NABARD, or PMEGP subsidies.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsBankingOpen(!isBankingOpen)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
          >
            <span>{isBankingOpen ? 'Hide Section' : 'Edit Banking'}</span>
            {isBankingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {isBankingOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Question 1: Do you currently have a bank account? */}
            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                1. Do you currently have a bank account? <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="banking-question-buttons">
                <button
                  type="button"
                  onClick={() => setHasBankAccount(true)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    border: hasBankAccount ? '2px solid #6F3DFF' : '1px solid #CBD5E1',
                    background: hasBankAccount ? '#EDE7FF' : '#FFFFFF',
                    color: hasBankAccount ? '#6F3DFF' : '#334155',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.88rem'
                  }}
                >
                  Yes, I have an active bank account
                </button>
                <button
                  type="button"
                  onClick={() => setHasBankAccount(false)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    border: !hasBankAccount ? '2px solid #6F3DFF' : '1px solid #CBD5E1',
                    background: !hasBankAccount ? '#EDE7FF' : '#FFFFFF',
                    color: !hasBankAccount ? '#6F3DFF' : '#334155',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.88rem'
                  }}
                >
                  No, I do not have a bank account currently
                </button>
              </div>
            </div>

            {hasBankAccount ? (
              <>
                {/* Question 2: Which bank do you use? (Multi-select searchable dropdown) */}
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    <span>2. Which bank do you use? (Multiple selections allowed) <span style={{ color: '#EF4444' }}>*</span></span>
                    <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 400 }}>Selected: {selectedBanks.length}</span>
                  </label>

                  {/* Active Bank Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    {selectedBanks.map((b) => (
                      <span
                        key={b}
                        style={{
                          background: '#6F3DFF',
                          color: '#FFFFFF',
                          padding: '4px 10px',
                          borderRadius: 999,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <span>{b}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleBank(b)}
                          style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: 0, display: 'flex' }}
                          title="Remove bank"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Searchable Add Bank Select */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleToggleBank(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.88rem',
                        background: '#FFFFFF',
                        fontWeight: 600
                      }}
                    >
                      <option value="">+ Add an Indian Bank from list...</option>
                      {INDIAN_BANKS_LIST.map((bName) => (
                        <option key={bName} value={bName} disabled={selectedBanks.includes(bName)}>
                          {bName} {selectedBanks.includes(bName) ? '✓ (Selected)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Other Bank option text field if selected */}
                  {selectedBanks.some(b => b.toLowerCase().includes('other')) && (
                    <div style={{ marginTop: 8 }}>
                      <input
                        type="text"
                        placeholder="Please type your bank or cooperative society name..."
                        value={customBankName}
                        onChange={(e) => setCustomBankName(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>
                  )}
                </div>

                {/* Question 3: Account Types */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    3. What type of account(s) do you maintain?
                  </label>
                  <div className="grid-responsive-4" style={{ gap: 10 }}>
                    {[
                      "Savings Account",
                      "Current Account",
                      "Jan Dhan Account (PMJDY)",
                      "Cooperative Society Account"
                    ].map((type) => {
                      const isChecked = accountTypes.includes(type);
                      return (
                        <label
                          key={type}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: isChecked ? '1.5px solid #6F3DFF' : '1px solid #CBD5E1',
                            background: isChecked ? '#FAF5FF' : '#FFFFFF',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: isChecked ? 700 : 500,
                            color: isChecked ? '#6F3DFF' : '#334155'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleAccountType(type)}
                            style={{ accentColor: '#6F3DFF' }}
                          />
                          <span>{type}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Question 4: Preference */}
                <div className="grid-responsive-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      4. Lending Approach Preference
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="bankPref"
                          checked={preferExistingBank === true}
                          onChange={() => setPreferExistingBank(true)}
                          style={{ accentColor: '#6F3DFF' }}
                        />
                        <span>Prefer to approach my existing bank (faster documentation)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="bankPref"
                          checked={preferExistingBank === false}
                          onChange={() => setPreferExistingBank(false)}
                          style={{ accentColor: '#6F3DFF' }}
                        />
                        <span>Open to any participating bank with optimal subsidies</span>
                      </label>
                    </div>
                  </div>

                  {/* Question 5: Previous Business Loan */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      5. Prior Commercial Loan History
                    </label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => setHasPreviousBusinessLoan(false)}
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: 8,
                          border: !hasPreviousBusinessLoan ? '2px solid #6F3DFF' : '1px solid #CBD5E1',
                          background: !hasPreviousBusinessLoan ? '#EDE7FF' : '#FFFFFF',
                          color: !hasPreviousBusinessLoan ? '#6F3DFF' : '#334155',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        First-time borrower (PMMY / PMEGP fresh entry)
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasPreviousBusinessLoan(true)}
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: 8,
                          border: hasPreviousBusinessLoan ? '2px solid #6F3DFF' : '1px solid #CBD5E1',
                          background: hasPreviousBusinessLoan ? '#EDE7FF' : '#FFFFFF',
                          color: hasPreviousBusinessLoan ? '#6F3DFF' : '#334155',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        Yes, taken past business loan
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px 16px', borderRadius: 10, fontSize: '0.86rem', color: '#1E40AF' }}>
                <strong>No Existing Account:</strong> Under verified government schemes (PMMY Mudra, PMEGP, Stand-Up India), eligible applicants can open a zero-balance current/savings account at the time of preliminary sanction. You do not need to open an account in advance.
              </div>
            )}

            {/* Save Button & Security Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: '#64748B' }}>
                <ShieldCheck size={16} color="#10B981" />
                <span>Zero Credentials Policy: We never request account numbers, passwords, PINs, or OTPs.</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {bankingSavedMsg && (
                  <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>
                    {bankingSavedMsg}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveBankingDetails}
                  disabled={isSavingBanking}
                  className="btn-primary"
                  style={{ padding: '9px 20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Save size={16} />
                  <span>{isSavingBanking ? 'Re-evaluating Options...' : 'Save & Re-evaluate Loan Options'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '2px solid #E2E8F0',
        paddingBottom: 10,
        marginBottom: 24,
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: 'A. Loan Sizing & Affordability' },
          { id: 'yojanas', label: 'B. Applicable Yojanas' },
          { id: 'banks', label: 'C. Participating Banks' },
          { id: 'steps', label: 'D. How to Apply' },
          { id: 'documents', label: 'E. Required Documents' },
          { id: 'emi', label: 'F. EMI & Repayment Schedule' },
          { id: 'risks', label: 'G. Financial Risk Advice' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === tab.id ? '#6F3DFF' : 'transparent',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.86rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB A: Loan Sizing & Affordability */}
      {activeTab === 'overview' && secA && (
        <div>
          <div className="grid-responsive-4" style={{ marginBottom: 24 }}>
            <div className="card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Project Cost
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 4 }}>
                ₹{secA.total_project_cost?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Full capital requirement
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Your Seed Capital
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#10B981', marginTop: 4 }}>
                ₹{secA.available_own_contribution?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#10B981', marginTop: 4 }}>
                Promoter margin available
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Eligible Loan Principal
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#6F3DFF', marginTop: 4 }}>
                ₹{secA.potential_eligible_loan?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                Recommended bank borrowing
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Capital Subsidy
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0284C7', marginTop: 4 }}>
                ₹{secA.subsidy_eligible?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#0284C7', marginTop: 4 }}>
                Back-ended govt grant
              </div>
            </div>
          </div>

          {/* Affordability Verdict Box */}
          <div className="card" style={{
            background: secA.affordability_ratio_pct <= 40 ? '#F0FDF4' : secA.affordability_ratio_pct <= 60 ? '#FFFBEB' : '#FEF2F2',
            border: `1px solid ${secA.affordability_ratio_pct <= 40 ? '#BBF7D0' : secA.affordability_ratio_pct <= 60 ? '#FDE68A' : '#FECACA'}`,
            marginBottom: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                background: secA.affordability_ratio_pct <= 40 ? '#10B981' : secA.affordability_ratio_pct <= 60 ? '#F59E0B' : '#EF4444',
                color: '#FFF',
                padding: 10,
                borderRadius: 10
              }}>
                <ShieldCheck size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#13151A' }}>{secA.affordability_status}</h3>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1'
                  }}>
                    EMI / Profit Ratio: {secA.affordability_ratio_pct}%
                  </span>
                </div>
                <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.5 }}>
                  {secA.affordability_verdict}
                </p>
                <div style={{ marginTop: 10, fontSize: '0.82rem', color: '#64748B' }}>
                  <strong>Important Rule:</strong> Do not borrow the maximum ceiling merely because it is permitted. Debt servicing must remain comfortable during seasonal slow months.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: Which Government Scheme (Yojana) is Applicable? */}
      {activeTab === 'yojanas' && schemes && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{t('sectionBTitle')}</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Audited government scheme catalogue verified against official RBI, MSME, and NABARD circulars.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: '0.8rem' }}>
              <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>Verified Source</span>
              <span style={{ background: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>Pending Verification</span>
              <span style={{ background: '#E0E7FF', color: '#4338CA', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>Demonstration Data</span>
            </div>
          </div>

          {schemes.map((s, idx) => (
            <div key={idx} className="card" style={{ borderLeft: `5px solid ${s.is_eligible ? '#10B981' : '#CBD5E1'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>{s.scheme_name}</h3>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: s.verification_status === 'Verified' ? '#DCFCE7' : s.verification_status === 'Demonstration Data' ? '#E0E7FF' : '#FEF3C7',
                      color: s.verification_status === 'Verified' ? '#15803D' : s.verification_status === 'Demonstration Data' ? '#4338CA' : '#B45309'
                    }}>
                      {s.verification_status}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: s.is_eligible ? '#EDE7FF' : '#F1F5F9',
                      color: s.is_eligible ? '#6F3DFF' : '#64748B'
                    }}>
                      {s.is_eligible ? 'Eligible' : 'Ineligible'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Administering Authority: <strong>{s.department || 'Central / State Ministry'}</strong> • Rule Effective: {s.effective_date_str}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {s.official_source_url && (
                    <a
                      href={s.official_source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <span>Official Circular</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {s.official_application_website && (
                    <a
                      href={s.official_application_website}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <span>Apply Portal</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Financial Parameters Grid */}
              <div className="grid-responsive-6" style={{ marginTop: 16, background: '#F8FAFC', padding: 14, borderRadius: 10, fontSize: '0.85rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Max Project Cost</div>
                  <div style={{ fontWeight: 700 }}>₹{s.max_project_cost_limit?.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Min Promoter Margin</div>
                  <div style={{ fontWeight: 700 }}>{s.min_margin_pct}%</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Capital Subsidy</div>
                  <div style={{ fontWeight: 700, color: '#10B981' }}>{s.subsidy_pct}% (₹{s.subsidy_amount?.toLocaleString()})</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Effective Interest</div>
                  <div style={{ fontWeight: 700, color: '#6F3DFF' }}>{s.effective_interest_rate}% p.a.</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Tenure</div>
                  <div style={{ fontWeight: 700 }}>{s.tenure_months} months</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Moratorium</div>
                  <div style={{ fontWeight: 700 }}>{s.moratorium_months} months</div>
                </div>
              </div>

              {/* Eligibility Reasons */}
              <div style={{ marginTop: 12, fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700, color: s.is_eligible ? '#10B981' : '#EF4444' }}>
                  {s.is_eligible ? 'Eligibility Confirmation:' : 'Ineligibility Ground:'}
                </span>
                <span style={{ color: 'var(--text-secondary)', marginLeft: 6 }}>
                  {Array.isArray(s.reasons) ? s.reasons.join(', ') : s.reasons}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB C: Participating Banks & Lending Portals */}
      {activeTab === 'banks' && banks && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{t('sectionCTitle')}</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Public sector and regional rural banks actively disbursing under Mudra, PMEGP, and NABARD.
            </p>
          </div>

          <div className="grid-responsive-2">
            {banks.map((b, idx) => (
              <div 
                key={idx} 
                className="card"
                style={{
                  border: b.is_user_bank ? '2px solid #6F3DFF' : '1px solid #E2E8F0',
                  background: b.is_user_bank ? '#FAF8FF' : '#FFFFFF',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: b.is_user_bank ? '#6F3DFF' : '#EDE7FF',
                      color: b.is_user_bank ? '#FFFFFF' : '#6F3DFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Landmark size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>{b.bank_name}</h3>
                        {b.is_user_bank && (
                          <span style={{ background: '#EDE7FF', color: '#6F3DFF', fontSize: '0.68rem', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
                            ★ Your Bank
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#6F3DFF', fontWeight: 600 }}>{b.product_name}</div>
                    </div>
                  </div>
                  <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.72rem', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                    Active Portal
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                  {b.notes}
                </p>

                <div style={{ display: 'flex', gap: 8, fontSize: '0.82rem' }}>
                  {b.official_url && (
                    <a
                      href={b.official_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary"
                      style={{ flex: 1, padding: '7px 10px', fontSize: '0.8rem', justifyContent: 'center' }}
                    >
                      <span>Bank Portal</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {b.branch_locator && (
                    <a
                      href={b.branch_locator}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                      style={{ flex: 1, padding: '7px 10px', fontSize: '0.8rem', justifyContent: 'center' }}
                    >
                      <MapPin size={12} />
                      <span>Find Branch</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB D: How to Apply (Step-by-Step) */}
      {activeTab === 'steps' && steps && (
        <div className="card">
          <h2 style={{ fontSize: '1.3rem', marginBottom: 6 }}>{t('sectionDTitle')}</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
            Follow this bank-sanctioned protocol to ensure minimal processing delays.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {steps.map((st, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#6F3DFF',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1, background: '#F8FAFC', padding: '14px 18px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.92rem', color: '#1E293B', lineHeight: 1.5 }}>
                    {st}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB E: Required Documents Checklist */}
      {activeTab === 'documents' && documents && (
        <div className="card">
          <h2 style={{ fontSize: '1.3rem', marginBottom: 6 }}>{t('sectionETitle')}</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
            Prepare these indicative documents before scheduling your credit appraisal with the branch manager.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {documents.map((doc, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 10,
                background: '#F8FAFC',
                border: '1px solid #E2E8F0'
              }}>
                <CheckCircle size={18} color="#10B981" />
                <span style={{ fontSize: '0.9rem', color: '#1E293B' }}>{doc}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: 12, background: '#EFF6FF', borderRadius: 10, fontSize: '0.82rem', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={16} />
            <span>Note: This checklist is indicative based on standard Mudra/NABARD requirements. Your specific bank branch may request local revenue extracts.</span>
          </div>
        </div>
      )}

      {/* TAB F: EMI & Repayment Schedule */}
      {activeTab === 'emi' && emi && (
        <div>
          <div className="grid-responsive-4" style={{ marginBottom: 24 }}>
            <div className="card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loan Principal</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 4 }}>
                ₹{emi.loan_principal?.toLocaleString()}
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Interest Rate</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#6F3DFF', marginTop: 4 }}>
                {emi.effective_interest_rate}% p.a.
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6F3DFF' }}>{emi.rate_type}</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tenure / Moratorium</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 4 }}>
                {emi.tenure_months} mo
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10B981' }}>{emi.moratorium_months} mo moratorium</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly EMI</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#10B981', marginTop: 4 }}>
                ₹{emi.monthly_emi?.toLocaleString()}/mo
              </div>
            </div>
          </div>

          {/* Repayment Schedule Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: 12 }}>Indicative 24-Month Amortization Schedule</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 12px' }}>Month</th>
                    <th style={{ padding: '10px 12px' }}>Opening Balance</th>
                    <th style={{ padding: '10px 12px' }}>EMI Amount</th>
                    <th style={{ padding: '10px 12px' }}>Principal Part</th>
                    <th style={{ padding: '10px 12px' }}>Interest Part</th>
                    <th style={{ padding: '10px 12px' }}>Closing Balance</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {emi.repayment_schedule_preview?.map((r) => (
                    <tr key={r.month_number} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>Month {r.month_number}</td>
                      <td style={{ padding: '10px 12px' }}>₹{r.opening_balance?.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#6F3DFF' }}>₹{r.emi_amount?.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', color: '#10B981' }}>₹{r.principal_component?.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', color: '#EF4444' }}>₹{r.interest_component?.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px' }}>₹{r.closing_balance?.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px' }}>
                        {r.is_moratorium ? (
                          <span style={{ background: '#FEF3C7', color: '#B45309', padding: '2px 6px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
                            Moratorium
                          </span>
                        ) : (
                          <span style={{ background: '#DCFCE7', color: '#15803D', padding: '2px 6px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
                            Regular EMI
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB G: Financial Guidance & Risk Advice */}
      {activeTab === 'risks' && guidance && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{t('sectionGTitle')}</h2>
          {guidance.map((g, idx) => (
            <div key={idx} className="card" style={{ borderLeft: '4px solid #6F3DFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <TrendingUp size={18} color="#6F3DFF" />
                <h3 style={{ fontSize: '1.05rem', color: '#1E293B' }}>{g.topic}</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                {g.recommendation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
