import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "RuralBiz AI" in data["service"]

def test_categories_endpoint():
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) >= 4
    slugs = [c["slug"] for c in categories]
    assert "poultry" in slugs
    assert "tailoring" in slugs

def test_financial_calculate_endpoint():
    payload = {
        "category_slug": "poultry",
        "total_project_cost": 50000.0,
        "seed_capital": 5000.0
    }
    response = client.post("/api/v1/finance/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "primary" in data
    assert "comparisons" in data
    primary = data["primary"]
    assert primary["monthly_emi"] > 0
    assert primary["loan_principal"] > 0
    assert primary["is_eligible"] is True

def test_auth_registration_and_login():
    unique_email = "entrepreneur_test@ruralbiz.org"
    reg_payload = {
        "full_name": "Ramesh Patil",
        "email": unique_email,
        "phone_number": "9876543210",
        "password": "Password@123",
        "confirm_password": "Password@123",
        "village": "Baramati Rural",
        "district": "Pune",
        "state": "Maharashtra"
    }
    # Register
    reg_resp = client.post("/api/v1/auth/register", json=reg_payload)
    # Could be 200 or 400 if already in db from previous run
    assert reg_resp.status_code in [200, 400]
    
    # Login
    login_resp = client.post("/api/v1/auth/login", json={
        "email": unique_email,
        "password": "Password@123"
    })
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "access_token" in login_data
    token = login_data["access_token"]
    assert login_data["role"] == "user"

    # Profile /me
    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == unique_email

    # Verify user CANNOT access admin endpoints
    admin_resp = client.get("/api/v1/admin/overview", headers={"Authorization": f"Bearer {token}"})
    assert admin_resp.status_code == 403

def test_admin_bootstrap_login():
    # Test logging in as the bootstrapped admin
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "riyamokale@gmail.com",
        "password": "AdminRuralBiz@2026"
    })
    assert login_resp.status_code == 200
    admin_data = login_resp.json()
    assert admin_data["role"] == "admin"
    admin_token = admin_data["access_token"]

    # Admin CAN access admin overview
    admin_resp = client.get("/api/v1/admin/overview", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_resp.status_code == 200
    overview = admin_resp.json()
    assert overview["total_users"] >= 1
    assert overview["verified_schemes_count"] >= 1
