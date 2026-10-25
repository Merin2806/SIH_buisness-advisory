import pytest
from app.financial_engine.engine import DeterministicFinancialEngine, VERIFIED_SCHEME_CATALOGUE

def test_standard_emi_calculation():
    # Test 50,000 principal at 7.25% p.a. over 30 months
    # Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    # monthly r = 0.0725 / 12 = 0.006041666...
    # Expected EMI ~ 1826.96
    emi = DeterministicFinancialEngine.calculate_standard_emi(
        principal=50000.0,
        annual_rate_pct=7.25,
        tenure_months=30
    )
    assert emi > 0
    assert 1820 < emi < 1835

def test_zero_interest_loan_handling():
    # Zero interest loan: EMI = Principal / tenure without division by zero
    emi = DeterministicFinancialEngine.calculate_standard_emi(
        principal=30000.0,
        annual_rate_pct=0.0,
        tenure_months=10
    )
    assert emi == 3000.0

def test_negative_or_zero_values():
    with pytest.raises(ValueError):
        DeterministicFinancialEngine.calculate_best_option(
            total_project_cost=-5000,
            seed_capital=1000,
            category_slug="poultry"
        )
    with pytest.raises(ValueError):
        DeterministicFinancialEngine.calculate_best_option(
            total_project_cost=50000,
            seed_capital=-500,
            category_slug="poultry"
        )

def test_moratorium_repayment_schedule():
    # 36 months total, 6 months moratorium without interest accrual
    schedule = DeterministicFinancialEngine.generate_repayment_schedule(
        principal=37500.0,
        effective_annual_rate=7.25,
        tenure_months=36,
        moratorium_months=6,
        interest_accrual_during_moratorium=False
    )
    assert len(schedule) == 36
    # First 6 months should have zero principal payment and is_moratorium True
    for m in range(6):
        assert schedule[m]["is_moratorium"] is True
        assert schedule[m]["principal_component"] == 0.0
    # Month 7 onwards should have active repayment
    assert schedule[6]["is_moratorium"] is False
    assert schedule[6]["emi_amount"] > 0
    # Closing balance at month 36 should be 0.0
    assert schedule[-1]["closing_balance"] == 0.0

def test_scheme_cost_ceiling_and_eligibility():
    shishu = VERIFIED_SCHEME_CATALOGUE["PMMY_SHISHU"]
    # Shishu max cost is 50,000. A 1,00,000 project should be marked ineligible
    eval_result = DeterministicFinancialEngine.evaluate_scheme(
        scheme=shishu,
        total_project_cost=100000.0,
        applicant_seed_capital=10000.0,
        category_slug="poultry"
    )
    assert eval_result["is_eligible"] is False
    assert any("exceeds ceiling" in reason for reason in eval_result["ineligibility_reasons"])

def test_insufficient_applicant_margin():
    kishore = VERIFIED_SCHEME_CATALOGUE["PMMY_KISHORE"]
    # Kishore requires 10% margin. For 1,00,000 project, ₹5,000 seed capital is insufficient
    eval_result = DeterministicFinancialEngine.evaluate_scheme(
        scheme=kishore,
        total_project_cost=100000.0,
        applicant_seed_capital=5000.0,
        category_slug="poultry"
    )
    assert eval_result["is_eligible"] is False
    assert any("mandatory 10.0% applicant margin" in reason for reason in eval_result["ineligibility_reasons"])
