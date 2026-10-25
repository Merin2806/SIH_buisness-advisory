import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import get_password_hash, verify_password, create_access_token
from app.advisory.engine import AdvisoryEngine
from app.schemas.domain import StrictAdvisoryReportSchema

client = TestClient(app)

def test_password_hashing():
    raw = "SecureRuralPassword@2026"
    hashed = get_password_hash(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("wrongPassword", hashed) is False

def test_strict_six_section_advisory_report_schema():
    report = AdvisoryEngine.build_deterministic_grounded_report(
        category_slug="poultry",
        business_name="Baramati Desi Layer Farm",
        location_data={"village": "Baramati Rural", "district": "Pune"},
        geo_data={
            "radius_km": 5.0,
            "observed_competitors_count": 1,
            "synthetic_competitors_count": 3,
            "infrastructure_proxies": {"markets": 2, "transport": 3}
        },
        financial_data={
            "total_project_cost": 50000.0,
            "loan_principal": 37500.0,
            "monthly_emi": 1438.0,
            "subsidy_amount": 7500.0,
            "scheme_name": "PMMY Shishu / NABARD PVCF",
            "tenure_months": 36,
            "moratorium_months": 6
        },
        guide_chunks=[]
    )
    # Check that all 6 required sections exist
    required_sections = [
        "market_reach",
        "underserved_niches",
        "budget_scaled_swot",
        "local_threats",
        "competitor_density",
        "suggested_pricing"
    ]
    for sec in required_sections:
        assert sec in report, f"Missing section {sec}"
    
    # Validate against strict Pydantic Schema
    validated = StrictAdvisoryReportSchema(**report)
    assert validated.market_reach.summary is not None
    assert len(validated.budget_scaled_swot.strengths) > 0
    assert validated.is_fallback is True

def test_demo_account_login():
    """Verify Rural Entrepreneur Demo Account logs in successfully and returns user role."""
    response = client.post("/api/v1/auth/login", json={
        "email": "ramesh.patil@ruralbiz.org",
        "password": "RuralPass@2026"
    })
    assert response.status_code == 200, f"Demo login failed: {response.text}"
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "user"
    assert data["email"] == "ramesh.patil@ruralbiz.org"
    assert data["full_name"] == "Ramesh Patil"

def test_admin_account_login():
    """Verify Admin Account logs in successfully and returns admin role."""
    response = client.post("/api/v1/auth/login", json={
        "email": "riyamokale@gmail.com",
        "password": "AdminRuralBiz@2026"
    })
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "admin"

def test_language_preference_persistence():
    """Verify authenticated user can persist Marathi/Hindi/English language preference."""
    login_res = client.post("/api/v1/auth/login", json={
        "email": "ramesh.patil@ruralbiz.org",
        "password": "RuralPass@2026"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Patch language to Marathi
    patch_res = client.patch("/api/v1/auth/language", json={"language": "mr"}, headers=headers)
    assert patch_res.status_code == 200
    assert patch_res.json()["language"] == "mr"

    # Get /me profile to verify persistence
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["preferred_language"] == "mr"

def test_loan_advisor_advice_endpoint():
    """Verify Loan Advisor generates complete answers A through G for demo user assessment."""
    login_res = client.post("/api/v1/auth/login", json={
        "email": "ramesh.patil@ruralbiz.org",
        "password": "RuralPass@2026"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch user assessments
    assessments_res = client.get("/api/v1/assessments", headers=headers)
    assert assessments_res.status_code == 200
    items = assessments_res.json()
    assert len(items) > 0, "Demo user must have seeded sample assessment"
    assessment_id = items[0]["id"]

    # Call Loan Advice endpoint
    advice_res = client.get(f"/api/v1/finance/loan-advice/{assessment_id}", headers=headers)
    assert advice_res.status_code == 200
    advice = advice_res.json()

    # Verify Sections A through G
    assert "section_a_loan_sizing" in advice
    assert "total_project_cost" in advice["section_a_loan_sizing"]
    assert "affordability_verdict" in advice["section_a_loan_sizing"]

    assert "section_b_scheme_comparison" in advice
    assert len(advice["section_b_scheme_comparison"]) > 0
    first_scheme = advice["section_b_scheme_comparison"][0]
    assert "verification_status" in first_scheme
    assert "required_documents" in first_scheme

    assert "section_c_participating_banks" in advice
    assert len(advice["section_c_participating_banks"]) > 0

    assert "section_d_application_steps" in advice
    assert "section_e_document_checklist" in advice
    assert "section_f_emi_breakdown" in advice
    assert "monthly_emi" in advice["section_f_emi_breakdown"]
    assert "section_g_financial_guidance" in advice
