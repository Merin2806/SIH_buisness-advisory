from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# ----------------- Auth Schemas -----------------
class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone_number: str = Field(..., pattern=r"^\+?[0-9]{10,14}$")
    password: str = Field(..., min_length=6)
    confirm_password: str
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    full_name: str
    email: str
    role: str

class UserProfileResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone_number: str
    role: str
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    preferred_language: str = "en"
    created_at: datetime

# ----------------- Business Categories -----------------
class BusinessCategorySchema(BaseModel):
    id: int
    slug: str
    name: str
    description: Optional[str] = None
    icon: str
    typical_min_capital: float
    typical_max_capital: float
    is_active: bool

# ----------------- Financial Engine Schemas -----------------
class FinancialCalculationRequest(BaseModel):
    category_slug: str
    total_project_cost: float = Field(..., gt=0)
    seed_capital: float = Field(..., ge=0)
    scheme_code: Optional[str] = None
    social_category: Optional[str] = "General"  # General, SC, ST, OBC, Woman
    location_type: Optional[str] = "Rural"     # Rural, Urban

class RepaymentScheduleItem(BaseModel):
    month_number: int
    opening_balance: float
    emi_amount: float
    principal_component: float
    interest_component: float
    closing_balance: float
    is_moratorium: bool

class FinancialCalculationResponse(BaseModel):
    total_project_cost: float
    promoter_margin_amount: float
    promoter_margin_pct: float
    subsidy_amount: float
    subsidy_pct: float
    loan_principal: float
    effective_interest_rate: float
    nominal_interest_rate: float
    interest_subvention_pct: float
    tenure_months: int
    moratorium_months: int
    monthly_emi: float
    total_interest_payable: float
    total_repayment: float
    dscr: float
    is_eligible: bool
    scheme_name: str
    scheme_code: str
    department: str
    official_source_url: Optional[str] = None
    ineligibility_reasons: List[str] = []
    repayment_schedule: List[RepaymentScheduleItem] = []
    repayment_summary: Dict[str, Any] = {}

class SchemeComparisonItem(BaseModel):
    scheme_code: str
    scheme_name: str
    department: str
    is_eligible: bool
    ineligibility_reasons: List[str]
    max_project_cost: float
    subsidy_pct: float
    promoter_margin_pct: float
    effective_interest_rate: float
    monthly_emi: float
    total_repayment: float
    official_source_url: Optional[str] = None
    is_verified: bool

# ----------------- Geospatial Schemas -----------------
class GeoAnalyzeRequest(BaseModel):
    latitude: float
    longitude: float
    radius_km: float = Field(default=5.0, gt=0, le=25)
    category_slug: str

class ResolveLocationRequest(BaseModel):
    state: str
    district: str
    city_or_taluka: Optional[str] = None
    village_or_address: Optional[str] = None

class ResolveLocationResponse(BaseModel):
    latitude: float
    longitude: float
    display_name: str
    source: str
    is_exact: bool = True

class ReverseGeocodeRequest(BaseModel):
    latitude: float
    longitude: float

