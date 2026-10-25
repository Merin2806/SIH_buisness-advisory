import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertCircle, 
  Save, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  Percent,
  Sliders,
  DollarSign
} from 'lucide-react';
import { api } from '../api';
import BackButton from './common/BackButton';

export default function BudgeterPage({ user, onBack }) {
  // Budget Inputs State
  const [sellingPrice, setSellingPrice] = useState(155.0);
  const [rawMaterialCost, setRawMaterialCost] = useState(88.0);
  const [dailyUnits, setDailyUnits] = useState(14);
  const [workingDays, setWorkingDays] = useState(26);
  const [rentMonthly, setRentMonthly] = useState(1800.0);
  const [utilitiesMonthly, setUtilitiesMonthly] = useState(1200.0);
  const [transportMonthly, setTransportMonthly] = useState(800.0);
  const [salariesMonthly, setSalariesMonthly] = useState(0.0);
  const [otherFixedMonthly, setOtherFixedMonthly] = useState(500.0);

  // Computed results state
  const [results, setResults] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [scenarioName, setScenarioName] = useState('Baramati Desi Layer Baseline');

  useEffect(() => {
    recalculate();
  }, [
    sellingPrice, 
    rawMaterialCost, 
    dailyUnits, 
    workingDays, 
    rentMonthly, 
    utilitiesMonthly, 
    transportMonthly, 
    salariesMonthly, 
    otherFixedMonthly
  ]);

  const recalculate = () => {
    const fixedCosts = rentMonthly + utilitiesMonthly + transportMonthly + salariesMonthly + otherFixedMonthly;
    const contribution = sellingPrice - rawMaterialCost;
    const marginPct = sellingPrice > 0 ? (contribution / sellingPrice) * 100 : 0;
    const isPositive = contribution > 0;

    let breakEvenMonthly = 0;
    let breakEvenDaily = 0;
    let breakEvenRevenue = 0;

    if (isPositive) {
      breakEvenMonthly = parseFloat((fixedCosts / contribution).toFixed(1));
      breakEvenDaily = parseFloat((breakEvenMonthly / Math.max(1, workingDays)).toFixed(1));
      breakEvenRevenue = parseFloat((breakEvenMonthly * sellingPrice).toFixed(2));
    } else {
      breakEvenMonthly = 999999;
      breakEvenDaily = 999999;
      breakEvenRevenue = 999999;
    }

    const monthlyUnits = dailyUnits * workingDays;
    const expectedRevenue = parseFloat((monthlyUnits * sellingPrice).toFixed(2));
    const variableCosts = parseFloat((monthlyUnits * rawMaterialCost).toFixed(2));
    const totalExpenses = parseFloat((fixedCosts + variableCosts).toFixed(2));
    const operatingProfit = parseFloat((expectedRevenue - totalExpenses).toFixed(2));

    let healthZone = "Safe Zone (Resilient Margin)";
    let healthColor = "#10B981";
    if (!isPositive) {
      healthZone = "Critical Risk (Negative Margin)";
      healthColor = "#EF4444";
    } else if (marginPct < 20) {
      healthZone = "High Risk Zone (Vulnerable to Feed Costs)";
      healthColor = "#F59E0B";
    } else if (marginPct < 35) {
      healthZone = "Moderate Margin Zone";
      healthColor = "#3B82F6";
    }

    // Sensitivity scenarios
    const sensitivities = [
      { label: "Price -10% / Sales Base", price: (sellingPrice * 0.9).toFixed(1), units: dailyUnits, profit: ((dailyUnits * workingDays * (sellingPrice * 0.9)) - (fixedCosts + (dailyUnits * workingDays * rawMaterialCost))).toFixed(0) },
      { label: "Base Case", price: sellingPrice.toFixed(1), units: dailyUnits, profit: operatingProfit.toFixed(0) },
      { label: "Price +10% / Sales Base", price: (sellingPrice * 1.1).toFixed(1), units: dailyUnits, profit: ((dailyUnits * workingDays * (sellingPrice * 1.1)) - (fixedCosts + (dailyUnits * workingDays * rawMaterialCost))).toFixed(0) },
      { label: "Feed +15% Inflation", price: sellingPrice.toFixed(1), units: dailyUnits, profit: (expectedRevenue - (fixedCosts + (monthlyUnits * (rawMaterialCost * 1.15)))).toFixed(0) }
    ];

    setResults({
      fixedCosts,
      contribution,
      marginPct,
      isPositive,
      breakEvenMonthly,
      breakEvenDaily,
      breakEvenRevenue,
      expectedRevenue,
      totalExpenses,
      operatingProfit,
      healthZone,
      healthColor,
      sensitivities
    });
  };

  const handleSaveScenario = async () => {
    if (!user) {
      setSaveSuccess('Please sign in to save this scenario to your history.');
      return;
    }
    try {
      await api.saveBudgetScenario({
        scenario_name: scenarioName,
        inputs: {
          raw_material_cost_per_unit: rawMaterialCost,
          selling_price_per_unit: sellingPrice,
          daily_units_sold: dailyUnits,
          working_days_per_month: workingDays,
          rent_per_month: rentMonthly,
          salaries_per_month: salariesMonthly,
          transport_cost_per_month: transportMonthly,
          utilities_per_month: utilitiesMonthly,
          packaging_cost_per_month: 0,
          other_fixed_costs_per_month: otherFixedMonthly
        }
      });
      setSaveSuccess('Scenario saved successfully to your assessment profile!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      setSaveSuccess('Failed to save scenario.');
    }
  };

  if (!results) return null;

  return (
    <div className="container" style={{ padding: 'clamp(20px, 4vw, 40px) 16px 80px 16px' }}>
      {onBack && (
        <BackButton 
          onClick={onBack} 
          label={user ? 'Back to Dashboard' : 'Back to Home'} 
          style={{ marginBottom: 20 }} 
        />
      )}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EDE7FF', color: '#6F3DFF', padding: '4px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>
          <Sliders size={14} />
          <span>Interactive Unit Economics Engine</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', marginBottom: 6 }}>
          Dynamic Break-Even & Profit Budgeter
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Real-time sensitivity modeling for rural micro-enterprises. Adjust selling prices and raw input costs to gauge commercial resiliency.
        </p>
      </div>

      <div className="budgeter-split-grid">
        {/* Sliders & Numeric Inputs Column */}
        <div className="card">
          <h2 style={{ fontSize: '1.35rem', marginBottom: 20 }}>Adjust Operational Cost Levers</h2>

          {/* Selling Price Slider */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Farm-Gate / Retail Selling Price per Unit</label>
              <strong style={{ fontSize: '1.15rem', color: '#6F3DFF' }}>₹{sellingPrice}</strong>
            </div>
            <input 
              type="range" 
              min="50" 
              max="400" 
              step="1"
              value={sellingPrice}
              onChange={e => setSellingPrice(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#6F3DFF' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>₹50 (Mandi Wholesale Floor)</span>
              <span>₹155 (Haat Retail)</span>
              <span>₹400 (Premium Direct)</span>
            </div>
          </div>

          {/* Raw Material Cost Slider */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Raw Material / Feed Input Cost per Unit</label>
              <strong style={{ fontSize: '1.15rem', color: '#13151A' }}>₹{rawMaterialCost}</strong>
            </div>
            <input 
              type="range" 
              min="20" 
              max="250" 
              step="1"
              value={rawMaterialCost}
              onChange={e => setRawMaterialCost(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#13151A' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>₹20 (Subsidized Grains)</span>
              <span>₹88 (Standard Mash + Chick)</span>
              <span>₹250 (High Feed Inflation)</span>
            </div>
          </div>

          {/* Daily Units Sold Slider */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Daily Expected Units Sold</label>
              <strong style={{ fontSize: '1.15rem', color: '#10B981' }}>{dailyUnits} units/day</strong>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              step="1"
              value={dailyUnits}
              onChange={e => setDailyUnits(parseInt(e.target.value) || 1)}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>

          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 20, marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: 14 }}>Monthly Fixed Overhead Breakdown</h3>
            <div className="overhead-inputs-grid">
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Shop / Land Rent (₹/mo)</label>
                <input 
                  type="number"
                  value={rentMonthly}
                  onChange={e => setRentMonthly(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--mineral-grey-border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Electricity & Water (₹/mo)</label>
                <input 
                  type="number"
                  value={utilitiesMonthly}
                  onChange={e => setUtilitiesMonthly(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--mineral-grey-border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Transport & Delivery (₹/mo)</label>
                <input 
                  type="number"
                  value={transportMonthly}
                  onChange={e => setTransportMonthly(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--mineral-grey-border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Working Days / Month</label>
                <input 
                  type="number"
                  value={workingDays}
                  onChange={e => setWorkingDays(parseInt(e.target.value) || 26)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--mineral-grey-border)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Diagnostic Dashboard Column */}
        <div>
          {/* Health Zone Banner */}
          <div style={{
            background: results.healthColor,
            color: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 16,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
          }}>
            <ShieldCheck size={28} />
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.9 }}>Commercial Margin Health</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{results.healthZone}</div>
            </div>
          </div>

          {/* Key Output Metrics */}
          <div className="grid-responsive-2" style={{ marginBottom: 20 }}>
            <div className="card">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Break-Even Target</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#6F3DFF' }}>
                {results.isPositive ? `${results.breakEvenDaily} units` : 'Impossible'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {results.isPositive ? `₹${results.breakEvenRevenue.toLocaleString()} / mo revenue` : 'Negative margin'}
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contribution Margin</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: results.isPositive ? '#10B981' : '#EF4444' }}>
                ₹{results.contribution} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>({results.marginPct.toFixed(1)}%)</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Price minus Variable Feed
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Operating Profit</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: results.operatingProfit >= 0 ? '#10B981' : '#EF4444' }}>
                ₹{results.operatingProfit.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Net after fixed overhead
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Revenue</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#13151A' }}>
                ₹{results.expectedRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                At {dailyUnits} units/day
              </div>
            </div>
          </div>

          {/* Sensitivity Table */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 10 }}>Market Stress-Test Sensitivity Matrix</h3>
            <div className="table-responsive-container">
              <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>Scenario</th>
                    <th style={{ padding: '6px 8px' }}>Price</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Monthly Net Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {results.sensitivities.map((s, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '8px', fontWeight: 600 }}>{s.label}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>₹{s.price}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: parseFloat(s.profit) >= 0 ? '#10B981' : '#EF4444' }}>
                        ₹{parseFloat(s.profit).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save Scenario Box */}
          <div className="card" style={{ background: '#F8FAFC' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <input 
                type="text" 
                value={scenarioName}
                onChange={e => setScenarioName(e.target.value)}
                placeholder="Scenario Name"
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--mineral-grey-border)', fontSize: '0.85rem' }}
              />
              <button 
                onClick={handleSaveScenario}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Save size={15} />
                <span>Save</span>
              </button>
            </div>
            {saveSuccess && (
              <div style={{ fontSize: '0.8rem', color: '#10B981', marginTop: 8, fontWeight: 600 }}>
                {saveSuccess}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
