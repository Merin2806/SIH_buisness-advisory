import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def get_demo_token():
    login_resp = client.post("/api/v1/auth/login", json={
        "email": settings.DEMO_USER_EMAIL,
        "password": settings.DEMO_USER_PASSWORD
    })
    assert login_resp.status_code == 200
    return login_resp.json()["access_token"]

def test_resolve_location_hierarchy():
    # Test resolving Maharashtra -> Pune -> Baramati
    payload = {
        "state": "Maharashtra",
        "district": "Pune",
        "city_or_taluka": "Baramati",
        "village_or_address": "Baramati Rural"
    }
    resp = client.post("/api/v1/geo/resolve-location", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "latitude" in data
    assert "longitude" in data
    assert 17.5 < data["latitude"] < 19.5
    assert 73.0 < data["longitude"] < 75.5

def test_reverse_geocode():
    payload = {
        "latitude": 18.1512,
        "longitude": 74.5771
    }
    resp = client.post("/api/v1/geo/reverse-geocode", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "state" in data
    assert "district" in data

def test_geo_admin_summary():
    resp = client.get("/api/v1/geo/admin/features-summary")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_observed_records"] >= 8
    assert data["total_synthetic_records"] >= 4
    assert "data_source_status" in data
    assert "records_by_category" in data
    assert "recent_features" in data
    assert len(data["recent_features"]) > 0
    # Provenance labels must be preserved
    assert data["recent_features"][0]["provenance"] == "OBSERVED_OSM"

def test_banking_details_and_loan_advisor():
    token = get_demo_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Save Banking Details
    bank_payload = {
        "has_bank_account": True,
        "selected_banks": ["Bank of Maharashtra", "State Bank of India"],
        "account_types": ["Savings Account"],
        "prefer_existing_bank": True,
        "has_previous_business_loan": False
    }
    save_resp = client.post("/api/v1/finance/banking-details", json=bank_payload, headers=headers)
    assert save_resp.status_code == 200
    saved_data = save_resp.json()
    assert saved_data["has_bank_account"] is True
    assert "Bank of Maharashtra" in saved_data["selected_banks"]

    # 2. Get Assessments for demo user
    ass_resp = client.get("/api/v1/assessments", headers=headers)
    assert ass_resp.status_code == 200
    assessments = ass_resp.json()
    assert len(assessments) >= 1
    assessment_id = assessments[0]["id"]

    # 3. Retrieve Complete Loan Advice
    advice_resp = client.get(f"/api/v1/finance/loan-advice/{assessment_id}", headers=headers)
    assert advice_resp.status_code == 200
    advice = advice_resp.json()

    assert "user_banking_details" in advice
    user_bank_info = advice["user_banking_details"]
    assert user_bank_info["has_bank_account"] is True

    # 4. Section C participating banks must prioritize matched existing bank
    participating_banks = advice["section_c_participating_banks"]
    assert len(participating_banks) >= 1
    # Check that matched home bank is flagged
    matched_flags = [b.get("is_user_bank") for b in participating_banks]
    assert True in matched_flags
