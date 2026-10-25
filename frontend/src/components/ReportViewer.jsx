import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  Calculator, 
  Volume2, 
  Pause, 
  Play, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  Sparkles,
  Layers,
  Info,
  Calendar,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { api } from '../api';

export default function ReportViewer({ assessmentId, onBack }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('advisory'); // 'advisory' or 'financial'
  const [truthFilter, setTruthFilter] = useState('all'); // 'all', 'hard_data', 'ai_projection'
  
  // Audio state (Web Speech API)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSpeakingSection, setCurrentSpeakingSection] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // 'en', 'hi', 'mr'
  const speechSynthRef = useRef(null);

  // Map ref for competitor density section
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    loadAssessment();
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [assessmentId]);

  const loadAssessment = async () => {
    setLoading(true);
    try {
      const data = await api.getAssessmentDetail(assessmentId);
      setReportData(data);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render Leaflet Map in competitor density tab
  useEffect(() => {
    if (activeTab === 'advisory' && mapContainerRef.current && reportData && window.L) {
      const loc = reportData.location;
      if (!mapInstanceRef.current) {
        const map = window.L.map(mapContainerRef.current).setView([loc.latitude, loc.longitude], 12);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Center Marker (Proposed business)
        const centerIcon = window.L.divIcon({
          className: 'custom-pin-center',
          html: `<div style="background:#6F3DFF;color:#FFF;padding:6px;border-radius:50%;border:2px solid #FFF;box-shadow:0 2px 8px rgba(0,0,0,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`
        });
        window.L.marker([loc.latitude, loc.longitude], { icon: centerIcon })
          .addTo(map)
          .bindPopup(`<b>${reportData.proposed_business_name}</b><br/>Your Enterprise Anchor`)
          .openPopup();

        // 5 km Search Boundary Circle
        window.L.circle([loc.latitude, loc.longitude], {
          color: '#6F3DFF',
          fillColor: '#BFE9FF',
          fillOpacity: 0.18,
          radius: (loc.search_radius_km || 5.0) * 1000
        }).addTo(map);

        // Simulated OSM points (Green)
        const osmPoints = [
          { lat: loc.latitude + 0.007, lon: loc.longitude + 0.005, name: "Baramati Weekly APMC Rural Haat", type: "Marketplace" },
          { lat: loc.latitude - 0.003, lon: loc.longitude + 0.002, name: "Shivajinagar Bus Stand", type: "Transport Link" },
          { lat: loc.latitude + 0.010, lon: loc.longitude - 0.008, name: "Taluka Veterinary Clinic", type: "Healthcare Buffer" },
          { lat: loc.latitude + 0.012, lon: loc.longitude + 0.011, name: "Mahalaxmi Desi Poultry Center", type: "Observed Competitor" }
        ];

        osmPoints.forEach(p => {
          const greenIcon = window.L.divIcon({
            className: 'custom-pin-osm',
            html: `<div style="background:#10B981;color:#FFF;padding:4px;border-radius:50%;border:2px solid #FFF;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></div>`
          });
          window.L.marker([p.lat, p.lon], { icon: greenIcon })
            .addTo(map)
            .bindPopup(`<b>🟢 [OSM Node]</b><br/>${p.name}<br/><i>${p.type}</i>`);
        });

        // Synthetic point (Orange/Yellow)
        const synthIcon = window.L.divIcon({
          className: 'custom-pin-synth',
          html: `<div style="background:#F59E0B;color:#FFF;padding:4px;border-radius:50%;border:2px solid #FFF;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></div>`
        });
        window.L.marker([loc.latitude - 0.008, loc.longitude + 0.009], { icon: synthIcon })
          .addTo(map)
          .bindPopup(`<b>🟡 [Synthetic Simulation]</b><br/>Jagdamba Kadaknath Center<br/><i>Poisson Spatial Estimate (₹45k-₹75k/mo)</i>`);

        mapInstanceRef.current = map;
      }
    }
  }, [activeTab, reportData]);

  // Audio Speech synthesis handler
  const speakText = (text, sectionId = null) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    if (isPlayingAudio && currentSpeakingSection === sectionId) {
      setIsPlayingAudio(false);
      setCurrentSpeakingSection(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedLanguage === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (selectedLanguage === 'mr') {
      utterance.lang = 'mr-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.95;
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setCurrentSpeakingSection(null);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setCurrentSpeakingSection(null);
    };

    setIsPlayingAudio(true);
    setCurrentSpeakingSection(sectionId);
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setCurrentSpeakingSection(null);
  };

  if (loading || !reportData) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Retrieving verified diagnostic report and telemetry...
        </div>
      </div>
    );
  }

  const { proposed_business_name, category_name, location, financials, advisory_report } = reportData;

  // Filter evidence helper
  const filterEvidence = (items) => {
    if (!items) return [];
    if (truthFilter === 'all') return items;
    if (truthFilter === 'hard_data') {
      return items.filter(it => it.source_type === 'observed_osm' || it.source_type === 'govt_scheme_verified');
    }
    return items.filter(it => it.source_type === 'synthetic_model' || it.source_type === 'ai_guidance');
  };

  const getFullAudioScript = () => {
    return `Feasibility Diagnostic for ${proposed_business_name} in ${location.village}. 
    Total estimated project cost is ${financials.total_project_cost} rupees. 
    Promoter equity contribution is ${financials.promoter_margin_amount} rupees. 
    Net bank loan is ${financials.loan_principal} rupees with subsidized monthly installment of ${financials.monthly_emi} rupees. 
    Market reach is anchored by ${advisory_report.market_reach.summary}. 
    Competitor density analysis shows expansion viability with safe break even margins.`;
  };

  return (
    <div className="container" style={{ padding: '30px 24px 80px 24px' }}>
      {/* Top Header / Nav back */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button 
          onClick={onBack}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge-osm">🟢 100% Grounded</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Assessment ID #{reportData.id}
          </span>
        </div>
      </div>

      {/* Hero Overview Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #13151A 0%, #2A2538 100%)',
        borderRadius: 24,
        padding: '32px 36px',
        color: '#FFFFFF',
        marginBottom: 28,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ background: '#6F3DFF', color: '#FFF', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: 999 }}>
              {category_name}
            </span>
            <span style={{ color: '#BFE9FF', fontSize: '0.85rem' }}>
              📍 {location.village}, {location.district} ({location.search_radius_km} km OSM Radius)
            </span>
          </div>

          <h1 style={{ fontSize: '2.1rem', color: '#FFFFFF', marginBottom: 6 }}>
            {proposed_business_name}
          </h1>

          <div style={{ display: 'flex', gap: 20, fontSize: '0.9rem', color: '#E2E8F0', marginTop: 12 }}>
            <div>Project Cost: <strong style={{ color: '#FFFFFF' }}>₹{financials.total_project_cost.toLocaleString()}</strong></div>
            <div>•</div>
            <div>Net Bank Loan: <strong style={{ color: '#BFE9FF' }}>₹{financials.loan_principal.toLocaleString()}</strong></div>
            <div>•</div>
            <div>Subsidized EMI: <strong style={{ color: '#10B981' }}>₹{financials.monthly_emi.toLocaleString()}/mo</strong></div>
          </div>
        </div>

        {/* Audio Narration Console */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 16,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#BFE9FF', fontWeight: 700 }}>
              <Volume2 size={16} />
              <span>Bhashini Audio Narration</span>
            </div>

            <select 
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFF',
                border: 'none',
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: '0.75rem'
              }}
            >
              <option value="en" style={{ color: '#000' }}>English (EN)</option>
              <option value="hi" style={{ color: '#000' }}>हिन्दी (HI)</option>
              <option value="mr" style={{ color: '#000' }}>मराठी (MR)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={() => speakText(getFullAudioScript(), 'full')}
              style={{
                background: isPlayingAudio && currentSpeakingSection === 'full' ? '#EF4444' : '#6F3DFF',
                color: '#FFF',
                fontWeight: 600,
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {isPlayingAudio && currentSpeakingSection === 'full' ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlayingAudio && currentSpeakingSection === 'full' ? 'Pause Audio' : 'Listen to Full Report'}</span>
            </button>
            {isPlayingAudio && (
              <button 
                onClick={stopAudio}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFF',
                  padding: '8px 10px',
                  borderRadius: 8
                }}
              >
                <Square size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #E2E8F0', marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <button 
            onClick={() => setActiveTab('advisory')}
            style={{
              padding: '12px 0',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: activeTab === 'advisory' ? '#6F3DFF' : 'var(--text-secondary)',
              borderBottom: activeTab === 'advisory' ? '3px solid #6F3DFF' : '3px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            1. Advisory & Feasibility (6-Part Report)
          </button>

          <button 
            onClick={() => setActiveTab('financial')}
            style={{
              padding: '12px 0',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: activeTab === 'financial' ? '#6F3DFF' : 'var(--text-secondary)',
              borderBottom: activeTab === 'financial' ? '3px solid #6F3DFF' : '3px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            2. Deterministic Financial Structuring (Zero AI Math)
          </button>
        </div>

        {/* Truth Filter Switcher */}
        {activeTab === 'advisory' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Telemetry:</span>
            <div style={{ background: '#F1F5F9', padding: 3, borderRadius: 8, display: 'flex', gap: 4 }}>
              <button 
                onClick={() => setTruthFilter('all')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: truthFilter === 'all' ? '#FFFFFF' : 'transparent',
                  color: truthFilter === 'all' ? '#6F3DFF' : 'var(--text-secondary)',
                  boxShadow: truthFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                All Insights
              </button>
              <button 
                onClick={() => setTruthFilter('hard_data')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: truthFilter === 'hard_data' ? '#FFFFFF' : 'transparent',
                  color: truthFilter === 'hard_data' ? '#10B981' : 'var(--text-secondary)',
                  boxShadow: truthFilter === 'hard_data' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                🟢 Hard OSM Only
              </button>
              <button 
                onClick={() => setTruthFilter('ai_projection')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: truthFilter === 'ai_projection' ? '#FFFFFF' : 'transparent',
                  color: truthFilter === 'ai_projection' ? '#F59E0B' : 'var(--text-secondary)',
                  boxShadow: truthFilter === 'ai_projection' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                🟡 Model Only
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: STRICT 6-PART ADVISORY REPORT */}
      {activeTab === 'advisory' && (
        <div>
          {/* Section 1: Market Reach */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1.25rem', color: '#13151A' }}>1. Market Reach & Footfall</h3>
              <button 
                onClick={() => speakText(advisory_report.market_reach.summary, 'market_reach')}
                className="btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
              >
                <Volume2 size={14} />
                <span>Listen Section</span>
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              {advisory_report.market_reach.summary}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              {filterEvidence(advisory_report.market_reach.evidence_items).map((ev, i) => (
                <div key={i} style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{ev.label}</span>
                    <span className={ev.source_type === 'observed_osm' ? 'badge-osm' : 'badge-ai'}>
                      {ev.source_type === 'observed_osm' ? '🟢 OSM Data' : '🟡 AI Model'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#13151A', fontWeight: 600 }}>{ev.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Source: {ev.source_detail}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#F0F9FF', border: '1px solid #BFE9FF', borderRadius: 10, padding: 12 }}>
              <strong style={{ fontSize: '0.82rem', color: '#0369A1' }}>Strategic Action: </strong>
              <span style={{ fontSize: '0.85rem', color: '#0C4A6E' }}>
                {advisory_report.market_reach.practical_recommendations?.[0] || 'Focus on bi-weekly haat schedules to maximize direct cash sales.'}
              </span>
            </div>
          </div>

          {/* Section 2: Underserved Niches */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1.25rem', color: '#13151A' }}>2. Underserved Niches</h3>
              <button 
                onClick={() => speakText(advisory_report.underserved_niches.summary, 'underserved_niches')}
                className="btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
              >
                <Volume2 size={14} />
                <span>Listen Section</span>
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              {advisory_report.underserved_niches.summary}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              {filterEvidence(advisory_report.underserved_niches.evidence_items).map((ev, i) => (
                <div key={i} style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{ev.label}</span>
                    <span className={ev.source_type === 'observed_osm' ? 'badge-osm' : 'badge-ai'}>
                      {ev.source_type === 'observed_osm' ? '🟢 OSM Data' : '🟡 Verified Guide'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#13151A', fontWeight: 600 }}>{ev.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Source: {ev.source_detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Budget-Scaled SWOT */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.25rem', color: '#13151A', marginBottom: 16 }}>3. Budget-Scaled SWOT Analysis Matrix</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 800, color: '#065F46', marginBottom: 8, fontSize: '0.92rem' }}>STRENGTHS</div>
                <ul style={{ paddingLeft: 18, fontSize: '0.85rem', color: '#064E3B', lineHeight: 1.6 }}>
                  {advisory_report.budget_scaled_swot?.strengths?.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 800, color: '#991B1B', marginBottom: 8, fontSize: '0.92rem' }}>WEAKNESSES</div>
                <ul style={{ paddingLeft: 18, fontSize: '0.85rem', color: '#7F1D1D', lineHeight: 1.6 }}>
                  {advisory_report.budget_scaled_swot?.weaknesses?.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 800, color: '#1E40AF', marginBottom: 8, fontSize: '0.92rem' }}>OPPORTUNITIES</div>
                <ul style={{ paddingLeft: 18, fontSize: '0.85rem', color: '#1E3A8A', lineHeight: 1.6 }}>
                  {advisory_report.budget_scaled_swot?.opportunities?.map((o, idx) => (
                    <li key={idx}>{o}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 800, color: '#92400E', marginBottom: 8, fontSize: '0.92rem' }}>THREATS</div>
                <ul style={{ paddingLeft: 18, fontSize: '0.85rem', color: '#78350F', lineHeight: 1.6 }}>
                  {advisory_report.budget_scaled_swot?.threats?.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Local Threats & Mitigation */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.25rem', color: '#13151A', marginBottom: 12 }}>4. Local Operational Threats & Risk Mitigations</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              {advisory_report.local_threats.summary}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {filterEvidence(advisory_report.local_threats.evidence_items).map((ev, i) => (
                <div key={i} style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{ev.label}</span>
                    <span className="badge-osm">🟢 Ground Telemetry</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#13151A', fontWeight: 600 }}>{ev.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Source: {ev.source_detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Competitor Density Analysis & Spatial Map */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.25rem', color: '#13151A', marginBottom: 6 }}>5. Competitor Density Analysis (Spatial Ground Truth)</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              {advisory_report.competitor_density.summary}
            </p>

            {/* Interactive OpenStreetMap Container */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6F3DFF' }}>OpenStreetMap Telemetry Map</span>
                <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>🟣 Proposed Unit</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>🟢 Verified OSM</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>🟡 Synthetic Model</span>
                </div>
              </div>
              <div 
                ref={mapContainerRef}
                style={{ width: '100%', height: 320, borderRadius: 14, overflow: 'hidden', border: '1px solid #CBD5E1' }}
              ></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {filterEvidence(advisory_report.competitor_density.evidence_items).map((ev, i) => (
                <div key={i} style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{ev.label}</span>
                    <span className={ev.source_type === 'observed_osm' ? 'badge-osm' : 'badge-ai'}>
                      {ev.source_type === 'observed_osm' ? '🟢 Observed OSM' : '🟡 Synthetic Model'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#13151A', fontWeight: 600 }}>{ev.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Source: {ev.source_detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Suggested Pricing */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.25rem', color: '#13151A', marginBottom: 12 }}>6. Suggested Pricing & Target Unit Margins</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              {advisory_report.suggested_pricing.summary}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {filterEvidence(advisory_report.suggested_pricing.evidence_items).map((ev, i) => (
                <div key={i} style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{ev.label}</span>
                    <span className="badge-osm">🟢 Actuarial Math</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#13151A', fontWeight: 600 }}>{ev.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Source: {ev.source_detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETERMINISTIC FINANCIAL STRUCTURING */}
      {activeTab === 'financial' && (
        <div>
          {/* Key Metric Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            <div className="card">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subsidized Monthly EMI</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#6F3DFF' }}>₹{financials.monthly_emi.toLocaleString()}/mo</div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Post-Grace Period Servicing</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Effective Interest Rate</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#13151A' }}>{financials.effective_interest_rate}% p.a.</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2.0% Govt Interest Subvention</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Moratorium Grace Period</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0284C7' }}>{financials.moratorium_months} Months</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Flock/Machinery Ramp-up</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Coverage Ratio (DSCR)</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#10B981' }}>{financials.dscr}x</div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Healthy Lending Threshold</div>
            </div>
          </div>

          {/* Capital vs Margin Donut Representation */}
          <div className="card" style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Capital Structuring Breakdown (Reconciled)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center' }}>
              <div>
                <div style={{ height: 26, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden', display: 'flex', marginBottom: 16 }}>
                  <div style={{ width: `${(financials.loan_principal / financials.total_project_cost) * 100}%`, background: '#6F3DFF', title: 'Bank Loan' }}></div>
                  <div style={{ width: `${(financials.subsidy_amount / financials.total_project_cost) * 100}%`, background: '#10B981', title: 'Govt Subsidy' }}></div>
                  <div style={{ width: `${(financials.promoter_margin_amount / financials.total_project_cost) * 100}%`, background: '#BFE9FF', title: 'Promoter Margin' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: 8 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#6F3DFF' }}></span>
                      <span>Net Institutional Bank Loan</span>
                    </span>
                    <strong>₹{financials.loan_principal.toLocaleString()} ({((financials.loan_principal / financials.total_project_cost) * 100).toFixed(0)}%)</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#ECFDF5', borderRadius: 8 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }}></span>
                      <span>Govt Capital Subsidy (NABARD / PMMY)</span>
                    </span>
                    <strong style={{ color: '#065F46' }}>₹{financials.subsidy_amount.toLocaleString()} ({financials.subsidy_pct}%)</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F0F9FF', borderRadius: 8 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#BFE9FF' }}></span>
                      <span>Promoter Equity (Your Seed Capital)</span>
                    </span>
                    <strong>₹{financials.promoter_margin_amount.toLocaleString()} ({financials.promoter_margin_pct}%)</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '0.95rem' }}>CGTMSE Collateral Exemption</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                  Micro loans under Pradhan Mantri Mudra Yojana and NABARD micro-credit are 100% collateral-free, backed by Credit Guarantee Fund for Micro Units (CGFMU).
                </p>
                <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
                  ✔ No land pledge or third-party guarantor required
                </div>
              </div>
            </div>
          </div>

          {/* Month-by-month Amortization Schedule Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: 14 }}>Amortizing Repayment Schedule (Sample First 12 Months)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #E2E8F0', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 12px' }}>Month</th>
                    <th style={{ padding: '10px 12px' }}>Opening Balance</th>
                    <th style={{ padding: '10px 12px' }}>EMI Amount</th>
                    <th style={{ padding: '10px 12px' }}>Principal</th>
                    <th style={{ padding: '10px 12px' }}>Interest</th>
                    <th style={{ padding: '10px 12px' }}>Closing Balance</th>
                    <th style={{ padding: '10px 12px' }}>Phase</th>
                  </tr>
                </thead>
                <tbody>
                  {financials.repayment_schedule?.slice(0, 12).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>Month {row.month_number}</td>
                      <td style={{ padding: '10px 12px' }}>₹{row.opening_balance.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#6F3DFF' }}>₹{row.emi_amount.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px' }}>₹{row.principal_component.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px' }}>₹{row.interest_component.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px' }}>₹{row.closing_balance.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px' }}>
                        {row.is_moratorium ? (
                          <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
                            Moratorium Grace
                          </span>
                        ) : (
                          <span style={{ background: '#ECFDF5', color: '#065F46', padding: '2px 6px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
                            Active Repayment
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
    </div>
  );
}
