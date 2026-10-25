# Implementation Plan: RuralBiz AI (SIH 26091)

## System Overview
**RuralBiz AI** is an intelligent rural business advisory and financial planning platform designed for micro-entrepreneurs. It provides evidence-grounded advisory, deterministic financial calculations for verified government schemes (PMMY Mudra, NABARD, PMEGP), real geospatial competitor & infrastructure analysis (OpenStreetMap & PostGIS), synthetic market generation, an interactive unit economics budgeter, multilingual speech support (Bhashini API), and an administrator control plane.

## Repository Assessment & Legacy Status
- **Current State**: The repository previously contained only a Flutter UI prototype (`lib/`) with hardcoded mock repository data (`mock_advisory_repository.dart`) and mock screens. No backend, database, authentication, or real API integrations existed.
- **Action**: 
  - Backed up reusable calculation logic and scheme parameters to `backup_legacy/`.
  - Rebuilding the application from the ground up with a robust **FastAPI backend** and a modern, responsive **React + Vite web frontend** using the exact SIH palette (`#BFE9FF`, `#6F3DFF`, `#B7B7B7`), interactive maps (Leaflet/OSM), financial projection charts, and speech synthesis.
  - Updating Flutter app assets/config to connect cleanly to the unified REST API.


---

## 7-Phase Execution Plan

### Phase 1: Application Foundation & Normalized Database Schema
- **FastAPI Backend**: Structured modular application (`backend/app`).
- **Database**: PostgreSQL with PostGIS & pgvector support, with dual-engine fallback (SQLite / Spatial distance formulas) for local environments without running Docker.
- **Normalized Models**:
  - `users`, `user_profiles`, `roles`
  - `business_categories`, `business_assessments`, `assessment_locations`, `business_cost_inputs`
  - `financial_scheme_rules`, `scheme_rule_versions`, `scheme_sources`
  - `financial_calculations`, `repayment_schedules`
  - `geographic_features`, `synthetic_business_records`, `data_source_metadata`
  - `business_guide_documents`, `document_chunks`
  - `advisory_reports`, `report_evidence`
  - `saved_budget_scenarios`, `integration_status`, `audit_logs`
- **Security & RBAC**: JWT tokens, bcrypt password hashing, user & administrator roles.
- **Admin Bootstrap**: Idempotent provisioning of initial administrator (Riya, `riyamokale@gmail.com`, `9326577285`).

### Phase 2: Deterministic Financial Structuring Engine
- **No LLM in Financial Math**: Standalone Python module (`financial_engine/`).
- **Standard Amortization Formula**:
  $$EMI = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$
- **Moratorium Handling**: Grace period with and without interest accrual.
- **Verified Scheme Catalogue**:
  - PMMY Mudra (Shishu up to ₹50,000; Kishore ₹50,000–₹5,00,000; Tarun ₹5,00,000–₹10,00,000)
  - NABARD PVCF (Poultry Venture Capital Fund) capital subsidy (15%-25%)
  - PMEGP (Prime Minister's Employment Generation Programme) margin money subsidy (15%-35%)
  - Stand-Up India (for SC/ST and women entrepreneurs)
- **Eligibility Checking**: Rejection of unverified rules, cost ceiling violations, applicant margin constraints.

### Phase 3: Local Business Advisory & Geospatial Analysis
- **Geographic Data Extraction**: OpenStreetMap Overpass API queries for roads, markets, bus stops, retail shops, vet clinics, competitors within user-selected radius (default 5 km).
- **PostGIS / Spatial Engine**: Competitor counting, infrastructure proxy metrics, caching layer, timeout and rate-limit safeguards.
- **Synthetic Data Generation**: Poisson point process and Faker-based synthetic enterprise generation with explicit labeling (`[SYNTHETIC]`), never mixed with verified OSM counts.

### Phase 4: Geo-RAG & Evidence-Grounded AI Advisory
- **Document Ingestion**: Business guides (e.g., Kadaknath Poultry Guide, Micro-Retail SOP), chunking, metadata tracking, and vector indexing.
- **Structured LLM Pipeline**: Groq / Together AI (Llama 3 8B) integration with strict Pydantic output schema and deterministic fallback when API keys are absent.
- **Strict 6-Section Feasibility Report**:
  1. Market Reach
  2. Underserved Niches
  3. Budget-Scaled SWOT
  4. Local Threats
  5. Competitor Density
  6. Suggested Pricing
- **Evidence & Truth-Flagging**: Distinguishing Observed Data (OSM), Synthetic Estimates, Financial Engine outputs, and General Guidance.

### Phase 5: Interactive Unit-Economics Budgeter
- **Interactive Metrics**:
  - Contribution Margin = Selling Price - Variable Cost
  - Break-Even Units = Fixed Monthly Costs / Contribution Margin
  - Expected Monthly Revenue = Price × Daily Units × Working Days
  - Expected Operating Profit = Revenue - Fixed Costs - Variable Costs
- **Interactive Sliders & Numeric Inputs**: Instant recalculation, sensitivity analysis, zero/negative contribution warnings, scenario saving.

### Phase 6: Voice & Multilingual Support
- **Bhashini Integration**: Dedicated backend service for Speech-to-Text (ASR), translation, and Text-to-Speech (TTS) for Hindi, Marathi, and English.
- **Browser Web Speech API Fallback**: Ensures instant voice recording and text-to-speech feedback even when external Bhashini credentials are not yet configured.

### Phase 7: Complete Integration, Frontend, Admin Dashboard & Testing
- **New Frontend**: Complete React + Vite web application:
  - Landing Page with problem statement, module highlights, interactive demo.
  - Split-screen Login & Registration with role awareness.
  - User Dashboard with recent assessments, quick financial stats, and saved reports.
  - 5-step Assessment Wizard (Location with GPS/Map/Radius, Category, Capital & Details, Local Costs, Review & Generate).
  - Feasibility Report Viewer with 6 sections, truth flags, audio narration controls.
  - Interactive Unit-Economics Budgeter page.
  - Admin Dashboard (Overview stats, Verified Schemes CRUD, RAG Document Ingestion, Synthetic Data Inspector, Integration Status Monitor, Audit Logs).
- **Automated Tests**: Comprehensive pytest test suite covering auth, financial engine, geospatial analysis, budgeter, advisory schemas.
- **Docker Compose & README**: Complete containerization and setup guide.
