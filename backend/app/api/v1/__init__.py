from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.categories import router as categories_router
from app.api.v1.finance import router as finance_router
from app.api.v1.geo import router as geo_router
from app.api.v1.budget import router as budget_router
from app.api.v1.assessments import router as assessments_router
from app.api.v1.voice import router as voice_router
from app.api.v1.admin import router as admin_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(categories_router, prefix="/categories", tags=["Business Categories"])
api_router.include_router(finance_router, prefix="/finance", tags=["Financial Structuring"])
api_router.include_router(geo_router, prefix="/geo", tags=["Geospatial Analysis"])
api_router.include_router(budget_router, prefix="/budget", tags=["Business Budgeter"])
api_router.include_router(assessments_router, prefix="/assessments", tags=["Business Assessments & Advisory"])
api_router.include_router(voice_router, prefix="/voice", tags=["Voice & Translation"])
api_router.include_router(admin_router, prefix="/admin", tags=["Administrator Operations"])
