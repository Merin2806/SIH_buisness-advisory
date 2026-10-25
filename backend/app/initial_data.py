import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.entities import (
    User, UserRole, UserProfile, BusinessCategory,
    BusinessAssessment, AssessmentLocation, BusinessCostInput,
    FinancialCalculation, RepaymentSchedule, AdvisoryReport,
    FinancialSchemeRule, BusinessGuideDocument, DocumentChunk,
    SyntheticBusinessRecord, DataSourceMetadata, AuditLog, TruthSourceType,
    GeographicFeature, UserBankingPreference
)
from app.financial_engine.engine import (
    VERIFIED_SCHEME_CATALOGUE,
    PARTICIPATING_BANKS_DEFAULT,
    DeterministicFinancialEngine
)
from app.geospatial.geo_service import GeospatialService, SAMPLE_OSM_FEATURES
from app.rag.rag_service import SEED_KNOWLEDGE_DOCUMENTS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEMO_USER_EMAIL = "ramesh.patil@ruralbiz.org"
DEMO_USER_PASSWORD = "RuralPass@2026"

def ensure_schema_columns(engine):
    """Safely apply lightweight SQLite schema migrations for new audit fields."""
    with engine.connect() as conn:
        try:
            from sqlalchemy import text
            # 1. financial_scheme_rules
            existing = [r[1] for r in conn.execute(text("PRAGMA table_info(financial_scheme_rules)")).fetchall()]
            if existing:
                new_cols = [
                    ("verification_status", "VARCHAR(50) DEFAULT 'Verified'"),
                    ("required_documents", "JSON DEFAULT '[]'"),
                    ("application_procedure", "JSON DEFAULT '[]'"),
                    ("official_application_website", "VARCHAR(500) DEFAULT NULL"),
                    ("official_source_documents", "JSON DEFAULT '[]'"),
                    ("participating_banks", "JSON DEFAULT '[]'"),
                    ("effective_date_str", "VARCHAR(50) DEFAULT '2024-2026'")
                ]
                for col_name, col_type in new_cols:
                    if col_name not in existing:
                        conn.execute(text(f"ALTER TABLE financial_scheme_rules ADD COLUMN {col_name} {col_type}"))

            # 2. assessment_locations
            existing_al = [r[1] for r in conn.execute(text("PRAGMA table_info(assessment_locations)")).fetchall()]
            if existing_al:
                new_al_cols = [
                    ("taluka_or_city", "VARCHAR(255) DEFAULT NULL"),
                    ("address", "VARCHAR(500) DEFAULT NULL")
                ]
                for col_name, col_type in new_al_cols:
                    if col_name not in existing_al:
                        conn.execute(text(f"ALTER TABLE assessment_locations ADD COLUMN {col_name} {col_type}"))

            # 3. geographic_features
            existing_gf = [r[1] for r in conn.execute(text("PRAGMA table_info(geographic_features)")).fetchall()]
            if existing_gf:
                new_gf_cols = [
                    ("osm_type", "VARCHAR(20) DEFAULT NULL"),
                    ("normalized_category", "VARCHAR(100) DEFAULT NULL"),
                    ("source_url", "VARCHAR(500) DEFAULT NULL"),
                    ("provenance", "VARCHAR(50) DEFAULT 'OBSERVED_OSM'"),
                    ("last_updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP")
                ]
                for col_name, col_type in new_gf_cols:
                    if col_name not in existing_gf:
                        conn.execute(text(f"ALTER TABLE geographic_features ADD COLUMN {col_name} {col_type}"))

            conn.commit()
        except Exception as e:
            logger.warning(f"Schema check error (safe to ignore if postgres): {e}")

