from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import (
    BusinessAssessment, AssessmentLocation, BusinessCostInput,
    BusinessCategory, FinancialCalculation, RepaymentSchedule,
    AdvisoryReport, ReportEvidence, User, TruthSourceType,
    UserBankingPreference
)
from app.schemas.domain import CreateAssessmentRequest
from app.api.deps import get_current_user
from app.financial_engine.engine import DeterministicFinancialEngine
from app.geospatial.geo_service import GeospatialService
from app.rag.rag_service import RAGService
from app.advisory.engine import AdvisoryEngine

router = APIRouter()

@router.post("", response_model=Dict[str, Any])
async def create_assessment(
    req: CreateAssessmentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Fetch category
    category = db.query(BusinessCategory).filter(
        BusinessCategory.slug == req.category_slug
    ).first()
    if not category:
        category = db.query(BusinessCategory).first()

    # 2. Run deterministic financial calculations
    financial_eval = DeterministicFinancialEngine.calculate_best_option(
        total_project_cost=req.estimated_project_cost,
        seed_capital=req.seed_capital,
        category_slug=req.category_slug,
        social_category="General",
        location_type="Rural"
    )
    primary_fin = financial_eval["primary"]

    # 3. Run geospatial analysis
    geo_eval = await GeospatialService.analyze_location(
        latitude=req.latitude,
        longitude=req.longitude,
        category_slug=req.category_slug,
        radius_km=req.search_radius_km,
        db=db
    )

    # 4. Retrieve RAG guide context
    guide_chunks = RAGService.get_context_for_category(req.category_slug)

    # 5. Generate strict 6-section evidence-grounded advisory report
    advisory_report_data = await AdvisoryEngine.generate_advisory_report(
        category_slug=req.category_slug,
        business_name=req.proposed_business_name,
        location_data={
            "village": req.village,
            "taluka_or_city": req.taluka_or_city,
            "district": req.district,
            "state": req.state,
            "address": req.address,
            "latitude": req.latitude,
            "longitude": req.longitude
        },
        geo_data=geo_eval,
        financial_data=primary_fin,
        guide_chunks=guide_chunks
    )

    # 6. Save Assessment
    assessment = BusinessAssessment(
        user_id=current_user.id,
        category_id=category.id if category else 1,
        proposed_business_name=req.proposed_business_name,
        business_stage=req.business_stage,
        seed_capital=req.seed_capital,
        estimated_project_cost=req.estimated_project_cost,
        number_of_workers=req.number_of_workers,
        target_customers_desc=req.target_customers_desc,
        status="completed"
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # 7. Save Location
    loc = AssessmentLocation(
        assessment_id=assessment.id,
        village=req.village,
        taluka_or_city=req.taluka_or_city,
        district=req.district,
        state=req.state,
        address=req.address,
        latitude=req.latitude,
        longitude=req.longitude,
        search_radius_km=req.search_radius_km,
        is_gps_verified=req.is_gps_verified
    )
    db.add(loc)

    # 7.5 Save Banking Preference if provided
    if req.banking_details:
        bank_pref = UserBankingPreference(
            user_id=current_user.id,
            assessment_id=assessment.id,
            has_bank_account=req.banking_details.has_bank_account,
            selected_banks=req.banking_details.selected_banks,
            custom_bank_name=req.banking_details.custom_bank_name,
            account_types=req.banking_details.account_types,
            prefer_existing_bank=req.banking_details.prefer_existing_bank,
            has_previous_business_loan=req.banking_details.has_previous_business_loan
        )
        db.add(bank_pref)

    # 8. Save Cost Input if provided
    if req.cost_inputs:
        cost = BusinessCostInput(
            assessment_id=assessment.id,
            raw_material_cost_per_unit=req.cost_inputs.raw_material_cost_per_unit,
            selling_price_per_unit=req.cost_inputs.selling_price_per_unit,
            daily_units_sold=req.cost_inputs.daily_units_sold,
            transport_cost_per_month=req.cost_inputs.transport_cost_per_month,
            rent_per_month=req.cost_inputs.rent_per_month,
            salaries_per_month=req.cost_inputs.salaries_per_month,
            utilities_per_month=req.cost_inputs.utilities_per_month,
            packaging_cost_per_month=req.cost_inputs.packaging_cost_per_month,
            other_fixed_costs_per_month=req.cost_inputs.other_fixed_costs_per_month,
            working_days_per_month=req.cost_inputs.working_days_per_month
        )
        db.add(cost)

    # 9. Save Financial Calculation & Schedule
    fin_calc = FinancialCalculation(
        assessment_id=assessment.id,
        total_project_cost=primary_fin["total_project_cost"],
        promoter_margin_amount=primary_fin["promoter_margin_amount"],
        promoter_margin_pct=primary_fin["promoter_margin_pct"],
        subsidy_amount=primary_fin["subsidy_amount"],
        subsidy_pct=primary_fin["subsidy_pct"],
        loan_principal=primary_fin["loan_principal"],
        effective_interest_rate=primary_fin["effective_interest_rate"],
        tenure_months=primary_fin["tenure_months"],
        moratorium_months=primary_fin["moratorium_months"],
        monthly_emi=primary_fin["monthly_emi"],
        total_interest_payable=primary_fin["total_interest_payable"],
        total_repayment=primary_fin["total_repayment"],
        dscr=primary_fin["dscr"],
        is_eligible=primary_fin["is_eligible"],
        ineligibility_reasons=primary_fin["ineligibility_reasons"]
    )
    db.add(fin_calc)
    db.commit()
    db.refresh(fin_calc)

    # Save Repayment Schedule lines (up to 36 for compact query)
    for row in primary_fin.get("repayment_schedule", [])[:36]:
        db.add(RepaymentSchedule(
            calculation_id=fin_calc.id,
            month_number=row["month_number"],
            opening_balance=row["opening_balance"],
            emi_amount=row["emi_amount"],
            principal_component=row["principal_component"],
            interest_component=row["interest_component"],
            closing_balance=row["closing_balance"],
            is_moratorium=row["is_moratorium"]
        ))

    # 10. Save Advisory Report
    adv_rep = AdvisoryReport(
        assessment_id=assessment.id,
        market_reach=advisory_report_data["market_reach"],
        underserved_niches=advisory_report_data["underserved_niches"],
        budget_scaled_swot=advisory_report_data["budget_scaled_swot"],
        local_threats=advisory_report_data["local_threats"],
        competitor_density=advisory_report_data["competitor_density"],
        suggested_pricing=advisory_report_data["suggested_pricing"],
        overall_assessment=advisory_report_data["overall_assessment"],
        sources=advisory_report_data["sources"],
        data_limitations=advisory_report_data["data_limitations"],
        ai_model_used=advisory_report_data["ai_model_used"],
        is_fallback=advisory_report_data.get("is_fallback", False)
    )
    db.add(adv_rep)
    db.commit()
    db.refresh(adv_rep)

    return {
        "assessment_id": assessment.id,
        "business_name": assessment.proposed_business_name,
        "category_slug": req.category_slug,
        "status": "completed",
        "financials": primary_fin,
        "comparisons": financial_eval["comparisons"],
        "geospatial": geo_eval,
        "advisory_report": advisory_report_data
    }

@router.get("", response_model=List[Dict[str, Any]])
def list_user_assessments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assessments = db.query(BusinessAssessment).filter(
        BusinessAssessment.user_id == current_user.id
    ).order_by(BusinessAssessment.created_at.desc()).all()

    results = []
    for a in assessments:
        loc = a.location
        fin = a.financial_calculation
        cat = a.category
        results.append({
            "id": a.id,
            "proposed_business_name": a.proposed_business_name,
            "category_name": cat.name if cat else "Micro-Enterprise",
            "category_slug": cat.slug if cat else "other",
            "seed_capital": a.seed_capital,
            "estimated_project_cost": a.estimated_project_cost,
            "village": loc.village if loc else "Rural",
            "district": loc.district if loc else "",
            "state": loc.state if loc else "",
            "status": a.status,
            "monthly_emi": fin.monthly_emi if fin else 0.0,
            "loan_principal": fin.loan_principal if fin else 0.0,
            "created_at": a.created_at
        })
    return results

@router.get("/{assessment_id}", response_model=Dict[str, Any])
def get_assessment_detail(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    a = db.query(BusinessAssessment).filter(
        BusinessAssessment.id == assessment_id,
        BusinessAssessment.user_id == current_user.id
    ).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    loc = a.location
    fin = a.financial_calculation
    cat = a.category
    rep = a.advisory_report

    repayment_rows = []
    if fin:
        repayment_rows = [
            {
                "month_number": r.month_number,
                "opening_balance": r.opening_balance,
                "emi_amount": r.emi_amount,
                "principal_component": r.principal_component,
                "interest_component": r.interest_component,
                "closing_balance": r.closing_balance,
                "is_moratorium": r.is_moratorium
            }
            for r in fin.repayment_schedules
        ]

    return {
        "id": a.id,
        "proposed_business_name": a.proposed_business_name,
        "category_name": cat.name if cat else "Micro-Enterprise",
        "category_slug": cat.slug if cat else "other",
        "seed_capital": a.seed_capital,
        "estimated_project_cost": a.estimated_project_cost,
        "location": {
            "village": loc.village if loc else "",
            "taluka_or_city": loc.taluka_or_city if loc else "",
            "district": loc.district if loc else "",
            "state": loc.state if loc else "",
            "address": loc.address if loc else "",
            "latitude": loc.latitude if loc else 0.0,
            "longitude": loc.longitude if loc else 0.0,
            "search_radius_km": loc.search_radius_km if loc else 5.0
        },
        "banking_preference": {
            "has_bank_account": a.banking_preference.has_bank_account if a.banking_preference else True,
            "selected_banks": a.banking_preference.selected_banks if a.banking_preference else [],
            "custom_bank_name": a.banking_preference.custom_bank_name if a.banking_preference else None,
            "account_types": a.banking_preference.account_types if a.banking_preference else [],
            "prefer_existing_bank": a.banking_preference.prefer_existing_bank if a.banking_preference else True,
            "has_previous_business_loan": a.banking_preference.has_previous_business_loan if a.banking_preference else False
        } if a.banking_preference else None,
        "financials": {
            "total_project_cost": fin.total_project_cost if fin else a.estimated_project_cost,
            "promoter_margin_amount": fin.promoter_margin_amount if fin else a.seed_capital,
            "promoter_margin_pct": fin.promoter_margin_pct if fin else 10.0,
            "subsidy_amount": fin.subsidy_amount if fin else 0.0,
            "loan_principal": fin.loan_principal if fin else 0.0,
            "effective_interest_rate": fin.effective_interest_rate if fin else 7.25,
            "tenure_months": fin.tenure_months if fin else 36,
            "moratorium_months": fin.moratorium_months if fin else 6,
            "monthly_emi": fin.monthly_emi if fin else 0.0,
            "total_interest_payable": fin.total_interest_payable if fin else 0.0,
            "total_repayment": fin.total_repayment if fin else 0.0,
            "dscr": fin.dscr if fin else 1.85,
            "repayment_schedule": repayment_rows
        },
        "advisory_report": {
            "market_reach": rep.market_reach if rep else {},
            "underserved_niches": rep.underserved_niches if rep else {},
            "budget_scaled_swot": rep.budget_scaled_swot if rep else {},
            "local_threats": rep.local_threats if rep else {},
            "competitor_density": rep.competitor_density if rep else {},
            "suggested_pricing": rep.suggested_pricing if rep else {},
            "overall_assessment": rep.overall_assessment if rep else {},
            "sources": rep.sources if rep else [],
            "data_limitations": rep.data_limitations if rep else [],
            "ai_model_used": rep.ai_model_used if rep else "Deterministic Fallback",
            "is_fallback": rep.is_fallback if rep else True
        },
        "created_at": a.created_at
    }