class ReverseGeocodeResponse(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    city_or_taluka: Optional[str] = None
    village: Optional[str] = None
    display_name: str
    latitude: float
    longitude: float

class ObservedFeature(BaseModel):
    osm_id: Optional[str]
    name: Optional[str]
    feature_type: str
    category: str
    normalized_category: Optional[str] = None
    distance_km: float
    latitude: float
    longitude: float
    source_url: Optional[str] = None
    provenance: str = "OBSERVED_OSM"

class SyntheticCompetitor(BaseModel):
    synthetic_id: str
    business_name: str
    business_category: str
    distance_km: float
    latitude: float
    longitude: float
    monthly_sales_range: str
    density_score: float
    is_synthetic: bool = True
    provenance: str = "SYNTHETIC_DEMO"

class GeoAnalysisResponse(BaseModel):
    center: Dict[str, float]
    radius_km: float
    total_observed_features: int
    observed_competitors_count: int
    observed_infrastructure_count: int
    observed_features: List[ObservedFeature]
    synthetic_competitors_count: int
    synthetic_competitors: List[SyntheticCompetitor]
    infrastructure_proxies: Dict[str, int]
    data_completeness_pct: float
    data_provenance: str
    is_sparse: bool
    retrieved_at: datetime

class GeoAdminSummaryResponse(BaseModel):
    total_observed_records: int
    total_synthetic_records: int
    last_retrieval_at: Optional[datetime] = None
    data_source_status: str
    records_by_category: Dict[str, int]
    recent_features: List[Dict[str, Any]]

class UserBankingPreferenceRequest(BaseModel):
    assessment_id: Optional[int] = None
    has_bank_account: bool = True
    selected_banks: List[str] = []
    custom_bank_name: Optional[str] = None
    account_types: List[str] = []
    prefer_existing_bank: bool = True
    has_previous_business_loan: bool = False

class UserBankingPreferenceResponse(BaseModel):
    id: int
    user_id: int
    assessment_id: Optional[int] = None
    has_bank_account: bool
    selected_banks: List[str]
    custom_bank_name: Optional[str] = None
    account_types: List[str]
    prefer_existing_bank: bool
    has_previous_business_loan: bool
    updated_at: datetime

# ----------------- Budgeter Schemas -----------------
class BudgetCalculateRequest(BaseModel):
    raw_material_cost_per_unit: float = Field(..., ge=0)
    selling_price_per_unit: float = Field(..., gt=0)
    daily_units_sold: float = Field(..., ge=0)
    working_days_per_month: int = Field(default=26, ge=1, le=31)
    rent_per_month: float = Field(default=0.0, ge=0)
    salaries_per_month: float = Field(default=0.0, ge=0)
    transport_cost_per_month: float = Field(default=0.0, ge=0)
    utilities_per_month: float = Field(default=0.0, ge=0)
    packaging_cost_per_month: float = Field(default=0.0, ge=0)
    other_fixed_costs_per_month: float = Field(default=0.0, ge=0)

class BudgetCalculateResponse(BaseModel):
    raw_material_cost_per_unit: float
    selling_price_per_unit: float
    contribution_margin: float
    contribution_margin_pct: float
    fixed_monthly_costs: float
    variable_cost_per_unit: float
    break_even_units_per_month: float
    break_even_daily_units: float
    break_even_revenue: float
    expected_monthly_revenue: float
    expected_monthly_variable_costs: float
    expected_monthly_operating_expenses: float
    expected_monthly_operating_profit: float
    daily_sales_target_units: float
    daily_sales_target_revenue: float
    margin_health_zone: str  # Safe, Moderate, Risk
    is_positive_contribution: bool
    sensitivity_scenarios: List[Dict[str, Any]]

class SaveBudgetScenarioRequest(BaseModel):
    scenario_name: str
    assessment_id: Optional[int] = None
    inputs: BudgetCalculateRequest

# ----------------- Assessment Wizard Schemas -----------------
class CreateAssessmentRequest(BaseModel):
    proposed_business_name: str
    category_slug: str
    business_stage: str = "new"  # new or expansion
    seed_capital: float = Field(..., ge=0)
    estimated_project_cost: float = Field(..., gt=0)
    number_of_workers: int = Field(default=1, ge=1)
    target_customers_desc: Optional[str] = None
    village: str
    taluka_or_city: Optional[str] = None
    district: str
    state: str
    address: Optional[str] = None
    latitude: float
    longitude: float
    search_radius_km: float = 5.0
    is_gps_verified: bool = False
    cost_inputs: Optional[BudgetCalculateRequest] = None
    banking_details: Optional[UserBankingPreferenceRequest] = None

# ----------------- Strict 6-Section Advisory Schemas -----------------
class ReportSectionItem(BaseModel):
    label: str
    value: str
    source_type: str  # observed_osm, synthetic_model, deterministic_calc, govt_scheme_verified, ai_guidance
    source_detail: str
    confidence: float = 1.0

class AdvisorySectionDetail(BaseModel):
    summary: str
    findings: List[str]
    evidence_items: List[ReportSectionItem]
    practical_recommendations: List[str]
    limitations: List[str] = []

class SwotMatrix(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]

class StrictAdvisoryReportSchema(BaseModel):
    market_reach: AdvisorySectionDetail
    underserved_niches: AdvisorySectionDetail
    budget_scaled_swot: SwotMatrix
    local_threats: AdvisorySectionDetail
    competitor_density: AdvisorySectionDetail
    suggested_pricing: AdvisorySectionDetail
    overall_assessment: Dict[str, Any]
    sources: List[str]
    data_limitations: List[str]
    ai_model_used: str
    is_fallback: bool = False

# ----------------- Voice & Translation Schemas -----------------
class VoiceTranscribeRequest(BaseModel):
    audio_base64: str
    source_language: str = "hi"  # hi, mr, en

class VoiceTranscribeResponse(BaseModel):
    transcript_text: str
    language: str
    confidence: float
    is_mock: bool = False

class VoiceTranslateRequest(BaseModel):
    text: str
    source_language: str
    target_language: str

class VoiceTranslateResponse(BaseModel):
    translated_text: str
    source_language: str
    target_language: str
    provider: str

class VoiceSynthesizeRequest(BaseModel):
    text: str
    language: str = "hi"  # hi, mr, en

class VoiceSynthesizeResponse(BaseModel):
    audio_base64: Optional[str] = None
    audio_url: Optional[str] = None
    language: str
    provider: str

# ----------------- Admin Schemas -----------------
class AdminOverviewResponse(BaseModel):
    total_users: int
    total_assessments: int
    total_reports_generated: int
    verified_schemes_count: int
    knowledge_documents_count: int
    synthetic_records_count: int
    integrations: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
