import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, Enum as SQLEnum, JSON, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"

class TruthSourceType(str, enum.Enum):
    OBSERVED_OSM = "observed_osm"
    SYNTHETIC_MODEL = "synthetic_model"
    DETERMINISTIC_CALC = "deterministic_calc"
    GOVT_SCHEME_VERIFIED = "govt_scheme_verified"
    AI_GUIDANCE = "ai_guidance"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(30), nullable=False, index=True)
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    assessments = relationship("BusinessAssessment", back_populates="user", cascade="all, delete-orphan")
    banking_preferences = relationship("UserBankingPreference", back_populates="user", cascade="all, delete-orphan")
    saved_scenarios = relationship("SavedBudgetScenario", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    village = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    state = Column(String(255), nullable=True)
    preferred_language = Column(String(50), default="en", nullable=False)
    experience_years = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="profile")

class BusinessCategory(Base):
    __tablename__ = "business_categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), default="store")
    typical_min_capital = Column(Float, default=25000.0)
    typical_max_capital = Column(Float, default=500000.0)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    assessments = relationship("BusinessAssessment", back_populates="category")

class BusinessAssessment(Base):
    __tablename__ = "business_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("business_categories.id"), nullable=False)
    proposed_business_name = Column(String(255), nullable=False)
    business_stage = Column(String(50), default="new")  # "new" or "expansion"
    seed_capital = Column(Float, nullable=False)
    estimated_project_cost = Column(Float, nullable=False)
    number_of_workers = Column(Integer, default=1)
    target_customers_desc = Column(Text, nullable=True)
    status = Column(String(50), default="completed", index=True)  # pending, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="assessments")
    category = relationship("BusinessCategory", back_populates="assessments")
    location = relationship("AssessmentLocation", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
    cost_input = relationship("BusinessCostInput", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
    financial_calculation = relationship("FinancialCalculation", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
    advisory_report = relationship("AdvisoryReport", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
    banking_preference = relationship("UserBankingPreference", back_populates="assessment", uselist=False, cascade="all, delete-orphan")

class AssessmentLocation(Base):
    __tablename__ = "assessment_locations"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("business_assessments.id", ondelete="CASCADE"), unique=True, nullable=False)
    village = Column(String(255), nullable=False)
    taluka_or_city = Column(String(255), nullable=True)
    district = Column(String(255), nullable=False)
    state = Column(String(255), nullable=False)
    address = Column(String(500), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    search_radius_km = Column(Float, default=5.0, nullable=False)
    is_gps_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    assessment = relationship("BusinessAssessment", back_populates="location")

class BusinessCostInput(Base):
    __tablename__ = "business_cost_inputs"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("business_assessments.id", ondelete="CASCADE"), unique=True, nullable=False)
    raw_material_cost_per_unit = Column(Float, default=0.0)
    selling_price_per_unit = Column(Float, default=0.0)
    daily_units_sold = Column(Float, default=0.0)
    transport_cost_per_month = Column(Float, default=0.0)
    rent_per_month = Column(Float, default=0.0)
    salaries_per_month = Column(Float, default=0.0)
    utilities_per_month = Column(Float, default=0.0)
    packaging_cost_per_month = Column(Float, default=0.0)
    other_fixed_costs_per_month = Column(Float, default=0.0)
    working_days_per_month = Column(Integer, default=26)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    assessment = relationship("BusinessAssessment", back_populates="cost_input")

class FinancialSchemeRule(Base):
    __tablename__ = "financial_scheme_rules"

    id = Column(Integer, primary_key=True, index=True)
    scheme_code = Column(String(100), unique=True, index=True, nullable=False)
    scheme_name = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    min_project_cost = Column(Float, default=0.0)
    max_project_cost = Column(Float, default=1000000.0)
    min_promoter_margin_pct = Column(Float, default=10.0)
    subsidy_percentage = Column(Float, default=0.0)
    max_subsidy_amount = Column(Float, default=0.0)
    nominal_interest_rate = Column(Float, default=9.5)
    interest_subvention_pct = Column(Float, default=0.0)
    tenure_months = Column(Integer, default=36)
    moratorium_months = Column(Integer, default=6)
    moratorium_interest_accrual = Column(Boolean, default=True)  # True = interest accrues during grace period
    collateral_required = Column(Boolean, default=False)
    supported_categories = Column(JSON, default=list)  # list of slug strings e.g. ["poultry", "dairy", "retail"]
    eligibility_criteria = Column(JSON, default=dict)
    is_verified = Column(Boolean, default=True, nullable=False)
    verification_status = Column(String(50), default="Verified", nullable=False)  # Verified, Pending Verification, Demonstration Data, Unavailable
    required_documents = Column(JSON, default=list)
    application_procedure = Column(JSON, default=list)
    official_application_website = Column(String(500), nullable=True)
    official_source_documents = Column(JSON, default=list)
    participating_banks = Column(JSON, default=list)
    effective_date_str = Column(String(50), default="2024-2026")
    official_source_url = Column(String(500), nullable=True)
    last_verified_date = Column(DateTime, default=datetime.utcnow)
    rule_version = Column(String(50), default="1.0")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    versions = relationship("SchemeRuleVersion", back_populates="scheme", cascade="all, delete-orphan")
    sources = relationship("SchemeSource", back_populates="scheme", cascade="all, delete-orphan")

class SchemeRuleVersion(Base):
    __tablename__ = "scheme_rule_versions"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("financial_scheme_rules.id", ondelete="CASCADE"), nullable=False)
    version_tag = Column(String(50), nullable=False)
    rule_snapshot = Column(JSON, nullable=False)
    change_summary = Column(Text, nullable=True)
    modified_by = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    scheme = relationship("FinancialSchemeRule", back_populates="versions")

class SchemeSource(Base):
    __tablename__ = "scheme_sources"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("financial_scheme_rules.id", ondelete="CASCADE"), nullable=False)
    document_title = Column(String(255), nullable=False)
    document_url = Column(String(500), nullable=True)
    issuing_authority = Column(String(255), nullable=False)
    effective_date = Column(DateTime, nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    verification_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    scheme = relationship("FinancialSchemeRule", back_populates="sources")

class FinancialCalculation(Base):
    __tablename__ = "financial_calculations"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("business_assessments.id", ondelete="CASCADE"), unique=True, nullable=False)
    scheme_id = Column(Integer, ForeignKey("financial_scheme_rules.id"), nullable=True)
    total_project_cost = Column(Float, nullable=False)
    promoter_margin_amount = Column(Float, nullable=False)
    promoter_margin_pct = Column(Float, nullable=False)
    subsidy_amount = Column(Float, default=0.0)
    subsidy_pct = Column(Float, default=0.0)
    loan_principal = Column(Float, nullable=False)
    effective_interest_rate = Column(Float, nullable=False)
    tenure_months = Column(Integer, nullable=False)
    moratorium_months = Column(Integer, default=0)
    monthly_emi = Column(Float, nullable=False)
    total_interest_payable = Column(Float, nullable=False)
    total_repayment = Column(Float, nullable=False)
    dscr = Column(Float, default=1.85)
    is_eligible = Column(Boolean, default=True)
    ineligibility_reasons = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    assessment = relationship("BusinessAssessment", back_populates="financial_calculation")
    repayment_schedules = relationship("RepaymentSchedule", back_populates="calculation", cascade="all, delete-orphan")

class RepaymentSchedule(Base):
    __tablename__ = "repayment_schedules"

    id = Column(Integer, primary_key=True, index=True)
    calculation_id = Column(Integer, ForeignKey("financial_calculations.id", ondelete="CASCADE"), nullable=False, index=True)
    month_number = Column(Integer, nullable=False)
    opening_balance = Column(Float, nullable=False)
    emi_amount = Column(Float, nullable=False)
    principal_component = Column(Float, nullable=False)
    interest_component = Column(Float, nullable=False)
    closing_balance = Column(Float, nullable=False)
    is_moratorium = Column(Boolean, default=False)

    calculation = relationship("FinancialCalculation", back_populates="repayment_schedules")

class GeographicFeature(Base):
    __tablename__ = "geographic_features"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(50), default="OpenStreetMap", nullable=False)
    osm_type = Column(String(20), nullable=True)  # node, way, relation
    osm_id = Column(String(100), index=True, nullable=True)
    feature_type = Column(String(100), nullable=False)  # road, market, bus_stop, shop, clinic, etc.
    category = Column(String(100), nullable=False, index=True)
    normalized_category = Column(String(100), nullable=True, index=True)
    name = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    attributes = Column(JSON, default=dict)
    source_url = Column(String(500), nullable=True)
    provenance = Column(String(50), default="OBSERVED_OSM", nullable=False, index=True)
    retrieved_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class UserBankingPreference(Base):
    __tablename__ = "user_banking_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    assessment_id = Column(Integer, ForeignKey("business_assessments.id", ondelete="CASCADE"), nullable=True, index=True)
    has_bank_account = Column(Boolean, default=True, nullable=False)
    selected_banks = Column(JSON, default=list)
    custom_bank_name = Column(String(255), nullable=True)
    account_types = Column(JSON, default=list)
    prefer_existing_bank = Column(Boolean, default=True, nullable=False)
    has_previous_business_loan = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="banking_preferences")
    assessment = relationship("BusinessAssessment", back_populates="banking_preference")

