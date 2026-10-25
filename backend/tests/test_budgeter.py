import pytest
from app.budgeter.calculator import UnitEconomicsCalculator

def test_unit_economics_standard_breakeven():
    # Selling price ₹150, Raw material ₹80 -> Contribution = ₹70
    # Fixed monthly costs: ₹7,000
    # Expected break-even units = 7000 / 70 = 100 units
    res = UnitEconomicsCalculator.calculate(
        raw_material_cost_per_unit=80.0,
        selling_price_per_unit=150.0,
        daily_units_sold=10.0,
        working_days_per_month=25,
        rent_per_month=4000.0,
        salaries_per_month=2000.0,
        utilities_per_month=1000.0
    )
    assert res["contribution_margin"] == 70.0
    assert res["fixed_monthly_costs"] == 7000.0
    assert res["break_even_units_per_month"] == 100.0
    assert res["break_even_daily_units"] == 4.0
    assert res["is_positive_contribution"] is True
    assert "Safe Zone" in res["margin_health_zone"]

def test_negative_contribution_safety():
    # Raw material cost exceeds selling price -> zero-division protection
    res = UnitEconomicsCalculator.calculate(
        raw_material_cost_per_unit=120.0,
        selling_price_per_unit=100.0,
        daily_units_sold=5.0,
        working_days_per_month=25,
        rent_per_month=3000.0
    )
    assert res["contribution_margin"] == -20.0
    assert res["is_positive_contribution"] is False
    assert "Critical Risk" in res["margin_health_zone"]
    # Break even units should be safely flagged without raising ZeroDivisionError
    assert res["break_even_units_per_month"] > 99999
