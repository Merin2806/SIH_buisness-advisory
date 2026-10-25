from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.models.entities import User, UserProfile, UserRole
from app.schemas.domain import UserRegisterRequest, UserLoginRequest, TokenResponse, UserProfileResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    if req.password != req.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )
    
    # Check if email exists
    existing_user = db.query(User).filter(User.email == req.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Hash password
    hashed_pwd = get_password_hash(req.password)
    
    new_user = User(
        email=req.email.lower(),
        hashed_password=hashed_pwd,
        full_name=req.full_name,
        phone_number=req.phone_number,
        role=UserRole.USER,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create profile
    profile = UserProfile(
        user_id=new_user.id,
        village=req.village,
        district=req.district,
        state=req.state,
        preferred_language="en"
    )
    db.add(profile)
    db.commit()

    # Generate JWT
    token = create_access_token(subject=new_user.id, role=new_user.role.value)
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=new_user.id,
        full_name=new_user.full_name,
        email=new_user.email,
        role=new_user.role.value
    )

import logging

logger = logging.getLogger(__name__)

@router.post("/login", response_model=TokenResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        logger.warning(f"Authentication failed: invalid credentials for email='{req.email.lower()}'.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    
    if not user.is_active:
        logger.warning(f"Authentication failed: account is inactive for email='{req.email.lower()}'.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is deactivated."
        )

    token = create_access_token(subject=user.id, role=user.role.value)
    logger.info(f"Successful authentication for user_id={user.id}, role={user.role.value}")

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role.value
    )

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out."}

@router.post("/forgot-password")
def forgot_password(payload: dict):
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    return {"message": f"If an account exists for {email}, password reset instructions have been dispatched."}

@router.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    return UserProfileResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        role=user.role.value,
        village=profile.village if profile else None,
        district=profile.district if profile else None,
        state=profile.state if profile else None,
        preferred_language=profile.preferred_language if profile else "en",
        created_at=user.created_at
    )

@router.patch("/language")
def update_language_preference(
    payload: dict,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lang = payload.get("language")
    if not lang or lang not in ["en", "mr", "hi"]:
        raise HTTPException(status_code=400, detail="Invalid language. Supported: en, mr, hi")
    
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        profile = UserProfile(user_id=user.id, preferred_language=lang)
        db.add(profile)
    else:
        profile.preferred_language = lang
    db.commit()
    return {"message": "Language preference updated successfully.", "language": lang}
