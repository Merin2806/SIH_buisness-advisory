from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.budgeter.calculator import UnitEconomicsCalculator
from app.schemas.domain import (
    BudgetCalculateRequest,
    BudgetCalculateResponse,
    SaveBudgetScenarioRequest
)
from app.models.entities import SavedBudgetScenario, User
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/calculate", response_model=BudgetCalculateResponse)
def calculate_unit_economics(req: BudgetCalculateRequest):
    result = UnitEconomicsCalculator.calculate(
        raw_material_cost_per_unit=req.raw_material_cost_per_unit,
        selling_price_per_unit=req.selling_price_per_unit,
        daily_units_sold=req.daily_units_sold,
        working_days_per_month=req.working_days_per_month,
        rent_per_month=req.rent_per_month,
        salaries_per_month=req.salaries_per_month,
        transport_cost_per_month=req.transport_cost_per_month,
        utilities_per_month=req.utilities_per_month,
        packaging_cost_per_month=req.packaging_cost_per_month,
        other_fixed_costs_per_month=req.other_fixed_costs_per_month
    )
    return result

@router.post("/scenarios")
def save_scenario(
    req: SaveBudgetScenarioRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    calc = UnitEconomicsCalculator.calculate(
        raw_material_cost_per_unit=req.inputs.raw_material_cost_per_unit,
        selling_price_per_unit=req.inputs.selling_price_per_unit,
        daily_units_sold=req.inputs.daily_units_sold,
        working_days_per_month=req.inputs.working_days_per_month,
        rent_per_month=req.inputs.rent_per_month,
        salaries_per_month=req.inputs.salaries_per_month,
        transport_cost_per_month=req.inputs.transport_cost_per_month,
        utilities_per_month=req.inputs.utilities_per_month,
        packaging_cost_per_month=req.inputs.packaging_cost_per_month,
        other_fixed_costs_per_month=req.inputs.other_fixed_costs_per_month
    )

    scenario = SavedBudgetScenario(
        user_id=current_user.id,
        assessment_id=req.assessment_id,
        scenario_name=req.scenario_name,
        raw_material_cost_per_unit=req.inputs.raw_material_cost_per_unit,
        selling_price_per_unit=req.inputs.selling_price_per_unit,
        daily_units_sold=req.inputs.daily_units_sold,
        working_days_per_month=req.inputs.working_days_per_month,
        fixed_monthly_costs=calc["fixed_monthly_costs"],
        contribution_margin=calc["contribution_margin"],
        contribution_margin_pct=calc["contribution_margin_pct"],
        break_even_units_per_month=calc["break_even_units_per_month"],
        break_even_daily_units=calc["break_even_daily_units"],
        break_even_revenue=calc["break_even_revenue"],
        expected_monthly_revenue=calc["expected_monthly_revenue"],
        expected_monthly_operating_profit=calc["expected_monthly_operating_profit"]
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)

    return {"message": "Scenario saved successfully.", "scenario_id": scenario.id}

@router.get("/scenarios")
def list_user_scenarios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scenarios = db.query(SavedBudgetScenario).filter(
        SavedBudgetScenario.user_id == current_user.id
    ).order_by(SavedBudgetScenario.created_at.desc()).all()

    return [
        {
            "id": s.id,
            "scenario_name": s.scenario_name,
            "assessment_id": s.assessment_id,
            "selling_price_per_unit": s.selling_price_per_unit,
            "raw_material_cost_per_unit": s.raw_material_cost_per_unit,
            "contribution_margin": s.contribution_margin,
            "break_even_daily_units": s.break_even_daily_units,
            "expected_monthly_operating_profit": s.expected_monthly_operating_profit,
            "created_at": s.created_at
        }
        for s in scenarios
    ]