class SyntheticBusinessRecord(Base):
    __tablename__ = "synthetic_business_records"

    id = Column(Integer, primary_key=True, index=True)
    synthetic_id = Column(String(100), unique=True, index=True, nullable=False)
    business_category = Column(String(100), nullable=False, index=True)
    business_name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    estimated_size = Column(String(50), default="micro")  # micro, small
    density_score = Column(Float, default=0.5)
    monthly_sales_range = Column(String(100), default="₹40,000 - ₹80,000")
    generation_method = Column(String(100), default="Faker+Poisson_Spatial_Process", nullable=False)
    model_version = Column(String(50), default="1.0")
    confidence_interval = Column(String(50), default="±18%")
    is_synthetic = Column(Boolean, default=True, nullable=False)  # ALWAYS True
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class DataSourceMetadata(Base):
    __tablename__ = "data_source_metadata"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String(100), unique=True, nullable=False)
    provider_type = Column(String(50), nullable=False)  # geospatial, financial, ai, synthetic
    api_endpoint = Column(String(500), nullable=True)
    status = Column(String(50), default="healthy")  # healthy, degraded, unconfigured, offline
    last_checked_at = Column(DateTime, default=datetime.utcnow)
    data_completeness_pct = Column(Float, default=100.0)
    remarks = Column(Text, nullable=True)

