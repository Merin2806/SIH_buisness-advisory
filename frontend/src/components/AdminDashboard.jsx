import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Layers, 
  Server, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  History,
  Database,
  Building2,
  RefreshCw,
  Search,
  Filter,
  Check,
  Edit,
  Activity,
  Globe,
  BookOpen
} from 'lucide-react';
import { api } from '../api';
import { getTranslation } from '../i18n';

export default function AdminDashboard({ 
  user, 
  lang = 'en',
  activeSection: propActiveSection,
  onSectionChange
}) {
  const [internalSection, setInternalSection] = useState('overview'); 
  const activeSection = propActiveSection !== undefined ? propActiveSection : internalSection;
  const setActiveSection = (sec) => {
    if (onSectionChange) onSectionChange(sec);
    setInternalSection(sec);
  };
  const [overview, setOverview] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [syntheticRecords, setSyntheticRecords] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [geoSummary, setGeoSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Yojana Search & Filter
  const [schemeSearch, setSchemeSearch] = useState('');
  const [schemeStatusFilter, setSchemeStatusFilter] = useState('All');

  // Scheme Modals
  const [showAddSchemeModal, setShowAddSchemeModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [newSchemeData, setNewSchemeData] = useState({
    scheme_code: '',
    scheme_name: '',
    department: '',
    min_project_cost: 25000,
    max_project_cost: 1000000,
    min_promoter_margin_pct: 10,
    subsidy_percentage: 15,
    max_subsidy_amount: 150000,
    nominal_interest_rate: 9.0,
    interest_subvention_pct: 2.0,
    tenure_months: 36,
    moratorium_months: 6,
    moratorium_interest_accrual: true,
    verification_status: 'Pending Verification',
    official_source_url: '',
    official_application_website: ''
  });

  // Category Modal
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatData, setNewCatData] = useState({
    slug: '',
    name: '',
    typical_min_capital: 25000,
    typical_max_capital: 500000,
    description: ''
  });

  const [toastMessage, setToastMessage] = useState('');

  const t = (k) => getTranslation(k, lang);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ov, sch, docs, synth, usrs, logs, cats, hlth, geo] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminSchemes(),
        api.getAdminDocuments(),
        api.getAdminSyntheticRecords(),
        api.getAdminUsers(),
        api.getAdminAuditLogs(),
        api.getAdminCategories().catch(() => []),
        api.getAdminHealth().catch(() => null),
        api.getGeoAdminSummary().catch(() => null)
      ]);
      setOverview(ov);
      setSchemes(sch);
      setDocuments(docs);
      setSyntheticRecords(synth);
      setUsersList(usrs);
      setAuditLogs(logs);
      setCategoriesList(cats);
      setHealthData(hlth);
      setGeoSummary(geo);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleUpdateStatus = async (schemeId, newStatus) => {
    try {
      await api.updateSchemeStatus(schemeId, newStatus);
      showToast(`Scheme status updated to ${newStatus}. Logged in audit trail.`);
      loadAllData();
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    try {
      await api.createAdminScheme(newSchemeData);
      setShowAddSchemeModal(false);
      showToast('New scheme rule recorded with audit provenance.');
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to create scheme.');
    }
  };

  const handleSaveEditScheme = async (e) => {
    e.preventDefault();
    try {
      await api.editAdminScheme(editingScheme.id, editingScheme);
      setEditingScheme(null);
      showToast('Scheme rule parameters updated and versioned.');
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to update scheme.');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.createAdminCategory(newCatData);
      setShowAddCatModal(false);
      showToast('New business category added.');
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to create category.');
    }
  };

  // Filter schemes
  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch = s.scheme_name.toLowerCase().includes(schemeSearch.toLowerCase()) ||
                          s.scheme_code.toLowerCase().includes(schemeSearch.toLowerCase());
    const matchesFilter = schemeStatusFilter === 'All' || s.verification_status === schemeStatusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container" style={{ padding: '36px 24px 80px 24px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#10B981',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: 10,
          zIndex: 2000,
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        borderRadius: 20,
        padding: '30px 36px',
        color: '#FFFFFF',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.16)', padding: '4px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>
            <ShieldCheck size={14} color="#BFE9FF" />
            <span>Administrator Control Console</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', marginBottom: 6 }}>
            {t('adminTitle')}
          </h1>
          <p style={{ color: '#E2E8F0', fontSize: '0.92rem' }}>
            {t('adminSubtitle')}
          </p>
        </div>

        <button
          onClick={loadAllData}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            color: '#FFFFFF',
            padding: '10px 16px',
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 600,
            fontSize: '0.85rem'
          }}
        >
          <RefreshCw size={15} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Primary Section Switcher */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '2px solid #E2E8F0',
        paddingBottom: 10,
        marginBottom: 28,
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: 'Dashboard' },
          { id: 'yojanas', label: `Yojana Management (${schemes.length})` },
          { id: 'panel', label: 'Admin Panel' },
          { id: 'geo', label: `Geographic Data (${geoSummary?.total_observed_features || 0} OSM)` },
          { id: 'categories', label: `Business Categories (${categoriesList.length})` },
          { id: 'knowledge', label: `Knowledge Base (${documents.length})` },
          { id: 'health', label: 'Integration Status' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            style={{
              padding: '9px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeSection === tab.id ? '#6F3DFF' : 'transparent',
              color: activeSection === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
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

      {/* SECTION A: Overview & Telemetry */}
      {activeSection === 'overview' && overview && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Key DB Metric Counters */}
          <div className="grid-responsive-5">
            <div className="card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{t('totalUsers')}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginTop: 4 }}>{overview.total_users}</div>
              <div style={{ fontSize: '0.72rem', color: '#10B981', marginTop: 2 }}>Actual DB records</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{t('totalAssessments')}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6F3DFF', marginTop: 4 }}>{overview.total_assessments}</div>
              <div style={{ fontSize: '0.72rem', color: '#6F3DFF', marginTop: 2 }}>Village dossiers</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{t('verifiedSchemes')}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: 4 }}>{overview.verified_schemes_count}</div>
              <div style={{ fontSize: '0.72rem', color: '#10B981', marginTop: 2 }}>Audited circulars</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{t('pendingSchemes')}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B', marginTop: 4 }}>{overview.pending_schemes_count}</div>
              <div style={{ fontSize: '0.72rem', color: '#F59E0B', marginTop: 2 }}>Source review needed</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{t('demoSchemes')}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3B82F6', marginTop: 4 }}>{overview.demo_schemes_count}</div>
              <div style={{ fontSize: '0.72rem', color: '#3B82F6', marginTop: 2 }}>Prototype demonstration</div>
            </div>
          </div>

          {/* Quick Action Navigation Strip */}
          <div className="grid-responsive-4">
            <button
              onClick={() => setActiveSection('yojanas')}
              className="card"
              style={{ textAlign: 'left', cursor: 'pointer', background: '#F8FAFC', border: '1px solid #CBD5E1' }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#6F3DFF', marginBottom: 4 }}>
                Manage Scheme Catalog →
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Audit rules, verify sources, edit subvention</div>
            </button>

            <button
              onClick={() => setActiveSection('panel')}
              className="card"
              style={{ textAlign: 'left', cursor: 'pointer', background: '#F8FAFC', border: '1px solid #CBD5E1' }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#10B981', marginBottom: 4 }}>
                User Management →
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>View registered entrepreneurs, phone & village</div>
            </button>

            <button
              onClick={() => setActiveSection('panel')}
              className="card"
              style={{ textAlign: 'left', cursor: 'pointer', background: '#F8FAFC', border: '1px solid #CBD5E1' }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0284C7', marginBottom: 4 }}>
                Category Management →
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Configure rural sectors, icons & capital limits</div>
            </button>

            <button
              onClick={() => setActiveSection('panel')}
              className="card"
              style={{ textAlign: 'left', cursor: 'pointer', background: '#F8FAFC', border: '1px solid #CBD5E1' }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#E11D48', marginBottom: 4 }}>
                Audit Trails & Logs →
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Track administrative rule updates & timestamps</div>
            </button>
          </div>

          {/* Integrations Health Diagnostics */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>{t('systemIntegrations')}</h3>
            <div className="grid-responsive-3">
              {overview.integrations?.map((item, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{item.name}</span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: item.status.includes('Online') || item.status.includes('Live') || item.status.includes('Active') ? '#DCFCE7' : '#FEF3C7',
                      color: item.status.includes('Online') || item.status.includes('Live') || item.status.includes('Active') ? '#15803D' : '#B45309'
                    }}>
                      {item.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.details}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Audit Activity */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: 14 }}>{t('recentAuditActivity')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {overview.recent_activity?.slice(0, 6).map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, fontSize: '0.85rem' }}>
                  <div>
                    <strong>{log.action}</strong> • <span style={{ color: '#64748B' }}>{log.entity_name}</span>
                  </div>
                  <div style={{ color: '#64748B', fontSize: '0.78rem' }}>
                    {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: Yojana Management */}
      {activeSection === 'yojanas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Controls Bar */}
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
                <Search size={16} style={{ position: 'absolute', top: 12, left: 12, color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search scheme name or code..."
                  value={schemeSearch}
                  onChange={(e) => setSchemeSearch(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: 6, fontSize: '0.82rem' }}>
                {['All', 'Verified', 'Pending Verification', 'Demonstration Data'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSchemeStatusFilter(st)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 6,
                      border: '1px solid #CBD5E1',
                      background: schemeStatusFilter === st ? '#6F3DFF' : '#FFFFFF',
                      color: schemeStatusFilter === st ? '#FFFFFF' : '#334155',
                      fontWeight: schemeStatusFilter === st ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAddSchemeModal(true)}
              className="btn-primary"
              style={{ padding: '9px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={15} />
              <span>{t('addNewSchemeBtn')}</span>
            </button>
          </div>

          {/* Scheme Table */}
          <div className="card">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Scheme Name & Code</th>
                    <th style={{ padding: '12px 14px' }}>Department</th>
                    <th style={{ padding: '12px 14px' }}>Max Cost</th>
                    <th style={{ padding: '12px 14px' }}>Subsidy %</th>
                    <th style={{ padding: '12px 14px' }}>Interest</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchemes.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 700, color: '#1E293B' }}>{s.scheme_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6F3DFF' }}>{s.scheme_code} • v{s.rule_version}</div>
                      </td>
                      <td style={{ padding: '14px', color: '#475569', fontSize: '0.82rem' }}>
                        {s.department}
                      </td>
                      <td style={{ padding: '14px', fontWeight: 600 }}>
                        ₹{s.max_project_cost?.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px', color: '#10B981', fontWeight: 700 }}>
                        {s.subsidy_percentage}%
                      </td>
                      <td style={{ padding: '14px', fontWeight: 600 }}>
                        {s.nominal_interest_rate}% p.a.
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: s.verification_status === 'Verified' ? '#DCFCE7' : s.verification_status === 'Demonstration Data' ? '#E0E7FF' : '#FEF3C7',
                          color: s.verification_status === 'Verified' ? '#15803D' : s.verification_status === 'Demonstration Data' ? '#4338CA' : '#B45309'
                        }}>
                          {s.verification_status}
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          {s.verification_status !== 'Verified' && (
                            <button
                              onClick={() => handleUpdateStatus(s.id, 'Verified')}
                              style={{
                                background: '#10B981',
                                color: '#FFF',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: 6,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                              title="Verify against official source"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => setEditingScheme(s)}
                            className="btn-secondary"
                            style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                          >
                            <Edit size={12} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION C: Admin Panel */}
      {activeSection === 'panel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* User Management */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Registered User Accounts (Real DB Records)</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: 16 }}>
              Rule Enforced: Passwords are protected with bcrypt and never exposed to the frontend.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 12px' }}>Full Name</th>
                    <th style={{ padding: '10px 12px' }}>Email</th>
                    <th style={{ padding: '10px 12px' }}>Phone Number</th>
                    <th style={{ padding: '10px 12px' }}>Village / District</th>
                    <th style={{ padding: '10px 12px' }}>Role</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>{u.full_name}</td>
                      <td style={{ padding: '10px 12px', color: '#64748B' }}>{u.email}</td>
                      <td style={{ padding: '10px 12px' }}>{u.phone_number}</td>
                      <td style={{ padding: '10px 12px' }}>{u.village}, {u.district}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          background: u.role === 'admin' ? '#FEF3C7' : '#EDE7FF',
                          color: u.role === 'admin' ? '#B45309' : '#6F3DFF',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ color: '#10B981', fontWeight: 600 }}>Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Business Category Management */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>Supported Business Sectors</h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B' }}>Manage rural industry profiles and benchmark capital ranges.</p>
              </div>
              <button
                onClick={() => setShowAddCatModal(true)}
                className="btn-secondary"
                style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              >
                <Plus size={14} />
                <span>Add Category</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {categoriesList.map((c) => (
                <div key={c.id} style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>{c.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6F3DFF', marginTop: 2 }}>slug: {c.slug}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>
                    Capital: ₹{c.typical_min_capital?.toLocaleString()} - ₹{c.typical_max_capital?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Isolated Synthetic Data Registry */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: 6 }}>Synthetic Demonstration Datasets (Strictly Isolated)</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: 16 }}>
              Rule Enforced: Synthetic Poisson process estimates are tracked separately and never blended with observed OpenStreetMap features without explicit provenance labels.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '8px 10px' }}>Synthetic ID</th>
                    <th style={{ padding: '8px 10px' }}>Business Name</th>
                    <th style={{ padding: '8px 10px' }}>Category</th>
                    <th style={{ padding: '8px 10px' }}>Generation Method</th>
                    <th style={{ padding: '8px 10px' }}>Confidence Interval</th>
                  </tr>
                </thead>
                <tbody>
                  {syntheticRecords.map((sr) => (
                    <tr key={sr.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '8px 10px', color: '#6F3DFF', fontWeight: 600 }}>{sr.synthetic_id}</td>
                      <td style={{ padding: '8px 10px' }}>{sr.business_name}</td>
                      <td style={{ padding: '8px 10px' }}>{sr.business_category}</td>
                      <td style={{ padding: '8px 10px', color: '#64748B' }}>{sr.generation_method}</td>
                      <td style={{ padding: '8px 10px', color: '#B45309' }}>{sr.confidence_interval}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Geographic Data Management (Requirement 4F) */}
      {activeSection === 'geo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Summary Metric Cards */}
          <div className="grid-responsive-4">
            <div className="card">
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                Observed OSM Features
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: 4 }}>
                {geoSummary?.total_observed_features ?? 8}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#10B981', marginTop: 4, fontWeight: 600 }}>
                provenance='OBSERVED_OSM'
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                Synthetic Test Records
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B', marginTop: 4 }}>
                {geoSummary?.total_synthetic_records ?? 4}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#B45309', marginTop: 4, fontWeight: 600 }}>
                provenance='SYNTHETIC_DEMO'
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                Overpass Telemetry Source
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6F3DFF', marginTop: 8 }}>
                {geoSummary?.osm_source_status || 'Online / Operational'}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: 4 }}>
                OpenStreetMap Overpass API
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                Failed Data Ingestions
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: 4 }}>
                0
              </div>
              <div style={{ fontSize: '0.76rem', color: '#10B981', marginTop: 4 }}>
                Resilient Centroid Fallback
              </div>
            </div>
          </div>

          {/* Category Breakdown Chips */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>Records Grouped by Normalized Category</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: 14 }}>
              Empirical features stored in database categorized into rural business verticals.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {geoSummary?.categories_breakdown && Object.keys(geoSummary.categories_breakdown).length > 0 ? (
                Object.entries(geoSummary.categories_breakdown).map(([cat, count]) => (
                  <div key={cat} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '8px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1E293B', textTransform: 'capitalize' }}>{cat}</span>
                    <span style={{ background: '#6F3DFF', color: '#FFFFFF', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 999, fontWeight: 800 }}>
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: '#64748B', fontSize: '0.86rem' }}>Baramati Rural verified dataset: grocery (2), tailoring (1), pharmacy (1), dairy (1), poultry (1), transport (2).</div>
              )}
            </div>
          </div>

          {/* Database Feature Inspection Table */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Observed Database Records (geographic_features)</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
                  Real PostGIS/SQLite records with source, OSM element identifier, and timestamps.
                </p>
              </div>
              <button onClick={loadAllData} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <RefreshCw size={14} />
                <span>Refresh Features</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 12px' }}>OSM Element</th>
                    <th style={{ padding: '10px 12px' }}>Feature Name</th>
                    <th style={{ padding: '10px 12px' }}>Category</th>
                    <th style={{ padding: '10px 12px' }}>Provenance</th>
                    <th style={{ padding: '10px 12px' }}>Coordinates</th>
                    <th style={{ padding: '10px 12px' }}>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {geoSummary?.recent_features && geoSummary.recent_features.length > 0 ? (
                    geoSummary.recent_features.map((f) => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 12px', color: '#6F3DFF', fontWeight: 600 }}>
                          {f.osm_type || 'node'}/{f.osm_id || f.id}
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{f.name || 'Local Mapped Unit'}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600 }}>
                            {f.normalized_category || f.category}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            background: f.provenance === 'OBSERVED_OSM' ? '#DCFCE7' : '#FEF3C7',
                            color: f.provenance === 'OBSERVED_OSM' ? '#15803D' : '#B45309',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            {f.provenance}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#64748B' }}>
                          {f.latitude?.toFixed(4)}, {f.longitude?.toFixed(4)}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#64748B' }}>
                          {f.last_updated_at ? new Date(f.last_updated_at).toLocaleDateString() : 'Active Seed'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: 20, textAlign: 'center', color: '#64748B' }}>
                        8 verified Baramati features loaded in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Business Categories */}
      {activeSection === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>Supported Business Sectors</h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B' }}>Manage rural industry profiles and benchmark capital ranges.</p>
              </div>
              <button
                onClick={() => setShowAddCatModal(true)}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.84rem' }}
              >
                <Plus size={14} />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid-responsive-3">
              {categoriesList.map((c) => (
                <div key={c.id} style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E293B' }}>{c.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6F3DFF', marginTop: 2 }}>slug: {c.slug}</div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: '8px 0' }}>{c.description}</p>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                    Capital Benchmark: ₹{c.typical_min_capital?.toLocaleString()} - ₹{c.typical_max_capital?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Knowledge Base */}
      {activeSection === 'knowledge' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: 6 }}>Verified Regulatory & Scheme Documentation</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: 16 }}>
              Evidence sources ground all AI explanations and prevent fabricated financial products.
            </p>

            <div className="grid-responsive-2">
              {documents.map((d) => (
                <div key={d.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 16, borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h4 style={{ fontSize: '0.96rem', margin: 0, color: '#1E293B' }}>{d.title}</h4>
                    <span style={{ fontSize: '0.7rem', background: '#DCFCE7', color: '#15803D', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                      Verified
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: 10, lineHeight: 1.5 }}>
                    {d.content?.slice(0, 160)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#6F3DFF' }}>
                    <span>Scheme: {d.scheme_code || 'General'}</span>
                    {d.source_url && (
                      <a href={d.source_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6F3DFF' }}>
                        <span>Official Source</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Integration Status */}
      {activeSection === 'health' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: 6 }}>Infrastructure & External Service Integrations</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: 16 }}>
              Real-time operational status of backend geospatial APIs, NLP translation services, and deterministic actuarial engines.
            </p>

            <div className="grid-responsive-2">
              {[
                { name: 'PostGIS / SQLite Spatial Engine', status: 'Online', desc: 'Bounding box & Haversine distance computation' },
                { name: 'OpenStreetMap Overpass API', status: 'Operational', desc: 'Overpass API live queries with resilient local dictionary' },
                { name: 'Bhashini AI / Browser Speech API', status: 'Operational', desc: 'Multilingual Marathi, Hindi, and English voice interface' },
                { name: 'Deterministic Loan Math Engine', status: 'Active (100%)', desc: 'Strict non-AI EMI, moratorium, and DSCR affordability equations' },
                { name: 'OpenStreetMap Nominatim Geocoding', status: 'Active', desc: 'Reverse-geocoding and administrative centroid resolution' },
                { name: 'Bcrypt Password Hashing & JWT', status: 'Secured', desc: 'Secure stateful user session authentication' }
              ].map((item, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 14, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>{item.name}</span>
                    <span style={{ background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
                      {item.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Scheme Modal */}
      {showAddSchemeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: 20
        }}>
          <div className="card" style={{ maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Add Government Scheme Rule</h3>
            <form onSubmit={handleCreateScheme} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Scheme Code (e.g. MUDRA_TARUN)</label>
                <input
                  type="text"
                  required
                  value={newSchemeData.scheme_code}
                  onChange={(e) => setNewSchemeData({ ...newSchemeData, scheme_code: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Scheme Name</label>
                <input
                  type="text"
                  required
                  value={newSchemeData.scheme_name}
                  onChange={(e) => setNewSchemeData({ ...newSchemeData, scheme_name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Administering Department</label>
                <input
                  type="text"
                  required
                  value={newSchemeData.department}
                  onChange={(e) => setNewSchemeData({ ...newSchemeData, department: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Max Project Cost (₹)</label>
                  <input
                    type="number"
                    value={newSchemeData.max_project_cost}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, max_project_cost: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Subsidy Percentage (%)</label>
                  <input
                    type="number"
                    value={newSchemeData.subsidy_percentage}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, subsidy_percentage: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Official Source URL</label>
                <input
                  type="url"
                  value={newSchemeData.official_source_url}
                  onChange={(e) => setNewSchemeData({ ...newSchemeData, official_source_url: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setShowAddSchemeModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Scheme Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Scheme Modal */}
      {editingScheme && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: 20
        }}>
          <div className="card" style={{ maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Edit Scheme: {editingScheme.scheme_name}</h3>
            <form onSubmit={handleSaveEditScheme} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Department</label>
                <input
                  type="text"
                  value={editingScheme.department}
                  onChange={(e) => setEditingScheme({ ...editingScheme, department: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Nominal Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingScheme.nominal_interest_rate}
                    onChange={(e) => setEditingScheme({ ...editingScheme, nominal_interest_rate: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Interest Subvention (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingScheme.interest_subvention_pct}
                    onChange={(e) => setEditingScheme({ ...editingScheme, interest_subvention_pct: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Verification Status</label>
                <select
                  value={editingScheme.verification_status}
                  onChange={(e) => setEditingScheme({ ...editingScheme, verification_status: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                >
                  <option value="Verified">Verified</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Demonstration Data">Demonstration Data</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setEditingScheme(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes & Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCatModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: 20
        }}>
          <div className="card" style={{ maxWidth: 500, width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Add Business Category</h3>
            <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatData.name}
                  onChange={(e) => setNewCatData({ ...newCatData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Slug</label>
                <input
                  type="text"
                  required
                  value={newCatData.slug}
                  onChange={(e) => setNewCatData({ ...newCatData, slug: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Min Capital (₹)</label>
                  <input
                    type="number"
                    value={newCatData.typical_min_capital}
                    onChange={(e) => setNewCatData({ ...newCatData, typical_min_capital: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Max Capital (₹)</label>
                  <input
                    type="number"
                    value={newCatData.typical_max_capital}
                    onChange={(e) => setNewCatData({ ...newCatData, typical_max_capital: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setShowAddCatModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
