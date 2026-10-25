import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Calculator, 
  Mic, 
  TrendingUp, 
  FileText, 
  MapPin, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Landmark,
  Eye,
  CreditCard
} from 'lucide-react';
import { api } from '../api';
import { getTranslation } from '../i18n';

export default function UserDashboard({ 
  user, 
  onNewAssessment, 
  onOpenReport, 
  onOpenBudgeter, 
  onOpenLoanAdvisor, 
  onOpenVoice,
  lang = 'en'
}) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = (k) => getTranslation(k, lang);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const data = await api.getAssessments();
      setAssessments(data);
    } catch (err) {
      console.error('Failed to load assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalAssessments = assessments.length;
  const totalCapitalPlanned = assessments.reduce((acc, curr) => acc + (curr.estimated_project_cost || 0), 0);
  const totalLoanRequested = assessments.reduce((acc, curr) => acc + (curr.loan_principal || 0), 0);

  return (
    <div className="container" style={{ padding: '36px 24px 80px 24px' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6F3DFF 0%, #3B1B99 100%)',
        borderRadius: 22,
        padding: '32px 36px',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20,
        marginBottom: 32,
        boxShadow: '0 12px 28px rgba(111, 61, 255, 0.25)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.16)', padding: '4px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>
            <ShieldCheck size={14} color="#BFE9FF" />
            <span>Authenticated Rural Entrepreneur</span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: 6 }}>
            {t('welcomeUser')} {user?.full_name || 'Entrepreneur'}!
          </h1>
          <p style={{ color: '#E2E8F0', fontSize: '0.94rem' }}>
            Village: {user?.village || 'Baramati Rural'} • District: {user?.district || 'Pune'} • State: Maharashtra
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={onNewAssessment}
            style={{
              background: '#BFE9FF',
              color: '#13151A',
              fontWeight: 700,
              padding: '11px 20px',
              borderRadius: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <PlusCircle size={18} />
            <span>{t('startAssessment')}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid-responsive-4" style={{ marginBottom: 32 }}>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            {t('totalAssessmentsCount')}
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 4 }}>
            {totalAssessments}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={12} />
            <span>Ground-truth verified</span>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Capital Planned
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6F3DFF', marginTop: 4 }}>
            ₹{totalCapitalPlanned.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Venture investments
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Potential Loan Demand
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: 4 }}>
            ₹{totalLoanRequested.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: 4 }}>
            Mudra & NABARD eligible
          </div>
        </div>

        <div className="card" style={{ background: '#F8FAFC' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Dedicated Navigation
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <button 
              onClick={() => onOpenLoanAdvisor(assessments[0]?.id)}
              style={{
                flex: 1,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#6F3DFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                cursor: 'pointer'
              }}
            >
              <Landmark size={14} />
              <span>Loan Advisor</span>
            </button>
            <button 
              onClick={onOpenBudgeter}
              style={{
                flex: 1,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                cursor: 'pointer'
              }}
            >
              <Calculator size={14} />
              <span>Budgeter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Assessments Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', marginBottom: 4 }}>{t('recentAssessments')}</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Ground-truth business feasibility dossiers and verified financing options belonging to your account.
            </p>
          </div>

          <button 
            onClick={onNewAssessment}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
          >
            <PlusCircle size={15} />
            <span>{t('startAssessment')}</span>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            Loading your verified reports...
          </div>
        ) : assessments.length === 0 ? (
          /* Empty State */
          <div style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: '#F8FAFC',
            borderRadius: 16,
            border: '2px dashed #CBD5E1'
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#EDE7FF',
              color: '#6F3DFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto'
            }}>
              <FileText size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>{t('noAssessmentsYet')}</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 18px auto', fontSize: '0.9rem' }}>
              Evaluate your village location, check mapped competitors on OpenStreetMap, and match Mudra or NABARD loans.
            </p>
            <button 
              onClick={onNewAssessment}
              className="btn-primary"
              style={{ padding: '10px 22px' }}
            >
              <PlusCircle size={16} />
              <span>{t('startFirstAssessment')}</span>
            </button>
          </div>
        ) : (
          /* Assessment Table */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Proposed Business</th>
                  <th style={{ padding: '12px 14px' }}>Category</th>
                  <th style={{ padding: '12px 14px' }}>Location</th>
                  <th style={{ padding: '12px 14px' }}>Project Cost</th>
                  <th style={{ padding: '12px 14px' }}>Indicative EMI</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#1E293B' }}>
                      {a.proposed_business_name}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        background: '#EBF7FF',
                        color: '#0284C7',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: '0.76rem',
                        fontWeight: 600
                      }}>
                        {a.category_name}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: '#64748B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} color="#6F3DFF" />
                        <span>{a.village}, {a.district}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px', fontWeight: 700 }}>
                      ₹{a.estimated_project_cost?.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px', color: '#6F3DFF', fontWeight: 700 }}>
                      ₹{a.monthly_emi ? a.monthly_emi.toLocaleString() : '—'}/mo
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => onOpenLoanAdvisor(a.id)}
                          style={{
                            background: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            color: '#15803D',
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <Landmark size={13} />
                          <span>Loan Advice</span>
                        </button>
                        <button 
                          onClick={() => onOpenReport(a.id)}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                          <span>{t('viewReport')}</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