class BusinessGuideDocument(Base):
    __tablename__ = "business_guide_documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    business_category = Column(String(100), nullable=False, index=True)
    author_agency = Column(String(255), nullable=False)
    document_type = Column(String(50), default="standard_operating_procedure")
    file_path = Column(String(500), nullable=True)
    content_hash = Column(String(100), nullable=True)
    version = Column(String(50), default="1.0")
    is_processed = Column(Boolean, default=False)
    total_chunks = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("business_guide_documents.id", ondelete="CASCADE"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    token_count = Column(Integer, default=0)
    embedding = Column(JSON, nullable=True)  # Stores vector array (pgvector compatible)
    metadata_tags = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    document = relationship("BusinessGuideDocument", back_populates="chunks")

class AdvisoryReport(Base):
    __tablename__ = "advisory_reports"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("business_assessments.id", ondelete="CASCADE"), unique=True, nullable=False)
    market_reach = Column(JSON, nullable=False)
    underserved_niches = Column(JSON, nullable=False)
    budget_scaled_swot = Column(JSON, nullable=False)
    local_threats = Column(JSON, nullable=False)
    competitor_density = Column(JSON, nullable=False)
    suggested_pricing = Column(JSON, nullable=False)
    overall_assessment = Column(JSON, nullable=False)
    sources = Column(JSON, default=list)
    data_limitations = Column(JSON, default=list)
    ai_model_used = Column(String(100), default="deterministic_fallback")
    is_fallback = Column(Boolean, default=False)
    generated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    assessment = relationship("BusinessAssessment", back_populates="advisory_report")
    evidences = relationship("ReportEvidence", back_populates="report", cascade="all, delete-orphan")

class ReportEvidence(Base):
    __tablename__ = "report_evidence"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("advisory_reports.id", ondelete="CASCADE"), nullable=False, index=True)
    section_name = Column(String(100), nullable=False)
    claim_text = Column(Text, nullable=False)
    source_type = Column(SQLEnum(TruthSourceType), nullable=False)
    source_citation = Column(String(500), nullable=False)
    confidence_score = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    report = relationship("AdvisoryReport", back_populates="evidences")

class SavedBudgetScenario(Base):
    __tablename__ = "saved_budget_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    assessment_id = Column(Integer, ForeignKey("business_assessments.id", ondelete="SET NULL"), nullable=True)
    scenario_name = Column(String(255), nullable=False)
    raw_material_cost_per_unit = Column(Float, nullable=False)
    selling_price_per_unit = Column(Float, nullable=False)
    daily_units_sold = Column(Float, nullable=False)
    working_days_per_month = Column(Integer, default=26)
    fixed_monthly_costs = Column(Float, nullable=False)
    contribution_margin = Column(Float, nullable=False)
    contribution_margin_pct = Column(Float, nullable=False)
    break_even_units_per_month = Column(Float, nullable=False)
    break_even_daily_units = Column(Float, nullable=False)
    break_even_revenue = Column(Float, nullable=False)
    expected_monthly_revenue = Column(Float, nullable=False)
    expected_monthly_operating_profit = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="saved_scenarios")

class IntegrationStatus(Base):
    __tablename__ = "integration_status"

    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String(100), unique=True, nullable=False)
    display_title = Column(String(255), nullable=False)
    is_configured = Column(Boolean, default=False)
    is_healthy = Column(Boolean, default=False)
    latency_ms = Column(Float, default=0.0)
    last_ping = Column(DateTime, default=datetime.utcnow)
    details = Column(JSON, default=dict)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False, index=True)
    entity_name = Column(String(100), nullable=False)
    entity_id = Column(String(100), nullable=True)
    ip_address = Column(String(100), nullable=True)
    details = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    user = relationship("User", back_populates="audit_logs")
