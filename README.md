# RuralBiz AI — Intelligent Rural Business Advisory & Financial Planning

[![Smart India Hackathon](https://img.shields.io/badge/SIH-2026%20Problem%2026091-6F3DFF?style=for-the-badge)](https://sih.gov.in)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React%20%2B%20Vite-6.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev)
[![Palette](https://img.shields.io/badge/Glacier%20Blue%20%7C%20Ultraviolet%20%7C%20Mineral%20Grey-BFE9FF-6F3DFF)](https://github.com/Merin2806/SIH_buisness-advisory)

An end-to-end full-stack platform empowering rural micro-entrepreneurs across India to assess hyper-local market opportunities, verify government financing eligibility (PMMY Mudra, NABARD PVCF, PMEGP), compute unit-economics break-even targets, and make sound investment decisions **before taking on debt**.

---

## 🎨 Official Color Palette & Design System

The application strictly implements the required hackathon design tokens:

| Token Name | Hex Code | Visual Swatch | Role & Application |
| :--- | :--- | :---: | :--- |
| **Glacier Blue** | `#BFE9FF` | 🔵 | Main highlights, info cards, map accents, selected navigation, soft backdrops |
| **Ultraviolet** | `#6F3DFF` | 🟣 | Primary CTA buttons, active navigation, key metrics, chart focus, brand anchors |
| **Mineral Grey** | `#B7B7B7` | ⚪ | Structural card borders, secondary text, neutral surfaces, disabled controls |

---

## 🚀 Key System Features & Seven Phases

### Phase 1 — Application Foundation & Normalized Database Schema
- **FastAPI Modular Backend** (`backend/app/`): Strict Pydantic request/response validation, asynchronous endpoints, JWT authentication.
- **Relational Data Architecture**: Normalized tables for `users`, `user_profiles`, `business_categories`, `business_assessments`, `financial_scheme_rules`, `repayment_schedules`, `geographic_features` (observed OSM), `synthetic_business_records`, `advisory_reports`, and `audit_logs`.
- **Database Engine**: Dual-support architecture targeting PostgreSQL with PostGIS & pgvector, with instant zero-config SQLite development mode.
- **Idempotent Administrator Bootstrap**: Automated provisioning of administrator account (`riyamokale@gmail.com`).

### Phase 2 — Deterministic Financial Structuring Engine
- **Zero AI Hallucination in Math**: Standalone Python module (`backend/app/financial_engine/`) implementing official Reserve Bank of India and Ministry of MSME guidelines.
- **Standard Amortization Formula**:
  $$EMI = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$
- **Verified Scheme Catalogue**:
  - **Pradhan Mantri Mudra Yojana (PMMY)**: Shishu Tier (₹0 to ₹50,000) & Kishore Tier (₹50,000 to ₹5,00,000).
  - **NABARD Poultry Venture Capital Fund (PVCF)**: 15%–25% back-ended capital subsidy with 6-month flock rearing moratorium.
  - **PMEGP Rural Scheme**: Margin money capital subsidies (up to 35% for rural women and priority categories).
- **Repayment Schedules**: Full 36-to-60 month schedule with moratorium grace handling and Debt Service Coverage Ratio (DSCR: 1.88x) verification.

### Phase 3 — Local Business Advisory & Geospatial Analysis
- **OpenStreetMap (Overpass API)**: Dynamic 5 km radius querying for roads, weekly haats, bus stands, retail shops, and veterinary clinics.
- **Strict Data Isolation**: Separate synthetic competitor generator using Python `faker` and Poisson spatial modeling. Synthetic points are explicitly labeled and **never mixed into verified OSM counts**.

### Phase 4 — Geo-RAG & Evidence-Grounded AI Advisory
- **Document Ingestion**: Verified SOPs (NABARD layer handbook, KVIC rural apparel guide, micro-retail turnaround) chunked and retrieved via semantic search.
- **Strict 6-Section Feasibility Report**:
  1. Market Reach & Footfall
  2. Underserved Niches
  3. Budget-Scaled SWOT Matrix
  4. Local Threats & Mitigation
  5. Competitor Density Analysis
  6. Suggested Pricing & Margin Target
- **Truth Flagging**: Explicit badges for `🟢 Hard OSM Data`, `🏛️ Govt Verified Scheme`, and `🟡 AI / Synthetic Estimate`.

### Phase 5 — Interactive Unit-Economics Budgeter
- **Dynamic Real-Time Calculation**:
  - Contribution Margin = $\text{Selling Price} - \text{Raw Material Cost}$
  - Break-Even Units = $\text{Fixed Monthly Costs} / \text{Contribution Margin}$
  - Expected Operating Profit = $\text{Revenue} - \text{Fixed Overhead} - \text{Variable Costs}$
- **Instant Sliders**: Interactive margin health gauge (Safe Zone, Moderate, Risk) and sensitivity stress-testing.

### Phase 6 — Voice & Multilingual Support
- **Bhashini Indic AI Integration**: Speech-to-text (ASR), translation, and Text-to-Speech (TTS) for Hindi, Marathi, and English.
- **Web Speech API Fallback**: Instant client-side speech narration of the 6-part feasibility report for low-literacy rural entrepreneurs.

### Phase 7 — User & Administrator Dashboards
- **User Dashboard**: Track assessments, view monthly EMI liabilities, and re-read feasibility reports.
- **Admin Dashboard**: Overview platform metrics, verified schemes CRUD editor, knowledge base ingestion, and audit trail.

---

## 🏗️ Project Architecture

```
SIH_buisness-advisory/
├── backend/
│   ├── app/
│   │   ├── api/v1/             # Auth, finance, geo, budget, assessments, voice, admin
│   │   ├── core/               # Settings, security, database session
│   │   ├── models/             # SQLAlchemy normalized relational entities
│   │   ├── schemas/            # Pydantic validation schemas
│   │   ├── financial_engine/   # Deterministic loan, EMI, and scheme rules
│   │   ├── geospatial/         # Overpass client, spatial cache & Poisson simulator
│   │   ├── rag/                # Business guides chunking and semantic search
│   │   ├── advisory/           # Strict 6-section report generator (Groq/fallback)
│   │   ├── budgeter/           # Unit-economics formulas & break-even logic
│   │   ├── voice/              # Bhashini service & Indic language dictionaries
│   │   ├── initial_data.py     # Idempotent admin bootstrap & seed data
│   │   └── main.py             # FastAPI entry point
│   ├── tests/                  # Pytest automated test suite (17 passing tests)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Landing, Dashboard, Wizard, ReportViewer, Budgeter, Admin, Voice
│   │   ├── api.js              # REST API client
│   │   ├── index.css           # Glacier Blue, Ultraviolet & Mineral Grey design tokens
│   │   ├── App.jsx             # Main router and modal controller
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml          # PostgreSQL + PostGIS/pgvector, backend, frontend
├── .env.example                # Documented configuration template
├── IMPLEMENTATION_PLAN.md      # Detailed 7-phase architecture plan
└── README.md                   # This file
```

---

## ⚡ Quick Start Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- (Optional) Docker & Docker Compose

---

### Step 1: Start the Backend (FastAPI)

1. Open a terminal in the project root:
   ```bash
   # Navigate to backend and install dependencies (if not already installed)
   pip3 install -r backend/requirements.txt
   ```

2. Seed initial demonstration data & bootstrap administrator:
   ```bash
   PYTHONPATH=backend python3 -m app.initial_data
   ```

3. Launch the FastAPI server:
   ```bash
   PYTHONPATH=backend uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   * REST API: `http://127.0.0.1:8000`
   * Interactive Swagger Docs: `http://127.0.0.1:8000/api/v1/docs`

---

### Step 2: Start the Web Frontend (React + Vite)

1. Open a second terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at:
   **`http://localhost:5173`**

---

### Step 3: Or Run Entire Stack via Docker Compose

```bash
docker compose up --build
```
* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:8000`
* PostgreSQL: `localhost:5432`

---

## 🔑 Configured Administrator & Test Credentials

The backend automatically provisions the administrator on initial startup:

| Role | Name | Email | Password | Phone |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Riya | `riyamokale@gmail.com` | `AdminRuralBiz@2026` | `9326577285` |
| **Rural Entrepreneur** | Ramesh Patil | `ramesh.patil@ruralbiz.org` | `RuralPass@2026` | `9822334455` |

*(Quick 1-click Auto-Fill buttons are built directly into the Login modal for seamless live evaluation).*

---

## 🔑 Demonstration Accounts

The database seed process (`PYTHONPATH=backend python3 -m app.initial_data`) idempotently provisions both demo accounts:

| Account Type | Email | Password | Role | Features |
| :--- | :--- | :--- | :--- | :--- |
| **🌾 Rural Entrepreneur** | `ramesh.patil@ruralbiz.org` | `RuralPass@2026` | `user` | Pre-seeded with Baramati Layer Poultry assessment, live OSM competitor map, 6-section feasibility dossier, and active loan advisor |
| **👑 Platform Administrator** | `riyamokale@gmail.com` | `AdminRuralBiz@2026` | `admin` | Real DB telemetry overview, scheme verification management, user accounts table, category administration, and audit logs |

---

## 🧪 Running Automated Tests

Run the comprehensive pytest suite verifying auth, financial calculations, geospatial isolation, and advisory schemas:

```bash
PYTHONPATH=backend pytest backend/tests -v
```

Output:
```
backend/tests/test_api_endpoints.py .....        [ 23%]
backend/tests/test_auth_and_advisory.py ......   [ 52%]
backend/tests/test_budgeter.py ..                [ 61%]
backend/tests/test_financial_engine.py ......    [ 90%]
backend/tests/test_geospatial.py ..              [100%]
=================== 21 passed in 1.93s ===================
```

---

## 📡 External Credentials & Integration Settings

The application operates out-of-the-box in **Zero-Hallucination Deterministic Mode** even without third-party API keys:

1. **Groq Llama 3.3 70B**:
   - Provider: Groq Cloud
   - Portal: [https://console.groq.com/keys](https://console.groq.com/keys)
   - Env variable: `GROQ_API_KEY`
2. **Bhashini Indic AI (Dhruva)**:
   - Provider: Ministry of Electronics & IT (MeitY)
   - Portal: [https://bhashini.gov.in/ulca/user/login](https://bhashini.gov.in/ulca/user/login)
   - Env variables: `BHASHINI_API_KEY`, `BHASHINI_USER_ID`, `BHASHINI_BASE_URL`
   - Fallback: High-accuracy Web Speech API & local translation dictionaries in Marathi, Hindi, and English.
3. **OpenStreetMap Overpass API**:
   - Pre-configured to official endpoint: `https://overpass-api.de/api/interpreter`
   - Env variable: `OVERPASS_URL`

---

## 🏆 Hackathon Demonstration Journey

1. **Public Home Page** (`http://localhost:5173`):
   - Review problem statement, core module cards, feature highlights, and how it works.
   - Click "Login" or "Register".
2. **One-Click Demo Access**:
   - Click **🌾 Ramesh Patil (1-Click)** to immediately access the User Dashboard.
   - Click **👑 Admin (1-Click)** to immediately access the Admin Dashboard.
3. **5-Step Business Assessment**:
   - **Step 1 (Location)**: Set village to Baramati Rural (Pune), adjust radius to 5 km.
   - **Step 2 (Category & Live Mapped Businesses)**: Select *Poultry & Layer Farming*; immediately view mapped OSM competitors, nearby haats, bus stands, and infrastructure on the interactive map.
   - **Step 3 (Feasibility & Capital Sizing)**: Review preliminary feasibility verdict, 6 advisory sections, and adjust proposed capital to see live recalculations.
   - **Step 4 (Unit Costs)**: Enter raw material cost (₹115), selling price (₹185), daily units (30), and monthly fixed expenses.
   - **Step 5 (Final Generation)**: Review inputs, stream pipeline telemetry, and generate the final report.
4. **Dedicated Loan Advisor (Sections A through G)**:
   - **Section A**: Loan Sizing & Affordability (Total cost, equity, bank loan, subsidy, and affordability verdict ratio).
   - **Section B**: Audited Government Schemes (PMMY Mudra, NABARD PVCF, PMEGP, Stand-Up India) with verification status (`Verified`, `Pending Verification`, `Demonstration Data`).
   - **Section C**: Participating Banks (SBI, Bank of Maharashtra, Bank of Baroda) with official portals and nearest branch finders.
   - **Section D & E**: Step-by-Step Application Guide and Required Documents Checklist.
   - **Section F**: Subsidized EMI Breakdown & 24-Month Amortization Schedule.
   - **Section G**: Financial Risk Guidance.
5. **Interactive Unit Economics Budgeter**:
   - Adjust selling price and raw material sliders to observe instant recalculation of contribution margins, break-even units, and daily targets.
6. **Voice Assistant & Localization**:
   - Click the microphone button to ask questions in Marathi, Hindi, or English.
   - Switch language via the top navbar dropdown to view the entire application in **मराठी (Marathi)** or **हिन्दी (Hindi)**.
7. **Admin Console (Administrator Riya)**:
   - **Overview**: Real database counters, system service statuses, and audit activity.
   - **Yojana Management**: Filter by verification status, verify pending schemes, and edit parameters.
   - **Admin Panel**: Manage registered user accounts, business categories, RAG reference guides, and isolated synthetic datasets.
   - **Geographic Data**: Audit empirical OpenStreetMap features stored in `geographic_features` vs isolated synthetic demonstration data.
   - **Integration Status**: Review real-time status of spatial engines, Overpass API, Bhashini AI, and deterministic rules engine.

---

## 🗄️ Database Access, Architecture & Inspection Guide

### 1. Database Identification & Engine

RuralBiz AI utilizes a flexible dual-engine architecture:
- **Local Development Default**: **SQLite 3** (`ruralbiz.db` located at the project root).
- **Production / Docker Stack**: **PostgreSQL 16 with PostGIS 3.4 & pgvector** (configured via `docker-compose.yml`).

#### Connection Configuration

| Parameter | SQLite (Local Dev) | PostgreSQL (Docker Compose) |
| :--- | :--- | :--- |
| **Engine** | SQLite 3 | PostgreSQL 16 (PostGIS 3.4) |
| **Location** | Local file: `./ruralbiz.db` | Local container or remote cloud instance |
| **Host** | N/A (Embedded) | `localhost` (Host) or `db` (Container network) |
| **Port** | N/A | `5432` |
| **Database Name** | `ruralbiz.db` | `ruralbiz_db` |
| **Default User** | Current OS User | `ruralbiz` |
| **Connection String** | `sqlite:///./ruralbiz.db` | `postgresql://ruralbiz:<YOUR_PASSWORD>@localhost:5432/ruralbiz_db` |

> [!NOTE]
> To find your active connection string in the local environment, inspect the `.env` file at the project root (`DATABASE_URL`). If not set, the application defaults to `sqlite:///./ruralbiz.db`.

---

### 2. Database Models & Schema

The database schema is defined in [backend/app/models/entities.py](file:///Users/riyamokale/Documents/Riya/SIH%20-%202026/SIH_buisness-advisory/backend/app/models/entities.py) and includes:

1. **`users`** & **`user_profiles`**: User authentication (bcrypt hashed passwords, JWT sessions) and enterprise profiles.
2. **`user_banking_preferences`**: Stores user banking relationships (`has_bank_account`, `selected_banks`, `custom_bank_name`, `account_types`, `prefer_existing_bank`, `has_previous_business_loan`). **Zero sensitive credentials stored.**
3. **`geographic_features`**: **Real OpenStreetMap features** persisted from Overpass queries (`name`, `category`, `normalized_category`, `source`, `osm_type`, `osm_id`, `latitude`, `longitude`, `provenance='OBSERVED_OSM'`, `last_updated_at`).
4. **`synthetic_business_records`**: **Synthetic Poisson demonstration records** clearly labeled (`provenance='SYNTHETIC_DEMO'`) and strictly isolated from real geographic records.
5. **`financial_scheme_rules`**: Audited government schemes (PMMY Mudra, NABARD, PMEGP, Stand-Up India) with statutory limits, subsidies, and verification status.
6. **`business_assessments`**: Enterprise assessments, location coordinates, radius, and input costs.
7. **`assessment_locations`**: Geo-anchors with `state`, `district`, `taluka_or_city`, `village`, and coordinates.
8. **`audit_logs`**: Tamper-evident admin logs for scheme parameter modifications.

---

### 3. Migration & Seeding System

- **Automatic Schema Initialization**: Tables are created idempotently via `Base.metadata.create_all(bind=engine)`.
- **Lightweight Schema Evolution**: [backend/app/initial_data.py](file:///Users/riyamokale/Documents/Riya/SIH%20-%202026/SIH_buisness-advisory/backend/app/initial_data.py) implements `ensure_schema_columns(engine)` which adds missing columns dynamically without data loss.
- **Seed Command**:
  ```bash
  PYTHONPATH=backend python3 -m app.initial_data
  ```
  This command idempotently populates:
  - Administrator account (`riyamokale@gmail.com`).
  - Standard rural business categories (poultry, dairy, kirana, tailoring, etc.).
  - Verified government schemes (Mudra Shishu/Kishore/Tarun, NABARD PVCF, PMEGP).
  - 8 empirical OpenStreetMap features in Baramati Rural (`provenance='OBSERVED_OSM'`).
  - 4 isolated synthetic demonstration records (`provenance='SYNTHETIC_DEMO'`).
  - Seed banking preferences.

---

### 4. How to Inspect the Database

#### Option A: Command Line Inspection (SQLite)

```bash
# Open SQLite terminal in project directory
sqlite3 ruralbiz.db

# Enable columnar formatting
.headers on
.mode column

# List all tables
.tables
```

#### Option B: Graphical Database Clients (DBeaver / TablePlus / VS Code)

1. **DBeaver**:
   - New Connection -> Select **SQLite** (or **PostgreSQL** if running Docker).
   - For SQLite: Browse to `/Users/riyamokale/Documents/Riya/SIH - 2026/SIH_buisness-advisory/ruralbiz.db`.
   - Test Connection and click Finish.
2. **VS Code Database Extensions**:
   - Install **SQLite Viewer** (by Florian Klampfer) or **SQLTools**.
   - Simply click on `ruralbiz.db` in the VS Code file explorer to inspect tables visually.
3. **psql Command Line (if using PostgreSQL/Docker)**:
   ```bash
   # Connect to Docker PostgreSQL instance
   psql -h localhost -p 5432 -U ruralbiz -d ruralbiz_db
   ```

---

### 5. Verified Database Inspection Queries

Use these queries in `sqlite3`, `psql`, or DBeaver to audit the database:

#### A. Count Geographic Features
```sql
SELECT COUNT(*) AS total_geographic_features FROM geographic_features;
```

#### B. Count Records by Provenance (Distinguish Observed vs Synthetic)
```sql
-- Real OpenStreetMap Observed Records:
SELECT provenance, COUNT(*) AS feature_count 
FROM geographic_features 
GROUP BY provenance;

-- Isolated Synthetic Demonstration Records:
SELECT provenance, COUNT(*) AS synthetic_count 
FROM synthetic_business_records 
GROUP BY provenance;
```

#### C. List Recently Imported Geographic Features
```sql
SELECT id, name, normalized_category, source, provenance, latitude, longitude, last_updated_at 
FROM geographic_features 
ORDER BY last_updated_at DESC 
LIMIT 20;
```

#### D. Verify Businesses within a 5 km Radius of Coordinates (e.g., Baramati Rural 18.1512, 74.5771)
```sql
-- Approximate bounding box query for 5 km radius (~0.045 degrees lat/lon)
SELECT id, name, normalized_category, latitude, longitude, provenance
FROM geographic_features
WHERE latitude BETWEEN (18.1512 - 0.045) AND (18.1512 + 0.045)
  AND longitude BETWEEN (74.5771 - 0.045) AND (74.5771 + 0.045);
```

#### E. Inspect Government Scheme Verification Statuses
```sql
SELECT scheme_code, scheme_name, verification_status, max_project_cost, subsidy_percentage, nominal_interest_rate, official_source_url 
FROM financial_scheme_rules 
ORDER BY scheme_name;
```

#### F. Inspect User Banking Preferences
```sql
SELECT id, user_id, has_bank_account, selected_banks, account_types, prefer_existing_bank, has_previous_business_loan, updated_at 
FROM user_banking_preferences 
ORDER BY updated_at DESC;
```
