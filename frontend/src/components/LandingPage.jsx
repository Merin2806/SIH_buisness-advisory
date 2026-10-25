import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  Volume2, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Radio, 
  Sparkles,
  HelpCircle,
  FileText,
  Landmark,
  ShoppingCart,
  Sprout,
  Store
} from 'lucide-react';

export default function LandingPage({ onStartAssessment, onExploreBudgeter, onOpenVoice }) {
  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(circle at 85% 15%, rgba(191, 233, 255, 0.45) 0%, rgba(248, 250, 252, 1) 70%)',
        padding: '60px 0 80px 0',
        borderBottom: '1px solid var(--mineral-grey-border)'
      }}>
        <div className="container hero-grid">
          {/* Left Column: Heading, Value Props & Primary CTA */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#EDE7FF',
              color: '#6F3DFF',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: 20
            }}>
              <Sparkles size={14} />
              <span>AI-Powered Guidance for Rural India • SIH 26091</span>
            </div>

            <h1 className="hero-heading">
              Smart Business Advisory & Financial Planning for <span style={{ color: '#6F3DFF' }}>Rural Entrepreneurs</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 28 }}>
              RuralBiz AI empowers rural entrepreneurs to <strong>assess local market competition</strong>, <strong>estimate business costs and true profitability</strong>, <strong>explore verified government financing schemes</strong> (PMMY Mudra, NABARD, PMEGP), and make better-informed investment decisions before committing capital.
            </p>

            {/* Single Primary CTA (Test Unit Economics removed as per SIH requirement) */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 36 }}>
              <button 
                onClick={onStartAssessment}
                className="btn-primary"
                style={{ fontSize: '1.05rem', padding: '14px 30px', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span>Start Your Business Assessment</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Quick Proof Badges */}
            <div style={{ display: 'flex', gap: 24, borderTop: '1px solid #E2E8F0', paddingTop: 24, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#13151A' }}>100% Deterministic</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Zero AI guesswork in loan math</div>
              </div>
              <div style={{ width: 1, background: '#E2E8F0', height: 38 }}></div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10B981' }}>OpenStreetMap</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Empirical rural catchment telemetry</div>
              </div>
              <div style={{ width: 1, background: '#E2E8F0', height: 38 }}></div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#6F3DFF' }}>Bhashini AI</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Hindi, Marathi & English voice</div>
              </div>
            </div>
          </div>

          {/* Right Column: Composite Hero Visual inspired by Reference Image 2 in Glacier Blue & Ultraviolet */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto' }}>
            {/* Ambient Background Glow in Glacier Blue */}
            <div style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(191, 233, 255, 0.7) 0%, rgba(237, 231, 255, 0.3) 70%, transparent 100%)',
              filter: 'blur(35px)',
              zIndex: 0
            }} />

            {/* Connecting Step Arc with Rural Domain Icons */}
            <div style={{
              position: 'absolute',
              top: 10,
              right: 20,
              display: 'flex',
              gap: 12,
              zIndex: 3
            }}>
              {[
                { icon: <Sprout size={15} color="#10B981" />, label: 'Agro' },
                { icon: <ShoppingCart size={15} color="#6F3DFF" />, label: 'Haat' },
                { icon: <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#B45309' }}>₹</span>, label: 'Capital' },
                { icon: <Landmark size={15} color="#0369A1" />, label: 'Bank' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1.5px solid #BFE9FF',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={item.label}
                >
                  {item.icon}
                </div>
              ))}
            </div>

            {/* Central Woman Entrepreneur Photograph */}
            <div style={{
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(111, 61, 255, 0.16)',
              border: '3px solid #FFFFFF',
              zIndex: 1
            }}>
              <img 
                src="/images/rural_woman_hero.jpg" 
                alt="Rural Indian woman entrepreneur managing local village enterprise with smartphone"
                style={{
                  width: '100%',
                  height: 390,
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 70,
                background: 'linear-gradient(180deg, transparent 0%, rgba(19, 21, 26, 0.45) 100%)'
              }} />
            </div>

            {/* Responsive Floating Information Cards */}
            <div className="hero-floating-container">
              {/* Floating Card 1: Business Viability */}
              <div className="hero-floating-card hero-floating-card-1" style={{
                background: '#FFFFFF',
                borderRadius: 14,
                padding: '12px 16px',
                boxShadow: '0 12px 28px rgba(19, 21, 26, 0.14)',
                border: '1.5px solid #BFE9FF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <TrendingUp size={16} color="#6F3DFF" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#13151A' }}>Business Viability</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginBottom: 2 }}>
                      <span>Market Demand</span>
                      <strong style={{ color: '#6F3DFF' }}>High</strong>
                    </div>
                    <div style={{ height: 4, background: '#E2E8F0', borderRadius: 999 }}>
                      <div style={{ width: '85%', height: '100%', background: '#6F3DFF', borderRadius: 999 }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginBottom: 2 }}>
                      <span>Competition</span>
                      <strong style={{ color: '#10B981' }}>Low</strong>
                    </div>
                    <div style={{ height: 4, background: '#E2E8F0', borderRadius: 999 }}>
                      <div style={{ width: '35%', height: '100%', background: '#10B981', borderRadius: 999 }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginBottom: 2 }}>
                      <span>Profit Potential</span>
                      <strong style={{ color: '#0369A1' }}>Good</strong>
                    </div>
                    <div style={{ height: 4, background: '#E2E8F0', borderRadius: 999 }}>
                      <div style={{ width: '78%', height: '100%', background: '#0369A1', borderRadius: 999 }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 2: Eligible Schemes */}
              <div className="hero-floating-card hero-floating-card-2" style={{
                background: '#FFFFFF',
                borderRadius: 14,
                padding: '12px 14px',
                boxShadow: '0 12px 28px rgba(19, 21, 26, 0.14)',
                border: '1.5px solid #BFE9FF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Landmark size={15} color="#0369A1" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#13151A' }}>Eligible Schemes</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.72rem', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CheckCircle2 size={12} color="#10B981" />
                    <span>PMMY Mudra (Tarun)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CheckCircle2 size={12} color="#10B981" />
                    <span>NABARD Dairy/Agro</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CheckCircle2 size={12} color="#10B981" />
                    <span>PMEGP Margin Subsidy</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CheckCircle2 size={12} color="#10B981" />
                    <span>State Rural Schemes</span>
                  </div>
                </div>
              </div>

              {/* Floating Card 3: Estimated Investment & Likely Monthly Profit */}
              <div className="hero-floating-card hero-floating-card-3" style={{
                background: '#FFFFFF',
                borderRadius: 14,
                padding: '12px 16px',
                boxShadow: '0 12px 28px rgba(19, 21, 26, 0.14)',
                border: '1.5px solid #BFE9FF'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Estimated Investment</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#13151A', marginTop: 1 }}>
                  ₹1.43 Lakh
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                  <TrendingUp size={13} color="#10B981" />
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Likely Profit:</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10B981' }}>₹25,000/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 50px auto' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: 14 }}>Two Pillars of Enterprise Viability</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Rural businesses fail when they take high-interest unverified debt or set up in saturated micro-markets. RuralBiz AI addresses both failure modes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* Module 1: Financial Structuring */}
            <div className="card" style={{ borderTop: '5px solid #6F3DFF' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: '#EDE7FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6F3DFF',
                marginBottom: 20
              }}>
                <Calculator size={26} />
              </div>
              <h3 style={{ fontSize: '1.45rem', marginBottom: 12 }}>Deterministic Financial Structuring</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                Underwrites financing using official Reserve Bank of India, Mudra, and NABARD master circulars. Calculates amortizing monthly EMI, grace periods, and government back-ended capital subsidies with zero mathematical approximation.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>PMMY Mudra (Shishu up to ₹50k, Kishore up to ₹5 Lakh)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>NABARD Poultry & Dairy Venture Capital Subsidies (15%-25%)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Strict actuarial math: Debt Service Coverage Ratio (DSCR) verification</span>
                </li>
              </ul>
            </div>

            {/* Module 2: Local Business Advisory */}
            <div className="card" style={{ borderTop: '5px solid #BFE9FF' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: '#EBF7FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284C7',
                marginBottom: 20
              }}>
                <MapPin size={26} />
              </div>
              <h3 style={{ fontSize: '1.45rem', marginBottom: 12 }}>Local Geospatial Market Advisory</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                Pings real-time OpenStreetMap nodes within your selected search radius (default 5.0 km). Maps roads, weekly village haat clusters, veterinary centers, and competing retail points with transparent truth-flagging.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>OpenStreetMap amenity, transport & highway extraction</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Isolated synthetic competitor density generation (Poisson modeling)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Strict 6-Section Feasibility Report grounded in empirical evidence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Truth Flagging & Provenance Section */}
      <section style={{ background: '#F1F5F9', padding: '70px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px auto' }}>
            <span style={{ color: '#6F3DFF', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Radical Data Transparency</span>
            <h2 style={{ fontSize: '2.1rem', marginTop: 8, marginBottom: 14 }}>Every Metric Has an Explicit Origin</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              In hackathons and real-world micro-finance, hallucinated AI statistics can lead to bad loans. We flag every insight with an explicit provenance badge.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 16, border: '1px solid #A7F3D0' }}>
              <span className="badge-osm" style={{ marginBottom: 14 }}>🟢 Hard OSM Data</span>
              <h4 style={{ fontSize: '1.15rem', marginBottom: 8 }}>Empirical OpenStreetMap Node</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Derived directly from verifiable geographic points: arterial roads, bus stops, weekly APMC haats, and existing shops.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 16, border: '1px solid #EDE7FF' }}>
              <span style={{
                background: '#EDE7FF',
                color: '#6F3DFF',
                border: '1px solid #D8C7FF',
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                marginBottom: 14
              }}>
                🏛️ Govt Verified Scheme
              </span>
              <h4 style={{ fontSize: '1.15rem', marginBottom: 8 }}>Official Master Circulars</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Subsidies, margins, and interest subventions referenced directly from Ministry of Finance, NABARD, and MSME gazettes.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 16, border: '1px solid #FDE68A' }}>
              <span className="badge-ai" style={{ marginBottom: 14 }}>🟡 AI / Synthetic Estimate</span>
              <h4 style={{ fontSize: '1.15rem', marginBottom: 8 }}>Model-Generated Projection</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Mathematical simulations (e.g. Poisson spatial density) or Llama 3 8B advisory chunks. Never confused with census or tax data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Section */}
      <section style={{ padding: '70px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #6F3DFF 0%, #4D26C4 100%)', borderRadius: 24, padding: '48px 56px', color: '#FFFFFF' }}>
          <div style={{ maxWidth: 580 }}>
            <span style={{ background: 'rgba(255,255,255,0.18)', padding: '4px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700 }}>
              Bhashini Indic AI Integration
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginTop: 14, marginBottom: 14 }}>
              Accessible for Low-Literacy Entrepreneurs
            </h2>
            <p style={{ color: '#E2E8F0', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 24 }}>
              Rural users can speak naturally in Hindi, Marathi, or English. Listen to audio playback of each feasibility section without navigating dense paperwork.
            </p>
            <button 
              onClick={onOpenVoice}
              style={{
                background: '#BFE9FF',
                color: '#13151A',
                fontWeight: 700,
                padding: '12px 24px',
                borderRadius: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Volume2 size={18} />
              <span>Try Indic Voice Assistant</span>
            </button>
          </div>

          <div style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(191, 233, 255, 0.3)'
          }}>
            <button 
              onClick={onOpenVoice}
              className="mic-pulse"
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: '#FFFFFF',
                color: '#6F3DFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Volume2 size={36} color="#6F3DFF" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E2E8F0', paddingTop: 40, marginTop: 40 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>RuralBiz AI</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              SIH Problem Statement 26091 — Intelligent Rural Business Advisory & Financial Planning
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Developed for Smart India Hackathon (SIH 2026) • All calculations adhere to RBI Master Circulars
          </div>
        </div>
      </footer>
    </div>
  );
}
