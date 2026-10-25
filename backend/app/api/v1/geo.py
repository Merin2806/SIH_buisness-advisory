from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.domain import (
    GeoAnalyzeRequest, GeoAnalysisResponse,
    ResolveLocationRequest, ResolveLocationResponse,
    ReverseGeocodeRequest, ReverseGeocodeResponse,
    GeoAdminSummaryResponse
)
from app.geospatial.geo_service import GeospatialService

router = APIRouter()

@router.post("/analyze", response_model=GeoAnalysisResponse)
async def analyze_location(req: GeoAnalyzeRequest, db: Session = Depends(get_db)):
    try:
        result = await GeospatialService.analyze_location(
            latitude=req.latitude,
            longitude=req.longitude,
            category_slug=req.category_slug,
            radius_km=req.radius_km,
            db=db
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Geospatial analysis failed: {str(e)}")

@router.post("/resolve-location", response_model=ResolveLocationResponse)
async def resolve_location_endpoint(req: ResolveLocationRequest):
    try:
        result = await GeospatialService.resolve_location(
            state=req.state,
            district=req.district,
            taluka_or_city=req.city_or_taluka,
            village_or_address=req.village_or_address
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Location resolution failed: {str(e)}")

@router.post("/reverse-geocode", response_model=ReverseGeocodeResponse)
async def reverse_geocode_endpoint(req: ReverseGeocodeRequest):
    try:
        result = await GeospatialService.reverse_geocode(
            latitude=req.latitude,
            longitude=req.longitude
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reverse geocode failed: {str(e)}")

@router.get("/admin/features-summary", response_model=GeoAdminSummaryResponse)
def get_admin_features_summary(db: Session = Depends(get_db)):
    try:
        result = GeospatialService.get_admin_geo_summary(db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed retrieving geographic feature summary: {str(e)}")
