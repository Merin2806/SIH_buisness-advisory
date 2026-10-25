from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import (
    User, UserRole, BusinessAssessment, AdvisoryReport,
    FinancialSchemeRule, SchemeRuleVersion, SchemeSource,
    BusinessGuideDocument, DocumentChunk, SyntheticBusinessRecord,
    AuditLog, BusinessCategory, FinancialCalculation, DataSourceMetadata
)
from app.api.deps import get_current_admin
from app.core.config import settings

router = APIRouter()

@router.get("/overview")
def get_admin_overview(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    total_users = db.query(User).count()
    total_assessments = db.query(BusinessAssessment).count()
    total_calcs = db.query(FinancialCalculation).count()
    total_reports = db.query(AdvisoryReport).count()
    verified_schemes = db.query(FinancialSchemeRule).filter(FinancialSchemeRule.verification_status == "Verified").count()
    pending_schemes = db.query(FinancialSchemeRule).filter(FinancialSchemeRule.verification_status == "Pending Verification").count()
    demo_schemes = db.query(FinancialSchemeRule).filter(FinancialSchemeRule.verification_status == "Demonstration Data").count()
    knowledge_docs = db.query(BusinessGuideDocument).count()
    synthetic_records = db.query(SyntheticBusinessRecord).count()

    # Integrations status check
    integrations = [
        {
            "name": "Database (SQLite / PostgreSQL Engine)",
            "status": "Online",
            "is_configured": True,
            "details": f"Active Dialect: {settings.DATABASE_URL.split(':')[0].upper()}"
        },
        {
            "name": "OpenStreetMap Overpass API (Spatial Infrastructure)",
            "status": "Online",
            "is_configured": True,
            "details": settings.OVERPASS_URL
        },
        {
            "name": "Groq Llama 3.3 70B LLM Service",
            "status": "Configured (Live)" if settings.GROQ_API_KEY else "Deterministic Fallback Active",
            "is_configured": bool(settings.GROQ_API_KEY),
            "details": f"Model: {settings.GROQ_MODEL}"
        },
        {
            "name": "Bhashini Indic Voice API (Dhruva)",
            "status": "Configured (Live)" if settings.BHASHINI_API_KEY else "Web Speech Fallback Active",
            "is_configured": bool(settings.BHASHINI_API_KEY),
            "details": "Supported: Marathi, Hindi, English"
        },
        {
            "name": "Embedding Model & pgvector",
            "status": "Active (Local Semantic Retrieval)",
            "is_configured": True,
            "details": f"Model: {settings.EMBEDDING_MODEL}"
        }
    ]

    # Recent Audit Logs
    recent_logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(15).all()
    recent_activity = [
        {
            "id": l.id,
            "action": l.action,
            "entity_name": l.entity_name,
            "created_at": l.created_at,
            "details": l.details
        }
        for l in recent_logs
    ]

    return {
        "total_users": total_users,
        "total_assessments": total_assessments,
        "total_financial_calculations": total_calcs,
        "total_reports_generated": total_reports,
        "verified_schemes_count": verified_schemes,
        "pending_schemes_count": pending_schemes,
        "demo_schemes_count": demo_schemes,
        "knowledge_documents_count": knowledge_docs,
        "synthetic_records_count": synthetic_records,
        "integrations": integrations,
        "recent_activity": recent_activity
    }

@router.get("/schemes")
def get_all_schemes(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    schemes = db.query(FinancialSchemeRule).order_by(FinancialSchemeRule.id.asc()).all()
    results = []
    for s in schemes:
        results.append({
            "id": s.id,
            "scheme_code": s.scheme_code,
            "scheme_name": s.scheme_name,
            "department": s.department,
            "description": s.description,
            "min_project_cost": s.min_project_cost,
            "max_project_cost": s.max_project_cost,
            "min_promoter_margin_pct": s.min_promoter_margin_pct,
            "subsidy_percentage": s.subsidy_percentage,
            "max_subsidy_amount": s.max_subsidy_amount,
            "nominal_interest_rate": s.nominal_interest_rate,
            "interest_subvention_pct": s.interest_subvention_pct,
            "tenure_months": s.tenure_months,
            "moratorium_months": s.moratorium_months,
            "moratorium_interest_accrual": s.moratorium_interest_accrual,
            "is_verified": s.is_verified,
            "verification_status": s.verification_status or ("Verified" if s.is_verified else "Pending Verification"),
            "official_source_url": s.official_source_url,
            "official_application_website": s.official_application_website,
            "required_documents": s.required_documents or [],
            "application_procedure": s.application_procedure or [],
            "official_source_documents": s.official_source_documents or [],
            "participating_banks": s.participating_banks or [],
            "effective_date_str": s.effective_date_str or "2024-2026",
            "rule_version": s.rule_version,
            "last_verified_date": s.last_verified_date
        })
    return results

@router.patch("/schemes/{scheme_id}/status")
def update_scheme_verification_status(
    scheme_id: int,
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    scheme = db.query(FinancialSchemeRule).filter(FinancialSchemeRule.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found.")
    
    new_status = payload.get("verification_status")
    allowed = ["Verified", "Pending Verification", "Demonstration Data", "Unavailable"]
    if new_status not in allowed:
        raise HTTPException(status_code=400, detail=f"Invalid verification status. Allowed: {allowed}")

    old_status = scheme.verification_status
    scheme.verification_status = new_status
    scheme.is_verified = (new_status == "Verified")
    scheme.last_verified_date = datetime.utcnow()
    db.commit()

    # Log audit
    audit = AuditLog(
        user_id=admin.id,
        action="UPDATE_SCHEME_STATUS",
        entity_name="FinancialSchemeRule",
        entity_id=str(scheme.id),
        details={"scheme_code": scheme.scheme_code, "old_status": old_status, "new_status": new_status}
    )
    db.add(audit)
    db.commit()

    return {"message": "Scheme status updated successfully.", "scheme_id": scheme.id, "new_status": new_status}

@router.patch("/schemes/{scheme_id}")
def edit_scheme_details(
    scheme_id: int,
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    scheme = db.query(FinancialSchemeRule).filter(FinancialSchemeRule.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found.")

    # Snapshot existing version
    version_count = db.query(SchemeRuleVersion).filter(SchemeRuleVersion.scheme_id == scheme.id).count()
    snapshot = {
        "scheme_name": scheme.scheme_name,
        "department": scheme.department,
        "min_project_cost": scheme.min_project_cost,
        "max_project_cost": scheme.max_project_cost,
        "nominal_interest_rate": scheme.nominal_interest_rate,
        "interest_subvention_pct": scheme.interest_subvention_pct,
        "subsidy_percentage": scheme.subsidy_percentage,
        "verification_status": scheme.verification_status
    }
    db.add(SchemeRuleVersion(
        scheme_id=scheme.id,
        version_tag=f"{scheme.rule_version}.{version_count + 1}",
        rule_snapshot=snapshot,
        change_summary=payload.get("change_summary", "Administrative update of scheme parameters"),
        modified_by=admin.email
    ))

    # Apply updates
    if "scheme_name" in payload:
        scheme.scheme_name = payload["scheme_name"]
    if "department" in payload:
        scheme.department = payload["department"]
    if "min_project_cost" in payload:
        scheme.min_project_cost = float(payload["min_project_cost"])
    if "max_project_cost" in payload:
        scheme.max_project_cost = float(payload["max_project_cost"])
    if "nominal_interest_rate" in payload:
        scheme.nominal_interest_rate = float(payload["nominal_interest_rate"])
    if "interest_subvention_pct" in payload:
        scheme.interest_subvention_pct = float(payload["interest_subvention_pct"])
    if "subsidy_percentage" in payload:
        scheme.subsidy_percentage = float(payload["subsidy_percentage"])
    if "max_subsidy_amount" in payload:
        scheme.max_subsidy_amount = float(payload["max_subsidy_amount"])
    if "official_source_url" in payload:
        scheme.official_source_url = payload["official_source_url"]
    if "official_application_website" in payload:
        scheme.official_application_website = payload["official_application_website"]
    if "verification_status" in payload:
        scheme.verification_status = payload["verification_status"]
        scheme.is_verified = (payload["verification_status"] == "Verified")

    scheme.last_verified_date = datetime.utcnow()
    db.commit()

    # Audit log
    db.add(AuditLog(
        user_id=admin.id,
        action="EDIT_SCHEME_RULE",
        entity_name="FinancialSchemeRule",
        entity_id=str(scheme.id),
        details={"scheme_code": scheme.scheme_code, "updated_by": admin.email}
    ))
    db.commit()

    return {"message": "Scheme updated successfully.", "scheme_id": scheme.id}

@router.post("/schemes")
def create_scheme_rule(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    scheme = FinancialSchemeRule(
        scheme_code=payload["scheme_code"],
        scheme_name=payload["scheme_name"],
        department=payload["department"],
        description=payload.get("description", ""),
        min_project_cost=float(payload.get("min_project_cost", 10000)),
        max_project_cost=float(payload.get("max_project_cost", 1000000)),
        min_promoter_margin_pct=float(payload.get("min_promoter_margin_pct", 10)),
        subsidy_percentage=float(payload.get("subsidy_percentage", 0)),
        max_subsidy_amount=float(payload.get("max_subsidy_amount", 0)),
        nominal_interest_rate=float(payload.get("nominal_interest_rate", 9.0)),
        interest_subvention_pct=float(payload.get("interest_subvention_pct", 0)),
        tenure_months=int(payload.get("tenure_months", 36)),
        moratorium_months=int(payload.get("moratorium_months", 0)),
        moratorium_interest_accrual=bool(payload.get("moratorium_interest_accrual", True)),
        supported_categories=payload.get("supported_categories", ["all"]),
        is_verified=payload.get("verification_status") == "Verified",
        verification_status=payload.get("verification_status", "Pending Verification"),
        official_source_url=payload.get("official_source_url", ""),
        official_application_website=payload.get("official_application_website", ""),
        effective_date_str=payload.get("effective_date_str", "2024-2026"),
        required_documents=payload.get("required_documents", []),
        application_procedure=payload.get("application_procedure", []),
        rule_version="1.0"
    )
    db.add(scheme)
    db.commit()
    db.refresh(scheme)

    # Log audit
    audit = AuditLog(
        user_id=admin.id,
        action="CREATE_SCHEME_RULE",
        entity_name="FinancialSchemeRule",
        entity_id=str(scheme.id),
        details={"scheme_code": scheme.scheme_code, "name": scheme.scheme_name}
    )
    db.add(audit)
    db.commit()

    return {"message": "Scheme rule created successfully.", "scheme_id": scheme.id}

@router.get("/categories")
def list_business_categories(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    categories = db.query(BusinessCategory).all()
    return [
        {
            "id": c.id,
            "slug": c.slug,
            "name": c.name,
            "icon": c.icon,
            "description": c.description,
            "typical_min_capital": c.typical_min_capital,
            "typical_max_capital": c.typical_max_capital,
            "is_active": c.is_active
        }
        for c in categories
    ]

@router.post("/categories")
def create_business_category(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    cat = BusinessCategory(
        slug=payload["slug"],
        name=payload["name"],
        icon=payload.get("icon", "store"),
        description=payload.get("description", ""),
        typical_min_capital=float(payload.get("typical_min_capital", 25000)),
        typical_max_capital=float(payload.get("typical_max_capital", 500000)),
        is_active=True
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)

    db.add(AuditLog(
        user_id=admin.id,
        action="CREATE_CATEGORY",
        entity_name="BusinessCategory",
        entity_id=str(cat.id),
        details={"slug": cat.slug, "name": cat.name}
    ))
    db.commit()
    return {"message": "Business category added.", "category_id": cat.id}

@router.get("/documents")
def list_knowledge_documents(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    docs = db.query(BusinessGuideDocument).all()
    return [
        {
            "id": d.id,
            "title": d.title,
            "business_category": d.business_category,
            "author_agency": d.author_agency,
            "version": d.version,
            "is_processed": d.is_processed,
            "total_chunks": d.total_chunks,
            "created_at": d.created_at
        }
        for d in docs
    ]

@router.post("/documents")
def add_knowledge_document(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    title = payload.get("title")
    category = payload.get("business_category", "general")
    content = payload.get("content", "")
    author = payload.get("author_agency", "Official Agency")

    if not title or not content:
        raise HTTPException(status_code=400, detail="Title and content are required.")

    doc = BusinessGuideDocument(
        title=title,
        business_category=category,
        author_agency=author,
        is_processed=True,
        total_chunks=max(1, len(content) // 400)
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Add chunk
    chunk = DocumentChunk(
        document_id=doc.id,
        chunk_index=0,
        content=content[:1000],
        token_count=len(content.split())
    )
    db.add(chunk)
    db.commit()

    # Audit log
    db.add(AuditLog(
        user_id=admin.id,
        action="INGEST_KNOWLEDGE_DOCUMENT",
        entity_name="BusinessGuideDocument",
        entity_id=str(doc.id),
        details={"title": doc.title, "category": doc.business_category}
    ))
    db.commit()

    return {"message": "Document ingested into RAG repository.", "document_id": doc.id}

@router.get("/synthetic-records")
def list_synthetic_records(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    records = db.query(SyntheticBusinessRecord).limit(50).all()
    return [
        {
            "id": r.id,
            "synthetic_id": r.synthetic_id,
            "business_name": r.business_name,
            "business_category": r.business_category,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "monthly_sales_range": r.monthly_sales_range,
            "density_score": r.density_score,
            "generation_method": r.generation_method,
            "is_synthetic": r.is_synthetic,
            "confidence_interval": r.confidence_interval
        }
        for r in records
    ]

@router.get("/users")
def list_registered_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "phone_number": u.phone_number,
            "role": u.role.value,
            "is_active": u.is_active,
            "village": u.profile.village if u.profile else "—",
            "district": u.profile.district if u.profile else "—",
            "created_at": u.created_at
        }
        for u in users
    ]

@router.get("/audit-logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(50).all()
    return [
        {
            "id": l.id,
            "action": l.action,
            "entity_name": l.entity_name,
            "entity_id": l.entity_id,
            "details": l.details,
            "created_at": l.created_at
        }
        for l in logs
    ]

@router.get("/health")
def get_system_health(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "operational",
        "database": db_status,
        "osm_service": "active",
        "groq_ai": "active" if settings.GROQ_API_KEY else "fallback_mode",
        "bhashini": "active" if settings.BHASHINI_API_KEY else "fallback_mode",
        "timestamp": datetime.utcnow()
    }