def init_db(db: Session) -> None:
    # 1. Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    ensure_schema_columns(engine)
    logger.info("Database tables initialized.")

    # 2. Seed / Update Administrator Account
    admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL.lower()).first()
    if not admin:
        hashed_pwd = get_password_hash(settings.ADMIN_INITIAL_PASSWORD)
        admin = User(
            email=settings.ADMIN_EMAIL.lower(),
            hashed_password=hashed_pwd,
            full_name=settings.ADMIN_NAME,
            phone_number=settings.ADMIN_PHONE,
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

        profile = UserProfile(
            user_id=admin.id,
            village="Baramati Rural",
            district="Pune",
            state="Maharashtra",
            preferred_language="en",
            experience_years=5.0
        )
        db.add(profile)
        db.commit()
        logger.info(f"Administrator account bootstrapped: {settings.ADMIN_EMAIL}")
    else:
        logger.info(f"Administrator account verified: {settings.ADMIN_EMAIL}")

    # 3. Seed / Repair Rural Entrepreneur Demo Account (Ramesh Patil)
    demo_user = db.query(User).filter(User.email == DEMO_USER_EMAIL.lower()).first()
    demo_pwd_hash = get_password_hash(DEMO_USER_PASSWORD)
    if not demo_user:
        demo_user = User(
            email=DEMO_USER_EMAIL.lower(),
            hashed_password=demo_pwd_hash,
            full_name="Ramesh Patil",
            phone_number="9822334455",
            role=UserRole.USER,
            is_active=True
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        demo_profile = UserProfile(
            user_id=demo_user.id,
            village="Baramati Rural",
            district="Pune",
            state="Maharashtra",
            preferred_language="mr",
            experience_years=3.5
        )
        db.add(demo_profile)
        db.commit()
        logger.info(f"Rural Entrepreneur Demo Account bootstrapped: {DEMO_USER_EMAIL}")
    else:
        # Ensure password is refreshed to known RuralPass@2026 and active
        demo_user.hashed_password = demo_pwd_hash
        demo_user.is_active = True
        demo_user.role = UserRole.USER
        db.commit()
        logger.info(f"Rural Entrepreneur Demo Account credentials synced: {DEMO_USER_EMAIL}")

    # 4. Seed Business Categories
    categories = [
        {"slug": "poultry", "name": "Poultry & Layer Farming", "icon": "egg", "min": 25000, "max": 2500000, "desc": "Broiler meat, indigenous Desi eggs & organic manure"},
        {"slug": "tailoring", "name": "Tailoring & Apparel Craft", "icon": "scissors", "min": 20000, "max": 500000, "desc": "Custom stitching, school uniforms & local boutique"},
        {"slug": "kirana", "name": "Kirana & Daily Provisions", "icon": "store", "min": 30000, "max": 1000000, "desc": "FMCG, staples, digital recharge & micro-retail"},
        {"slug": "dairy", "name": "Dairy & Milk Collection", "icon": "cow", "min": 40000, "max": 1500000, "desc": "Cross-breed bovine milk, ghee & bulk co-op supply"},
        {"slug": "food_processing", "name": "Food Processing & Agro Value-Add", "icon": "utensils", "min": 50000, "max": 2000000, "desc": "Spices, papad, pickle making, grain milling & packaging"},
        {"slug": "retail", "name": "Vegetable & Fruit Retail", "icon": "apple-alt", "min": 15000, "max": 250000, "desc": "Fresh farm produce retail & bi-weekly haat mobile cart"},
        {"slug": "manufacturing", "name": "Small Rural Manufacturing", "icon": "cogs", "min": 100000, "max": 5000000, "desc": "Fly ash bricks, bamboo utility crafts & agrarian tools"},
        {"slug": "repair", "name": "Automobile & Agri Machine Repair", "icon": "wrench", "min": 25000, "max": 400000, "desc": "Two-wheeler, tractor & water pump electrical rewinding"},
        {"slug": "handicrafts", "name": "Handicrafts & Handloom", "icon": "palette", "min": 20000, "max": 300000, "desc": "Traditional artisan weaving, terracotta & festive decor"},
        {"slug": "salon", "name": "Village Grooming & Beauty Salon", "icon": "spa", "min": 25000, "max": 350000, "desc": "Hair styling, grooming & bridal festive services"},
    ]

    for cat in categories:
        existing_cat = db.query(BusinessCategory).filter(BusinessCategory.slug == cat["slug"]).first()
        if not existing_cat:
            db.add(BusinessCategory(
                slug=cat["slug"],
                name=cat["name"],
                icon=cat["icon"],
                typical_min_capital=cat["min"],
                typical_max_capital=cat["max"],
                description=cat["desc"],
                is_active=True
            ))
    db.commit()
    logger.info("Business categories verified/seeded.")

    # 5. Seed / Update Verified Financial Scheme Rules with Provenance & Documents
    for code, s in VERIFIED_SCHEME_CATALOGUE.items():
        existing_scheme = db.query(FinancialSchemeRule).filter(FinancialSchemeRule.scheme_code == code).first()
        if not existing_scheme:
            db.add(FinancialSchemeRule(
                scheme_code=s.code,
                scheme_name=s.name,
                department=s.department,
                min_project_cost=s.min_project_cost,
                max_project_cost=s.max_project_cost,
                min_promoter_margin_pct=s.min_margin_pct,
                subsidy_percentage=s.subsidy_pct,
                max_subsidy_amount=s.max_subsidy_amount,
                nominal_interest_rate=s.nominal_interest_rate,
                interest_subvention_pct=s.interest_subvention_pct,
                tenure_months=s.tenure_months,
                moratorium_months=s.moratorium_months,
                moratorium_interest_accrual=s.moratorium_interest_accrual,
                collateral_required=s.collateral_required,
                supported_categories=s.supported_categories,
                official_source_url=s.official_source_url,
                official_application_website=s.official_application_website,
                is_verified=s.is_verified,
                verification_status=s.verification_status,
                effective_date_str=s.effective_date_str,
                required_documents=s.required_documents,
                application_procedure=s.application_procedure,
                official_source_documents=s.official_source_documents,
                participating_banks=s.participating_banks,
                rule_version="1.0"
            ))
        else:
            # Update fields in case schema evolved
            existing_scheme.scheme_name = s.name
            existing_scheme.department = s.department
            existing_scheme.min_project_cost = s.min_project_cost
            existing_scheme.max_project_cost = s.max_project_cost
            existing_scheme.min_promoter_margin_pct = s.min_margin_pct
            existing_scheme.subsidy_percentage = s.subsidy_pct
            existing_scheme.max_subsidy_amount = s.max_subsidy_amount
            existing_scheme.nominal_interest_rate = s.nominal_interest_rate
            existing_scheme.interest_subvention_pct = s.interest_subvention_pct
            existing_scheme.tenure_months = s.tenure_months
            existing_scheme.moratorium_months = s.moratorium_months
            existing_scheme.moratorium_interest_accrual = s.moratorium_interest_accrual
            existing_scheme.collateral_required = s.collateral_required
            existing_scheme.supported_categories = s.supported_categories
            existing_scheme.official_source_url = s.official_source_url
            existing_scheme.official_application_website = s.official_application_website
            existing_scheme.is_verified = s.is_verified
            existing_scheme.verification_status = s.verification_status
            existing_scheme.effective_date_str = s.effective_date_str
            existing_scheme.required_documents = s.required_documents
            existing_scheme.application_procedure = s.application_procedure
            existing_scheme.official_source_documents = s.official_source_documents
            existing_scheme.participating_banks = s.participating_banks
    db.commit()
    logger.info("Audited financial scheme rules seeded/updated.")

    # 6. Seed Sample Business Assessment for Demo User (Ramesh Patil)
    existing_assessment = db.query(BusinessAssessment).filter(BusinessAssessment.user_id == demo_user.id).first()
    poultry_cat = db.query(BusinessCategory).filter(BusinessCategory.slug == "poultry").first()
    if not existing_assessment and poultry_cat:
        sample_assessment = BusinessAssessment(
            user_id=demo_user.id,
            category_id=poultry_cat.id,
            proposed_business_name="Patil Organic Broiler & Layer Farm",
            business_stage="new",
            seed_capital=75000.0,
            estimated_project_cost=250000.0,
            number_of_workers=2,
            target_customers_desc="Local wholesale traders in Baramati, weekly haats, and direct village consumers",
            status="completed"
        )
        db.add(sample_assessment)
        db.commit()
        db.refresh(sample_assessment)

        # Location
        sample_loc = AssessmentLocation(
            assessment_id=sample_assessment.id,
            village="Baramati Rural",
            district="Pune",
            state="Maharashtra",
            latitude=18.1512,
            longitude=74.5771,
            search_radius_km=5.0,
            is_gps_verified=True
        )
        db.add(sample_loc)

        # Cost inputs
        sample_cost = BusinessCostInput(
            assessment_id=sample_assessment.id,
            raw_material_cost_per_unit=120.0,
            selling_price_per_unit=190.0,
            daily_units_sold=35.0,
            transport_cost_per_month=3000.0,
            rent_per_month=4000.0,
            salaries_per_month=6000.0,
            utilities_per_month=2500.0,
            packaging_cost_per_month=1500.0,
            other_fixed_costs_per_month=2000.0,
            working_days_per_month=26
        )
        db.add(sample_cost)

        # Deterministic financial calculation under NABARD_PVCF / PMMY_KISHORE
        sample_fin = FinancialCalculation(
            assessment_id=sample_assessment.id,
            total_project_cost=250000.0,
            promoter_margin_amount=25000.0,
            promoter_margin_pct=10.0,
            subsidy_amount=62500.0,
            subsidy_pct=25.0,
            loan_principal=162500.0,
            effective_interest_rate=7.75,
            tenure_months=48,
            moratorium_months=6,
            monthly_emi=3950.0,
            total_interest_payable=27100.0,
            total_repayment=189600.0,
            dscr=2.15,
            is_eligible=True,
            ineligibility_reasons=[]
        )
        db.add(sample_fin)
        db.commit()
        db.refresh(sample_fin)

        # Repayment schedule
        schedule_rows = DeterministicFinancialEngine.generate_repayment_schedule(
            principal=162500.0,
            effective_annual_rate=7.75,
            tenure_months=48,
            moratorium_months=6,
            interest_accrual_during_moratorium=True
        )
        for row in schedule_rows[:36]:
            db.add(RepaymentSchedule(
                calculation_id=sample_fin.id,
                month_number=row["month_number"],
                opening_balance=row["opening_balance"],
                emi_amount=row["emi_amount"],
                principal_component=row["principal_component"],
                interest_component=row["interest_component"],
                closing_balance=row["closing_balance"],
                is_moratorium=row["is_moratorium"]
            ))

        # 6-Section Advisory Report
        sample_advisory = AdvisoryReport(
            assessment_id=sample_assessment.id,
            market_reach={
                "radius_km": 5.0,
                "catchment_population_est": 18500,
                "target_segments": ["Rural Dhabas & Small Hotels", "Weekly Market (Haat) Shoppers", "Institutional Egg Consumers"],
                "strategic_summary": "Baramati Rural has direct connectivity via state highway SH-10, enabling efficient transport of fresh poultry and eggs to local weekly markets within 40 minutes."
            },
            underserved_niches={
                "opportunities": [
                    "Direct farm-gate Desi (indigenous) egg sales with 30% price premium over commercial caged eggs.",
                    "Supply of organic poultry droppings manure to nearby sugarcane and pomegranate farmers.",
                    "Pre-cleaned, dressed broiler meat packets for rural catering events during festive seasons."
                ],
                "unmet_needs": "Absence of hygienic local poultry dressing unit within 6 km."
            },
            budget_scaled_swot={
                "strengths": [
                    "Available own land eliminates shed rental expenses.",
                    "Family labor assistance reduces initial wage burden during the first 6 months."
                ],
                "weaknesses": [
                    "Working capital reserve is constrained at ₹75,000 against fluctuating feed prices.",
                    "Lack of automated temperature control during extreme peak summer months (April-May)."
                ],
                "opportunities": [
                    "NABARD PVCF back-ended capital subsidy (25%) reduces long-term debt burden significantly.",
                    "Cooperative feed procurement with neighboring poultry owners to reduce wholesale feed cost."
                ],
                "threats": [
                    "Seasonal viral outbreaks (Ranikhet/Newcastle disease) necessitating strict biosecurity protocols.",
                    "Monsoon humidity causing damp litter disease if ventilation is inadequate."
                ]
            },
            local_threats={
                "disease_risk": "Moderate; mandatory 3-stage vaccination schedule must be adhered to.",
                "price_volatility": "Wholesale broiler live-bird rate fluctuates between ₹95 to ₹135/kg.",
                "climate_risk": "Summer heat mortality requires foggers and thatched shade nets."
            },
            competitor_density={
                "observed_competitors_count": 2,
                "synthetic_competitors_count": 4,
                "density_index": "Moderate (0.42)",
                "summary": "2 mapped poultry and livestock dealers identified within 5 km radius on OpenStreetMap. Low direct competition for organic desi eggs."
            },
            suggested_pricing={
                "cost_per_kg_produced": 120.0,
                "wholesale_selling_price_target": 155.0,
                "retail_selling_price_target": 190.0,
                "gross_margin_pct": 36.8,
                "pricing_strategy": "Cost-plus with 10% promotional introductory discount for local catering vendors."
            },
            overall_assessment={
                "viability_verdict": "Potentially viable based on available evidence",
                "confidence_score": 0.88,
                "key_recommendation": "Phase investment into two batches of 600 birds each to smooth cash flow and mitigate disease risk."
            },
            sources=[
                {"title": "OpenStreetMap Infrastructure Overpass", "type": "observed_osm"},
                {"title": "NABARD Poultry Model Project Profiles", "type": "govt_scheme_verified"},
                {"title": "Maharashtra Animal Husbandry Directorate Biosecurity Manual", "type": "rag_kb"}
            ],
            data_limitations=[
                "Local feed price fluctuations from grain markets require bi-weekly verification.",
                "OpenStreetMap may not reflect unlisted micro-poultry setups in remote wadis."
            ],
            ai_model_used="Groq Llama 3.3 70B Versatile",
            is_fallback=False
        )
        db.add(sample_advisory)
        db.commit()
        logger.info(f"Sample assessment and advisory report seeded for demo user: {DEMO_USER_EMAIL}")

    # 6.5 Seed User Banking Preference for Demo User
    existing_bank_pref = db.query(UserBankingPreference).filter(UserBankingPreference.user_id == demo_user.id).first()
    if not existing_bank_pref:
        ass_id = existing_assessment.id if existing_assessment else (sample_assessment.id if 'sample_assessment' in locals() else None)
        db.add(UserBankingPreference(
            user_id=demo_user.id,
            assessment_id=ass_id,
            has_bank_account=True,
            selected_banks=["Bank of Maharashtra", "State Bank of India"],
            custom_bank_name=None,
            account_types=["Savings Account"],
            prefer_existing_bank=True,
            has_previous_business_loan=False
        ))
        db.commit()
        logger.info(f"Banking preferences seeded for demo user: {DEMO_USER_EMAIL}")

    # 7. Seed Knowledge Documents
    for kdoc in SEED_KNOWLEDGE_DOCUMENTS:
        exists = db.query(BusinessGuideDocument).filter(BusinessGuideDocument.title == kdoc["title"]).first()
        if not exists:
            doc = BusinessGuideDocument(
                title=kdoc["title"],
                business_category=kdoc["category"],
                author_agency=kdoc["author"],
                is_processed=True,
                total_chunks=1
            )
            db.add(doc)
            db.commit()
            db.refresh(doc)

            db.add(DocumentChunk(
                document_id=doc.id,
                chunk_index=0,
                content=kdoc["content"].strip(),
                token_count=len(kdoc["content"].split())
            ))
    db.commit()
    logger.info("Knowledge base reference guides seeded.")

    # 7.5 Seed Observed Real OpenStreetMap Features for Baramati Rural Catchment
    for feat in SAMPLE_OSM_FEATURES:
        osm_id = feat.get("osm_id")
        exists = db.query(GeographicFeature).filter(
            GeographicFeature.source == "OpenStreetMap",
            GeographicFeature.osm_id == osm_id
        ).first()
        if not exists:
            osm_type = "node" if "node/" in str(osm_id) else ("way" if "way/" in str(osm_id) else "element")
            db.add(GeographicFeature(
                source="OpenStreetMap",
                osm_type=osm_type,
                osm_id=osm_id,
                feature_type=feat.get("feature_type", "shop"),
                category=feat.get("category", "general"),
                normalized_category=feat.get("category", "general").capitalize(),
                name=feat.get("name"),
                latitude=float(feat["latitude"]),
                longitude=float(feat["longitude"]),
                attributes=feat.get("attributes", {}),
                source_url=f"https://www.openstreetmap.org/{osm_id}",
                provenance="OBSERVED_OSM",
                retrieved_at=datetime.utcnow(),
                last_updated_at=datetime.utcnow()
            ))
    db.commit()
    logger.info("Observed OpenStreetMap geographic features seeded.")

    # 8. Seed Isolated Synthetic Business Records for Baramati Rural
    synth_poultry = GeospatialService.generate_synthetic_competitors(
        latitude=18.1512,
        longitude=74.5771,
        category_slug="poultry",
        radius_km=5.0,
        count=4
    )
    for sr in synth_poultry:
        exists = db.query(SyntheticBusinessRecord).filter(SyntheticBusinessRecord.synthetic_id == sr["synthetic_id"]).first()
        if not exists:
            db.add(SyntheticBusinessRecord(
                synthetic_id=sr["synthetic_id"],
                business_category=sr["business_category"],
                business_name=sr["business_name"],
                latitude=sr["latitude"],
                longitude=sr["longitude"],
                monthly_sales_range=sr["monthly_sales_range"],
                density_score=sr["density_score"],
                generation_method=sr["generation_method"],
                is_synthetic=True
            ))
    db.commit()
    logger.info("Isolated synthetic demonstration dataset seeded.")

    # 9. Seed DataSourceMetadata
    datasources = [
        {"name": "OpenStreetMap Overpass API", "type": "geospatial", "endpoint": settings.OVERPASS_URL, "status": "healthy"},
        {"name": "Groq LLaMA Cloud Engine", "type": "ai", "endpoint": "https://api.groq.com/openai/v1", "status": "healthy" if settings.GROQ_API_KEY else "unconfigured"},
        {"name": "Bhashini Indic Voice (Dhruva)", "type": "voice", "endpoint": "https://dhruva-api.bhashini.gov.in", "status": "healthy" if settings.BHASHINI_API_KEY else "unconfigured"},
        {"name": "NABARD & MSME Scheme Catalogues", "type": "financial", "endpoint": "https://www.mudra.org.in", "status": "healthy"}
    ]
    for ds in datasources:
        existing_ds = db.query(DataSourceMetadata).filter(DataSourceMetadata.source_name == ds["name"]).first()
        if not existing_ds:
            db.add(DataSourceMetadata(
                source_name=ds["name"],
                provider_type=ds["type"],
                api_endpoint=ds["endpoint"],
                status=ds["status"],
                data_completeness_pct=100.0,
                last_checked_at=datetime.utcnow()
            ))
    db.commit()
    logger.info("Data source metadata verified.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
