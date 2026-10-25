from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import BusinessCategory
from app.schemas.domain import BusinessCategorySchema

router = APIRouter()

@router.get("", response_model=List[BusinessCategorySchema])
def list_business_categories(db: Session = Depends(get_db)):
    cats = db.query(BusinessCategory).filter(BusinessCategory.is_active == True).all()
    return cats
