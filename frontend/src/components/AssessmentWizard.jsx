import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Building2, 
  Calculator, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  LocateFixed, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Store,
  Scissors,
  Egg,
  Milk,
  Utensils,
  Wrench,
  Palette,
  Sparkle,
  Eye,
  Info,
  DollarSign,
  Briefcase,
  X,
  Loader2,
  RefreshCw,
  Compass,
  Search
} from 'lucide-react';
import { api } from '../api';
import { getTranslation } from '../i18n';
import { INDIAN_STATES, INDIAN_LOCATIONS_DATA } from '../data/indiaLocations';

export default function AssessmentWizard({ onComplete, onCancel, lang = 'en' }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = (k) => getTranslation(k, lang);

  // STEP 1: Dependent Location Selection & Catchment
  const [stateName, setStateName] = useState('Maharashtra');
  const [stateSearch, setStateSearch] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [districtSearch, setDistrictSearch] = useState('');
  const [cityOrTaluka, setCityOrTaluka] = useState('Baramati');
  const [citySearch, setCitySearch] = useState('');
  const [villageOrAddress, setVillageOrAddress] = useState('Baramati Rural');
  const [latitude, setLatitude] = useState(18.1512);
  const [longitude, setLongitude] = useState(74.5771);
  const [searchRadiusKm, setSearchRadiusKm] = useState(5.0);
  const [isGpsVerified, setIsGpsVerified] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsNotice, setGpsNotice] = useState(null); // { type: 'info' | 'warning' | 'success', text: string }
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [resolvedLocationInfo, setResolvedLocationInfo] = useState({
    name: 'Baramati Rural, Pune, Maharashtra',
    source: 'Verified Rural Anchor',
    isExact: true
  });
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // STEP 2: Category & Live Mapped Businesses
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('poultry');
  const [geoData, setGeoData] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const step2MapRef = useRef(null);
  const step2MapInstanceRef = useRef(null);

  // STEP 3: Preliminary Feasibility & Editable Proposed Capital
  const [proposedCapital, setProposedCapital] = useState(150000);
  const [seedCapital, setSeedCapital] = useState(30000);
  const [calculatedFinance, setCalculatedFinance] = useState(null);
  const [preliminaryAdvisory, setPreliminaryAdvisory] = useState(null);

  // STEP 4: Business and Operational Cost Details
  const [proposedBusinessName, setProposedBusinessName] = useState('Patil Poultry & Layer Farm');
  const [businessStage, setBusinessStage] = useState('new');
  const [numberOfWorkers, setNumberOfWorkers] = useState(2);
  const [targetCustomersDesc, setTargetCustomersDesc] = useState('Local village weekly bazaars, rural roadside dhabas and household direct retail');
  const [rawMaterialCost, setRawMaterialCost] = useState(115.0);
  const [sellingPrice, setSellingPrice] = useState(185.0);
  const [dailyUnits, setDailyUnits] = useState(30);
  const [workingDays, setWorkingDays] = useState(26);
  const [rentMonthly, setRentMonthly] = useState(3500.0);
  const [salariesMonthly, setSalariesMonthly] = useState(6000.0);
  const [utilitiesMonthly, setUtilitiesMonthly] = useState(2000.0);
  const [transportMonthly, setTransportMonthly] = useState(2500.0);
  const [packagingMonthly, setPackagingMonthly] = useState(1200.0);
  const [otherFixedMonthly, setOtherFixedMonthly] = useState(1500.0);

  // STEP 5: Live Pipeline Progress State
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);

  const pipelineLogs = [
    "Locking GPS coordinates & querying OpenStreetMap infrastructure...",
    "Retrieving local markets, transport access & road connectivity...",
    "Reconciling verified scheme rules (Mudra, NABARD, PMEGP)...",
    "Running deterministic EMI, moratorium & DSCR financial calculations...",
    "Synthesizing 6-section evidence-grounded rural business advisory report..."
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      if (data && data.length > 0) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  // Step 1 Map
  useEffect(() => {
    if (currentStep === 1 && mapContainerRef.current && window.L) {
      if (!mapInstanceRef.current) {
        const map = window.L.map(mapContainerRef.current).setView([latitude, longitude], 12);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const marker = window.L.marker([latitude, longitude], { draggable: true }).addTo(map);
        marker.on('dragend', (e) => {
          const pos = e.target.getLatLng();
          setLatitude(parseFloat(pos.lat.toFixed(5)));
          setLongitude(parseFloat(pos.lng.toFixed(5)));
        });

        const circle = window.L.circle([latitude, longitude], {
          color: '#6F3DFF',
          fillColor: '#BFE9FF',
          fillOpacity: 0.25,
          radius: searchRadiusKm * 1000
        }).addTo(map);

        mapInstanceRef.current = { map, marker, circle };
      } else {
        const { map, marker, circle } = mapInstanceRef.current;
        map.setView([latitude, longitude], 12);
        marker.setLatLng([latitude, longitude]);
        circle.setLatLng([latitude, longitude]);
        circle.setRadius(searchRadiusKm * 1000);
      }
    }
  }, [currentStep, latitude, longitude, searchRadiusKm]);

  // When entering Step 2 or changing category: Fetch Mapped Businesses
  useEffect(() => {
    if (currentStep === 2) {
      loadMappedBusinesses();
    }
  }, [currentStep, selectedCategorySlug, latitude, longitude, searchRadiusKm]);

  const loadMappedBusinesses = async () => {
    setGeoLoading(true);
    try {
      const res = await api.analyzeGeo({
        latitude,
        longitude,
        category_slug: selectedCategorySlug,
        radius_km: searchRadiusKm
      });
      setGeoData(res);
    } catch (err) {
      console.error('Failed to load geospatial data:', err);
    } finally {
      setGeoLoading(false);
    }
  };

  // Step 2 Map Render
  useEffect(() => {
    if (currentStep === 2 && step2MapRef.current && window.L && geoData) {
      if (step2MapInstanceRef.current) {
        step2MapInstanceRef.current.remove();
        step2MapInstanceRef.current = null;
      }

      const map = window.L.map(step2MapRef.current).setView([latitude, longitude], 13);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Center marker
      const centerMarker = window.L.marker([latitude, longitude]).addTo(map);
      centerMarker.bindPopup(`<b>Proposed Location Anchor</b><br/>${villageOrAddress || cityOrTaluka}, ${district}, ${stateName}`).openPopup();

      // Radius circle
      window.L.circle([latitude, longitude], {
        color: '#6F3DFF',
        fillColor: '#BFE9FF',
        fillOpacity: 0.2,
        radius: searchRadiusKm * 1000
      }).addTo(map);

      // Real Mapped Observed Features (Shops, Markets, Transit, Clinics)
      if (geoData.observed_features && geoData.observed_features.length > 0) {
        geoData.observed_features.forEach((c) => {
          let iconEmoji = '🏪';
          let bgCol = '#10B981';
          if (c.feature_type === 'market') { iconEmoji = '🛒'; bgCol = '#6F3DFF'; }
          else if (c.feature_type === 'bus_stop' || c.feature_type === 'road') { iconEmoji = '🚌'; bgCol = '#0284C7'; }
          else if (c.feature_type === 'clinic' || c.category === 'healthcare') { iconEmoji = '🏥'; bgCol = '#EF4444'; }
          else if (c.category === selectedCategorySlug) { iconEmoji = '★'; bgCol = '#DC2626'; }

          const compIcon = window.L.divIcon({
            className: 'custom-comp-marker',
            html: `<div style="background:${bgCol};color:#FFF;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid #FFF;box-shadow:0 2px 6px rgba(0,0,0,0.35);">${iconEmoji}</div>`
          });
          window.L.marker([c.latitude, c.longitude], { icon: compIcon })
            .addTo(map)
            .bindPopup(`<b>${c.name}</b><br/>Category: ${c.normalized_category || c.category}<br/>Distance: ${(c.distance_km || 1.2).toFixed(2)} km<br/>Source: ${c.provenance || 'OpenStreetMap'}`);
        });
      }

      // Isolated Synthetic Demonstration Points
      if (geoData.synthetic_competitors && geoData.synthetic_competitors.length > 0) {
        geoData.synthetic_competitors.forEach((s) => {
          const synthIcon = window.L.divIcon({
            className: 'custom-synth-marker',
            html: `<div style="background:#F59E0B;color:#FFF;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:2px solid #FFF;box-shadow:0 2px 6px rgba(0,0,0,0.25);">📊</div>`
          });
          window.L.marker([s.latitude, s.longitude], { icon: synthIcon })
            .addTo(map)
            .bindPopup(`<b>${s.business_name}</b><br/><i>[Synthetic Poisson Model]</i><br/>Sales: ${s.monthly_sales_range}<br/>Distance: ${(s.distance_km || 1.5).toFixed(2)} km`);
        });
      }

      step2MapInstanceRef.current = map;
    }
  }, [currentStep, geoData]);

  // When entering Step 3: Recalculate deterministic preliminary estimates based on proposed capital
  useEffect(() => {
    if (currentStep === 3) {
      recalculateFinance(proposedCapital, seedCapital);
    }
  }, [currentStep, proposedCapital, seedCapital, selectedCategorySlug]);

  const recalculateFinance = async (cost, margin) => {
    try {
      const res = await api.calculateFinance({
        total_project_cost: cost,
        seed_capital: margin,
        category_slug: selectedCategorySlug
      });
      setCalculatedFinance(res);
    } catch (err) {
      console.error('Calculation error:', err);
    }
  };

  // Dependent Location Handlers
  const availableDistricts = stateName && INDIAN_LOCATIONS_DATA[stateName]?.districts
    ? Object.keys(INDIAN_LOCATIONS_DATA[stateName].districts)
    : ["Pune", "Satara", "Solapur", "Nashik", "Ahmednagar", "Kolhapur", "Nagpur", "Chhatrapati Sambhajinagar (Aurangabad)"];

  const availableTalukas = stateName && district && INDIAN_LOCATIONS_DATA[stateName]?.districts[district]?.talukas
    ? INDIAN_LOCATIONS_DATA[stateName].districts[district].talukas
    : [
        { name: "Baramati", lat: 18.1512, lon: 74.5771 },
        { name: "Daund", lat: 18.4643, lon: 74.5828 },
        { name: "Indapur", lat: 18.1147, lon: 75.0315 },
        { name: "Haveli", lat: 18.5204, lon: 73.8567 },
        { name: "Shirur", lat: 18.8261, lon: 74.3768 }
      ];

  const handleStateChange = (selectedState) => {
    setStateName(selectedState);
    setDistrict('');
    setCityOrTaluka('');
    setVillageOrAddress('');
    setResolvedLocationInfo(null);
    setError('');

    const stateObj = INDIAN_LOCATIONS_DATA[selectedState];
    if (stateObj) {
      setLatitude(parseFloat(stateObj.lat.toFixed(5)));
      setLongitude(parseFloat(stateObj.lon.toFixed(5)));
    }
  };

  const handleDistrictChange = (selectedDistrict) => {
    setDistrict(selectedDistrict);
    setCityOrTaluka('');
    setVillageOrAddress('');
    setResolvedLocationInfo(null);
    setError('');

    const distObj = INDIAN_LOCATIONS_DATA[stateName]?.districts[selectedDistrict];
    if (distObj) {
      setLatitude(parseFloat(distObj.lat.toFixed(5)));
      setLongitude(parseFloat(distObj.lon.toFixed(5)));
    }
  };

  const handleCityChange = (selectedCity) => {
    setCityOrTaluka(selectedCity);
    setVillageOrAddress('');
    setResolvedLocationInfo(null);
    setError('');

    const talukaList = INDIAN_LOCATIONS_DATA[stateName]?.districts[district]?.talukas || [];
    const match = talukaList.find(t => t.name.toLowerCase() === selectedCity.toLowerCase());
    if (match) {
      setLatitude(parseFloat(match.lat.toFixed(5)));
      setLongitude(parseFloat(match.lon.toFixed(5)));
      setResolvedLocationInfo({
        name: `${match.name}, ${district}, ${stateName}`,
        source: 'Maintained Regional Centroid',
        isExact: true
      });
    }
  };

  const handleResolveAddress = async () => {
    if (!villageOrAddress || !villageOrAddress.trim()) return;
    setIsResolvingLocation(true);
    try {
      const res = await api.resolveLocation({
        state: stateName,
        district,
        city_or_taluka: cityOrTaluka,
        village_or_address: villageOrAddress
      });
      if (res && res.latitude && res.longitude) {
        setLatitude(parseFloat(res.latitude.toFixed(5)));
        setLongitude(parseFloat(res.longitude.toFixed(5)));
        setResolvedLocationInfo({
          name: res.display_name,
          source: res.source,
          isExact: res.is_exact
        });
      }
    } catch (err) {
      console.warn('Geocoding notice:', err);
    } finally {
      setIsResolvingLocation(false);
    }
  };

  // Non-blocking GPS Handler
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsNotice({
        type: 'warning',
        text: 'Geolocation is not supported by your browser or environment. Please choose your State, District, and City from the dropdowns below.'
      });
      return;
    }

    setIsGpsLoading(true);
    setGpsNotice(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsGpsLoading(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lon = parseFloat(pos.coords.longitude.toFixed(5));
        setLatitude(lat);
        setLongitude(lon);
        setIsGpsVerified(true);
        try {
          const rev = await api.reverseGeocode({ latitude: lat, longitude: lon });
          if (rev.state) setStateName(rev.state);
          if (rev.district) setDistrict(rev.district);
          if (rev.city_or_taluka) setCityOrTaluka(rev.city_or_taluka);
          if (rev.village) setVillageOrAddress(rev.village);
          setGpsNotice({
            type: 'success',
            text: `GPS coordinates locked (${lat}, ${lon}) and reverse-geocoded successfully.`
          });
          setResolvedLocationInfo({
            name: rev.display_name || `${lat}, ${lon}`,
            source: 'Hardware GPS Reverse-Geocode',
            isExact: true
          });
        } catch {
          setGpsNotice({
            type: 'info',
            text: `GPS coordinates locked (${lat}, ${lon}). Please select State and District.`
          });
        }
      },
      (err) => {
        setIsGpsLoading(false);
        let msg = 'Location permission denied or unavailable on this device/network. Please choose your State, District, and City manually using the dropdowns below.';
        if (err.code === err.TIMEOUT) {
          msg = 'GPS request timed out. Please enter your location manually using the dropdowns below.';
        }
        setGpsNotice({ type: 'warning', text: msg });
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  const handleProceedToStep2 = () => {
    setError('');
    if (!stateName) {
      setError('Please select your State.');
      return;
    }
    if (!district) {
      setError('Please select your District.');
      return;
    }
    if (!cityOrTaluka) {
      setError('Please select your City, Town, or Taluka.');
      return;
    }
    if (!villageOrAddress || !villageOrAddress.trim()) {
      setError('Please enter your Village name, locality, or enterprise address.');
      return;
    }
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      setError('Valid coordinates are required. Drag the pin on the map or enter coordinates.');
      return;
    }
    setCurrentStep(2);
  };

  const handleFinalSubmit = async () => {
    setIsGenerating(true);
    setPipelineStep(0);
    setError('');

    // Advance progress indicator
    const timer = setInterval(() => {
      setPipelineStep((prev) => (prev < pipelineLogs.length - 1 ? prev + 1 : prev));
    }, 1100);

    try {
      const payload = {
        category_slug: selectedCategorySlug,
        proposed_business_name: proposedBusinessName,
        business_stage: businessStage,
        seed_capital: Number(seedCapital),
        estimated_project_cost: Number(proposedCapital),
        number_of_workers: Number(numberOfWorkers),
        target_customers_desc: targetCustomersDesc,
        village: villageOrAddress,
        taluka_or_city: cityOrTaluka,
        district: district,
        state: stateName,
        address: villageOrAddress,
        latitude: Number(latitude),
        longitude: Number(longitude),
        search_radius_km: Number(searchRadiusKm),
        is_gps_verified: isGpsVerified,
        cost_inputs: {
          raw_material_cost_per_unit: Number(rawMaterialCost),
          selling_price_per_unit: Number(sellingPrice),
          daily_units_sold: Number(dailyUnits),
          working_days_per_month: Number(workingDays),
          rent_per_month: Number(rentMonthly),
          salaries_per_month: Number(salariesMonthly),
          utilities_per_month: Number(utilitiesMonthly),
          transport_cost_per_month: Number(transportMonthly),
          packaging_cost_per_month: Number(packagingMonthly),
          other_fixed_costs_per_month: Number(otherFixedMonthly)
        }
      };

      const result = await api.createAssessment(payload);
      clearInterval(timer);
      setIsGenerating(false);
      onComplete(result.assessment_id);
    } catch (err) {
      clearInterval(timer);
      setIsGenerating(false);
      setError(err.message || 'Assessment generation failed. Please review inputs.');
    }
  };

  const categoryIcons = {
    poultry: <Egg size={22} />,
    tailoring: <Scissors size={22} />,
    kirana: <Store size={22} />,
    dairy: <Milk size={22} />,
    food_processing: <Utensils size={22} />,
    repair: <Wrench size={22} />,
    handicrafts: <Palette size={22} />
  };

  return (
    <div className="container" style={{ padding: 'clamp(20px, 3vw, 36px) clamp(12px, 3vw, 24px) 100px clamp(12px, 3vw, 24px)', maxWidth: 960 }}>
      {/* Step Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6F3DFF', textTransform: 'uppercase' }}>
              SIH 26091 Feasibility Wizard
            </span>
            <h1 style={{ fontSize: '1.75rem', color: '#13151A', marginTop: 2 }}>
              {currentStep === 1 && t('step1Title')}
              {currentStep === 2 && t('step2Title')}
              {currentStep === 3 && t('step3Title')}
              {currentStep === 4 && t('step4Title')}
              {currentStep === 5 && t('step5Title')}
            </h1>
          </div>
          <button onClick={onCancel} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
            Cancel
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div style={{ display: 'flex', gap: 6, height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s} 
              style={{ 
                flex: 1, 
                background: s <= currentStep ? '#6F3DFF' : 'transparent',
                borderRadius: 999,
                transition: 'background 0.3s'
              }} 
            />
          ))}
        </div>
      </div>

      {error && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#B91C1C',
          padding: '12px 16px',
          borderRadius: 12,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {gpsNotice && (
        <div style={{
          background: gpsNotice.type === 'success' ? '#F0FDF4' : gpsNotice.type === 'warning' ? '#FFFBEB' : '#EFF6FF',
          border: `1px solid ${gpsNotice.type === 'success' ? '#BBF7D0' : gpsNotice.type === 'warning' ? '#FDE68A' : '#BFDBFE'}`,
          color: gpsNotice.type === 'success' ? '#166534' : gpsNotice.type === 'warning' ? '#92400E' : '#1E40AF',
          padding: '12px 16px',
          borderRadius: 12,
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.88rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {gpsNotice.type === 'success' ? <CheckCircle2 size={18} color="#166534" /> : <Info size={18} />}
            <span>{gpsNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setGpsNotice(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 4 }}
            title="Dismiss notice"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {currentStep === 1 && (
        <div className="card">
          <div className="wizard-split-layout">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: '1.18rem', margin: 0, color: '#1E293B' }}>Select Your Enterprise Anchor</h3>
                <span style={{ fontSize: '0.75rem', background: '#EDE7FF', color: '#6F3DFF', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                  Step 1 of 5
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: 16 }}>
                Choose your administrative location hierarchy. Downstream fields update dependently to guarantee geographic precision.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Field 1: State (Searchable Dropdown) */}
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                    <span>Field 1: State / Union Territory <span style={{ color: '#EF4444' }}>*</span></span>
                    <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 400 }}>Maintained Dataset</span>
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => handleStateChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.92rem',
                      background: '#FFFFFF',
                      fontWeight: 600,
                      color: '#1E293B',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">-- Select State / UT --</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Field 2: District (Searchable Dropdown, Dependent on State) */}
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                    <span>Field 2: District <span style={{ color: '#EF4444' }}>*</span></span>
                    <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 400 }}>
                      {!stateName ? '(Select State first)' : `${availableDistricts.length} districts`}
                    </span>
                  </label>
                  <select
                    value={district}
                    disabled={!stateName}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.92rem',
                      background: !stateName ? '#F1F5F9' : '#FFFFFF',
                      fontWeight: 600,
                      color: !stateName ? '#94A3B8' : '#1E293B',
                      cursor: !stateName ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">-- Select District --</option>
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Field 3: City / Town / Taluka (Searchable Dropdown, Dependent on District) */}
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                    <span>Field 3: City / Town / Taluka <span style={{ color: '#EF4444' }}>*</span></span>
                    <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 400 }}>
                      {!district ? '(Select District first)' : `${availableTalukas.length} administrative blocks`}
                    </span>
                  </label>
                  <select
                    value={cityOrTaluka}
                    disabled={!district}
                    onChange={(e) => handleCityChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.92rem',
                      background: !district ? '#F1F5F9' : '#FFFFFF',
                      fontWeight: 600,
                      color: !district ? '#94A3B8' : '#1E293B',
                      cursor: !district ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">-- Select City / Town / Taluka --</option>
                    {availableTalukas.map((tObj) => (
                      <option key={tObj.name} value={tObj.name}>{tObj.name}</option>
                    ))}
                  </select>
                </div>

                {/* Field 4: Village Name or Actual Enterprise Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                    Field 4: Village Name or Actual Address <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                      type="text" 
                      placeholder="e.g., Baramati Rural, Market Yard, Shop No 4"
                      value={villageOrAddress}
                      onChange={(e) => setVillageOrAddress(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleResolveAddress(); } }}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.92rem',
                        fontWeight: 500
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleResolveAddress}
                      disabled={isResolvingLocation || !villageOrAddress.trim()}
                      className="btn-secondary"
                      style={{
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        whiteSpace: 'nowrap'
                      }}
                      title="Geocode village or locality"
                    >
                      {isResolvingLocation ? <Loader2 size={16} className="spin" /> : <Search size={16} color="#6F3DFF" />}
                      <span>Pinpoint</span>
                    </button>
                  </div>

                  {resolvedLocationInfo && (
                    <div style={{
                      marginTop: 8,
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      padding: '6px 10px',
                      borderRadius: 6,
                      fontSize: '0.76rem',
                      color: '#166534',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <CheckCircle2 size={14} color="#166534" />
                      <span><strong>Resolved:</strong> {resolvedLocationInfo.name} ({resolvedLocationInfo.source})</span>
                    </div>
                  )}
                </div>

                {/* Radius Slider */}
                <div style={{ marginTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                      Catchment Analysis Radius: <span style={{ color: '#6F3DFF' }}>{searchRadiusKm} km</span>
                    </label>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>5 km default</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    step="0.5"
                    value={searchRadiusKm}
                    onChange={(e) => setSearchRadiusKm(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#6F3DFF' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                    <span>1 km (Local Wada)</span>
                    <span style={{ fontWeight: 700, color: '#6F3DFF' }}>5 km (Default Haat Radius)</span>
                    <span>15 km (Taluka Catchment)</span>
                  </div>
                </div>

                {/* GPS Trigger Button */}
                <div style={{ marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={handleUseGps}
                    disabled={isGpsLoading}
                    className="btn-secondary"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '0.86rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      background: '#FAF5FF',
                      borderColor: '#DDD6FE'
                    }}
                  >
                    {isGpsLoading ? <Loader2 size={16} className="spin" color="#6F3DFF" /> : <LocateFixed size={16} color="#6F3DFF" />}
                    <span style={{ fontWeight: 600, color: '#6F3DFF' }}>
                      {isGpsLoading ? 'Requesting Hardware GPS...' : 'Use My Current GPS'}
                    </span>
                  </button>
                  <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 4, textAlign: 'center' }}>
                    Non-blocking: If permission is denied or device lacks GPS, manual selection remains fully functional.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Map Preview */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#6F3DFF' }}>Location Confirmation Map</span>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Drag pin to adjust</span>
              </div>
              <div 
                ref={mapContainerRef} 
                style={{ width: '100%', height: 320, borderRadius: 12, border: '1.5px solid #CBD5E1', overflow: 'hidden' }}
              />
              <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: 8, textAlign: 'center', background: '#F8FAFC', padding: '6px 10px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                <strong>Coordinates:</strong> Latitude: {latitude} • Longitude: {longitude} {isGpsVerified ? '• (GPS Hardware)' : '• (Empirical)'}
              </div>
              <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 6, textAlign: 'center' }}>
                Purple circle indicates the {searchRadiusKm} km business catchment area.
              </p>
            </div>
          </div>

          <div className="wizard-nav-actions" style={{ justifyContent: 'flex-end' }}>
            <button 
              type="button"
              onClick={handleProceedToStep2}
              className="btn-primary"
              style={{ padding: '11px 24px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span>Continue to Category & Mapped Businesses</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Business Category AND View Existing Mapped Businesses Immediately */}
      {currentStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Category Selector Grid */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>Select Business Category</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Existing OpenStreetMap businesses and transport infrastructure will refresh immediately.
            </p>

            <div className="grid-responsive-4">
              {categories.map((cat) => {
                const isSelected = selectedCategorySlug === cat.slug;
                return (
                  <div
                    key={cat.slug}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    style={{
                      border: isSelected ? '2px solid #6F3DFF' : '1px solid #E2E8F0',
                      background: isSelected ? '#EDE7FF' : '#FFFFFF',
                      borderRadius: 12,
                      padding: '14px 12px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ color: isSelected ? '#6F3DFF' : '#475569', marginBottom: 6 }}>
                      {categoryIcons[cat.slug] || <Store size={22} />}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: isSelected ? 800 : 600, color: '#1E293B' }}>
                      {cat.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Immediately Mapped Businesses & Infrastructure Display */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#13151A', margin: 0 }}>
                  Empirical Mapped Features in {searchRadiusKm} km Radius
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#0369A1', fontWeight: 600 }}>
                  PostGIS Database & OpenStreetMap Live Catchment
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700 }}>
                  {geoLoading ? 'Querying...' : `${(geoData?.observed_features?.length || 0) + (geoData?.synthetic_competitors?.length || 0)} Total Features`}
                </span>
                <span style={{ background: '#EDE7FF', color: '#6F3DFF', padding: '4px 10px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700 }}>
                  {geoLoading ? '...' : `${geoData?.competitors_count || 0} In Category`}
                </span>
              </div>
            </div>

            <div className="wizard-split-layout">
              {/* Map Visualization */}
              <div 
                ref={step2MapRef}
                style={{ width: '100%', height: 320, borderRadius: 12, border: '1px solid #CBD5E1', overflow: 'hidden' }}
              />

              {/* Observed & Synthetic Competitor Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Mapped Businesses & Infrastructure
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    {geoData?.observed_features?.length || 0} OSM verified
                  </span>
                </div>

                {geoLoading ? (
                  <div style={{ color: '#64748B', fontSize: '0.85rem', textAlign: 'center', padding: 30 }}>
                    <Loader2 size={24} className="spin" style={{ margin: '0 auto 8px' }} color="#6F3DFF" />
                    <p>Scanning OpenStreetMap nodes & PostGIS records within {searchRadiusKm} km...</p>
                  </div>
                ) : (
                  <>
                    {/* Live Observed OSM Records */}
                    {geoData?.observed_features && geoData.observed_features.length > 0 ? (
                      geoData.observed_features.map((feat, idx) => (
                        <div key={`osm-${idx}`} style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>{feat.name || 'Local Mapped Enterprise'}</span>
                            <span style={{ fontSize: '0.72rem', background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                              {feat.normalized_category || 'Business'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                            <span>Distance: {(feat.distance_km || 1.2).toFixed(1)} km</span>
                            <span style={{ color: '#059669', fontWeight: 600 }}>OSM Empirical</span>
                          </div>
                        </div>
                      ))
                    ) : null}

                    {/* Isolated Synthetic Demonstration Records */}
                    {geoData?.synthetic_competitors && geoData.synthetic_competitors.length > 0 && (
                      geoData.synthetic_competitors.map((syn, sIdx) => (
                        <div key={`syn-${sIdx}`} style={{ background: '#FFFBEB', padding: '10px 14px', borderRadius: 10, border: '1px solid #FDE68A' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#92400E' }}>{syn.name}</span>
                            <span style={{ fontSize: '0.7rem', background: '#FEF3C7', color: '#B45309', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                              Synthetic Test Demo
                            </span>
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#78350F', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                            <span>Distance: {(syn.distance_km || 0.8).toFixed(1)} km</span>
                            <span>Marked Sandbox Seed</span>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Honest Sparse Data Callout */}
                    {(!geoData?.observed_features || geoData.observed_features.length === 0) && (!geoData?.synthetic_competitors || geoData.synthetic_competitors.length === 0) && (
                      <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 10, fontSize: '0.85rem', color: '#64748B', textAlign: 'center' }}>
                        No direct competitors currently mapped on digital OpenStreetMap within {searchRadiusKm} km.
                      </div>
                    )}

                    <div style={{ background: '#EFF6FF', padding: 10, borderRadius: 8, fontSize: '0.74rem', color: '#1E40AF', marginTop: 4 }}>
                      <strong>Data Provenance Notice:</strong> OpenStreetMap reflects documented geographic features. Zero mapped businesses in rural regions does not imply zero informal doorstep sellers.
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="wizard-nav-actions">
              <button onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ArrowLeft size={16} />
                <span>{t('previousStep')}</span>
              </button>
              <button onClick={() => setCurrentStep(3)} className="btn-primary" style={{ padding: '9px 22px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Proceed to Feasibility & Capital Sizing</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Business Advisory & Proposed Capital (Editable with live recalculations) */}
      {currentStep === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Editable Capital Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)', border: '1px solid #BFE9FF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#0369A1' }}>Proposed Project Capital & Margin</h3>
                <p style={{ fontSize: '0.85rem', color: '#0C4A6E' }}>{t('editCapitalHint')}</p>
              </div>
              <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700 }}>
                Live Actuarial Sync
              </span>
            </div>

            <div className="grid-responsive-2" style={{ marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Total Project Cost (₹)
                </label>
                <input 
                  type="number"
                  step="5000"
                  value={proposedCapital}
                  onChange={(e) => setProposedCapital(Math.max(5000, Number(e.target.value)))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '2px solid #6F3DFF', fontSize: '1.2rem', fontWeight: 800, color: '#6F3DFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Your Available Seed Capital (₹)
                </label>
                <input 
                  type="number"
                  step="5000"
                  value={seedCapital}
                  onChange={(e) => setSeedCapital(Math.max(0, Number(e.target.value)))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '2px solid #10B981', fontSize: '1.2rem', fontWeight: 800, color: '#10B981' }}
                />
              </div>
            </div>

            {/* Live Recalculated Metric Strip */}
            {calculatedFinance?.primary && (
              <div className="grid-responsive-4" style={{ background: '#FFFFFF', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Eligible Loan</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#6F3DFF' }}>
                    ₹{calculatedFinance.primary.loan_principal?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Govt Subsidy</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10B981' }}>
                    ₹{calculatedFinance.primary.subsidy_amount?.toLocaleString()} ({calculatedFinance.primary.subsidy_pct}%)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Est. Monthly EMI</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#13151A' }}>
                    ₹{calculatedFinance.primary.monthly_emi?.toLocaleString()}/mo
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Best Matched Scheme</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369A1' }}>
                    {calculatedFinance.primary.scheme_name}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6 Required Advisory Sections */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Preliminary Business Feasibility Advisory</h3>
            
            <div className="grid-responsive-2">
              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#6F3DFF', fontSize: '0.9rem', marginBottom: 4 }}>1. Market Reach</div>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  Catchment within {searchRadiusKm} km supports bi-weekly haat customer traffic and rural eatery supply contracts.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#6F3DFF', fontSize: '0.9rem', marginBottom: 4 }}>2. Underserved Niches</div>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  Opportunity for direct farm-gate organic Desi eggs with 25% price premium over standard commercial produce.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#6F3DFF', fontSize: '0.9rem', marginBottom: 4 }}>3. Budget-Scaled SWOT</div>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong>Strength:</strong> Low shed setup costs. <strong>Threat:</strong> Seasonal feed price volatility from wholesale grain mandis.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#6F3DFF', fontSize: '0.9rem', marginBottom: 4 }}>4. Local Threats</div>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  Monsoon dampness and summer heat mortality. Mandatory 3-phase vaccination schedule required.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#6F3DFF', fontSize: '0.9rem', marginBottom: 4 }}>5. Competitor Density</div>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  Low direct competition mapped on OSM within 5 km. Favorable window for initial market entry.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#6F3DFF', fontSize: '0.9rem', marginBottom: 4 }}>6. Suggested Pricing</div>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  Target wholesale price ₹155/kg, retail price ₹185-₹190/kg. Contribution margin ~36%.
                </p>
              </div>
            </div>

            <div className="wizard-nav-actions">
              <button onClick={() => setCurrentStep(2)} className="btn-secondary" style={{ padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ArrowLeft size={16} />
                <span>{t('previousStep')}</span>
              </button>
              <button onClick={() => setCurrentStep(4)} className="btn-primary" style={{ padding: '9px 22px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Proceed to Cost & Price Details</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Business and Cost Details */}
      {currentStep === 4 && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: 6 }}>Enter Operational Unit Costs</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
            These figures determine your break-even units, monthly net cash flow, and repayment capacity.
          </p>

          <div className="grid-responsive-3">
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Proposed Business Name
              </label>
              <input 
                type="text" 
                value={proposedBusinessName}
                onChange={(e) => setProposedBusinessName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Raw Material Cost / Unit (₹)
              </label>
              <input 
                type="number" 
                value={rawMaterialCost}
                onChange={(e) => setRawMaterialCost(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Selling Price / Unit (₹)
              </label>
              <input 
                type="number" 
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Expected Daily Sales (Units)
              </label>
              <input 
                type="number" 
                value={dailyUnits}
                onChange={(e) => setDailyUnits(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Working Days / Month
              </label>
              <input 
                type="number" 
                value={workingDays}
                onChange={(e) => setWorkingDays(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Monthly Rent (₹)
              </label>
              <input 
                type="number" 
                value={rentMonthly}
                onChange={(e) => setRentMonthly(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Monthly Salaries (₹)
              </label>
              <input 
                type="number" 
                value={salariesMonthly}
                onChange={(e) => setSalariesMonthly(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Monthly Utilities (Electricity/Water) (₹)
              </label>
              <input 
                type="number" 
                value={utilitiesMonthly}
                onChange={(e) => setUtilitiesMonthly(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Monthly Transport & Fuel (₹)
              </label>
              <input 
                type="number" 
                value={transportMonthly}
                onChange={(e) => setTransportMonthly(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div className="wizard-nav-actions">
            <button onClick={() => setCurrentStep(3)} className="btn-secondary" style={{ padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={16} />
              <span>{t('previousStep')}</span>
            </button>
            <button onClick={() => setCurrentStep(5)} className="btn-primary" style={{ padding: '9px 22px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Review & Generate Final Report</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Final Report Generation */}
      {currentStep === 5 && (
        <div className="card">
          <h3 style={{ fontSize: '1.3rem', marginBottom: 6 }}>Review Your Inputs Before Final Analysis</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
            The deterministic financial engine and geospatial models will synthesize your complete bank-ready advisory dossier.
          </p>

          <div className="grid-responsive-2" style={{ marginBottom: 24 }}>
            <div style={{ background: '#F8FAFC', padding: 18, borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#6F3DFF', marginBottom: 12 }}>Venture Profile & Capital</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Business:</span>
                  <strong>{proposedBusinessName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Category:</span>
                  <strong>{selectedCategorySlug}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Anchor Location:</span>
                  <strong>{village}, {district}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Total Capital:</span>
                  <strong style={{ color: '#6F3DFF' }}>₹{proposedCapital.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Your Equity:</span>
                  <strong style={{ color: '#10B981' }}>₹{seedCapital.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: 18, borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#10B981', marginBottom: 12 }}>Economics & Margins</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Selling Price:</span>
                  <strong>₹{sellingPrice}/unit</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Raw Material:</span>
                  <strong>₹{rawMaterialCost}/unit</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Unit Contribution:</span>
                  <strong style={{ color: '#10B981' }}>₹{(sellingPrice - rawMaterialCost).toFixed(0)}/unit</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Estimated Monthly Sales:</span>
                  <strong>{(dailyUnits * workingDays)} units/mo</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Animation */}
          {isGenerating ? (
            <div style={{
              background: '#F0F9FF',
              border: '1px solid #BFE9FF',
              borderRadius: 14,
              padding: 24,
              textAlign: 'center',
              marginBottom: 20
            }}>
              <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0369A1', marginBottom: 6 }}>
                Executing SIH Truth-Grounded Pipeline...
              </div>
              <p style={{ fontSize: '0.82rem', color: '#0C4A6E' }}>
                {pipelineLogs[pipelineStep]}
              </p>
            </div>
          ) : (
            <div className="wizard-nav-actions">
              <button onClick={() => setCurrentStep(4)} className="btn-secondary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ArrowLeft size={16} />
                <span>{t('previousStep')}</span>
              </button>
              <button 
                onClick={handleFinalSubmit} 
                className="btn-primary" 
                style={{ padding: '12px 28px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Sparkles size={16} />
                <span>{t('submitAssessment')}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
