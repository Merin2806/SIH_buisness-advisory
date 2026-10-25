# Gram-Advisor AI: Hyper-Local Business Advisory & Financial Structuring

[![Flutter](https://img.shields.io/badge/Flutter-3.47+-02569B?logo=flutter&logoColor=white)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.13+-0175C2?logo=dart&logoColor=white)](https://dart.dev)
[![SIH](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-5F4B8B)](https://sih.gov.in)
[![Palette](https://img.shields.io/badge/Themed-Ultraviolet%20%7C%20Glacier%20Blue-71A6D2)](https://github.com/Merin2806/SIH_buisness-advisory)

An AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant designed for rural micro-entrepreneurs across India. Developed for the **Smart India Hackathon (SIH)**.

---

## 🎨 Color Palette & Design System

The application strictly adheres to the official hackathon design tokens:

| Token Name | Hex Code | Visual Swatch | Role & Application |
| :--- | :--- | :---: | :--- |
| **Ultraviolet** | `#5F4B8B` | 🟣 | **Primary Brand**: CTA Buttons, Active States, Key Metrics, Amortization Headers |
| **Glacier Blue** | `#71A6D2` | 🔵 | **Primary Accent**: Highlights, Soft Overlays, Progress Rims, Geo Badges |
| **Mineral Grey** | `#B5B5B7` | ⚪ | **Backgrounds & Text**: Card Borders, Secondary Info, Scaffolding (`#F6F7FA`) |

---

## 🚀 Key Features

### 1. Home / Onboarding Screen
- **Indic Voice-First Assistant (Bhashini AI)**: Pulsing Ultraviolet microphone button simulating real-time multilingual speech-to-text input (e.g., Hindi, Marathi, Bengali, Tamil, English).
- **Business Category Selector**: Tailored for rural MSMEs (Poultry & Layer Farming, Tailoring & Apparel, Kirana Micro-Retail, Dairy & Livestock).
- **Planned Seed Capital**: Numeric input with quick presets (₹25k, ₹50k, ₹1 Lakh, ₹2 Lakh) and automated Mudra Tier detection (Shishu vs. Kishore).
- **GPS Anchor Telemetry**: Real-time GPS coordinate pinging (Baramati Rural: `18.1512° N, 74.5771° E`) locking a 5.0 km OpenStreetMap (OSM) search radius.

### 2. Geo-RAG Simulation Loading Pipeline
- **Glacier Blue & Ultraviolet Overlay**: High-tech streaming console terminal displaying live telemetry steps:
  - OpenStreetMap (OSM) infrastructure extraction (clinics, veterinary hubs, feeder roads, weekly haats).
  - Synthetic competitor density generation via spatial Poisson point modeling.
  - Querying Llama 3 8B via FastAPI with hyper-local agricultural context chunks.
  - Multi-tier Mudra and NABARD PVCF rule reconciliation.

### 3. Financial Structuring Tab (Deterministic Calculator)
- **Zero AI Guesswork**: Strict actuarial math adhering to the RBI Master Circular on Micro-Credit & Pradhan Mantri Mudra Yojana (PMMY) guidelines.
- **Recommended Scheme Banner**: PMMY Shishu / Kishore Tier linked with NABARD Poultry Venture Capital Fund (PVCF) capital subsidy.
- **Interactive Donut Chart**: Dynamic visualization of **Capital vs. Margin** reconciling:
  - Net Bank Loan (75% - ₹37,500)
  - NABARD Capital Subsidy (15% - ₹7,500)
  - Promoter Margin Equity (10% - ₹5,000)
- **Deterministic Math Matrix**:
  - Subsidized Interest Rate: **7.25% p.a.** (9.25% nominal with 2.0% Govt Interest Subvention).
  - Tenure: **36 Months** (3 years).
  - Moratorium Period: **6 Months** grace period covering initial flock setup and vaccine schedule.
  - Monthly Post-Grace EMI: **₹1,438/month**.
  - Debt Service Coverage Ratio (DSCR): **1.88x (Healthy)**.
  - CGTMSE Collateral-Free Guarantee & Sanction Checklist.

### 4. Advisory & Feasibility Tab (The 6-Part Report)
1. **Market Reach & Footfall**: Hyper-local transport links, bi-weekly Haats, arterial roads.
2. **Underserved Niches**: Indigenous Kadaknath/Aseel free-range premium eggs, agri-compost monetization for grape vineyards.
3. **SWOT Analysis Matrix**: Veterinary clinical density, feeder power stability, cashflow ramp-up, highway dhaba contracts.
4. **Local Threats & Mitigation**: Heat stress risk, summer misting protocols, feed inflation trends.
5. **Competitor Density Analysis**: Spatial saturation index (26/100 - High Expansion Viability), distance to nearest commercial coops.
6. **Suggested Unit Pricing & Margins**: APMC Mandi wholesale rates vs. recommended farm-gate prices (₹155/kg) and retail margins (31.4%).

### 5. Critical Feature: "Truth Flagging"
Every single metric and claim displays a distinct transparency badge:
- 🟢 **Hard Data (OSM)**: Empirical facts extracted directly from OpenStreetMap node/way queries or official APMC Mandi bulletins.
- 🟡 **AI Projection**: Probabilistic estimations modeled by Llama 3 8B with confidence intervals.
- **Filter Switcher**: Filter insights dynamically by "All Insights", "Hard Data Only", or "AI Projections".

### 6. Interactive Dynamic Unit Economics Budgeter
- Real-time interactive slider for local feed & chick input cost (₹60 to ₹135/bird).
- Real-time slider for farm-gate selling price (₹120 to ₹220/bird).
- Dynamic calculation of **Daily Break-Even Sales Target** (e.g. `3.4 Birds/Day` or `~48 Desi Eggs/Day`) updated instantaneously with live margin health gauges (Safe Zone, Moderate, Risk).

---

## 🏗️ Project Architecture

```
lib/
├── data/
│   └── mock_advisory_repository.dart  # Deterministic formulas & mock poultry Geo-RAG data
├── models/
│   └── advisory_models.dart           # Truth flagging, schemes, categories & structuring models
├── providers/
│   └── advisory_provider.dart         # State management (Provider) for inputs, Geo-RAG & budgeter
├── screens/
│   ├── dashboard_screen.dart          # Tabbed container: Financial Structuring & 6-Part Report
│   ├── home_screen.dart               # Welcoming onboarding, Bhashini mic, inputs & GPS ping
│   └── loading_screen.dart            # Technical Geo-RAG simulation terminal with circular progress
├── theme/
│   └── app_colors.dart                # Glacier Blue, Ultraviolet, Mineral Grey tokens & shadows
├── widgets/
│   ├── app_icon.dart                  # Polymorphic icon renderer (FaIcon & Material IconData)
│   ├── bhashini_mic_button.dart       # Pulsing animated Indic voice recognition modal
│   ├── deterministic_chart.dart       # Reconciled Capital vs Margin Custom Donut Chart
│   ├── dynamic_unit_economics.dart    # Real-time break-even budgeter with cost sliders
│   └── truth_flag_badge.dart          # Green (OSM) & Yellow (AI) truth verification badges
└── main.dart                          # App bootstrap, responsive container & Inter typography
```

---

## 🏃 Running the Application

### Prerequisites
- Flutter SDK (v3.24.0 or newer)
- Dart SDK (v3.5.0 or newer)

### Run Locally:
```bash
# Clone the repository
git clone https://github.com/Merin2806/SIH_buisness-advisory.git
cd SIH_buisness-advisory

# Install dependencies
flutter pub get

# Run on Chrome (Web)
flutter run -d chrome

# Or run on Windows Desktop
flutter run -d windows

# Or run on Android emulator / physical device
flutter run -d android
```

### Run Tests:
```bash
flutter test
```
