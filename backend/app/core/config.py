import os
from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve absolute path to workspace root
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DEFAULT_SQLITE_PATH = BASE_DIR / "ruralbiz.db"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="allow")

    PROJECT_NAME: str = "RuralBiz AI — Intelligent Rural Business Advisory & Financial Planning"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-ruralbiz-sih-26091-jwt-encryption-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database - Normalize SQLite relative path to absolute workspace path
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{DEFAULT_SQLITE_PATH}"
    )
    
    # Administrator Bootstrap Details
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "riyamokale@gmail.com")
    ADMIN_NAME: str = os.getenv("ADMIN_NAME", "Riya")
    ADMIN_PHONE: str = os.getenv("ADMIN_PHONE", "9326577285")
    ADMIN_INITIAL_PASSWORD: str = os.getenv("ADMIN_INITIAL_PASSWORD", "AdminRuralBiz@2026")

    # Rural Entrepreneur Demo Account Details
    DEMO_USER_EMAIL: str = os.getenv("DEMO_USER_EMAIL", "ramesh.patil@ruralbiz.org")
    DEMO_USER_NAME: str = os.getenv("DEMO_USER_NAME", "Ramesh Patil")
    DEMO_USER_PHONE: str = os.getenv("DEMO_USER_PHONE", "9822334455")
    DEMO_USER_PASSWORD: str = os.getenv("DEMO_USER_PASSWORD", "RuralPass@2026")
    DEMO_USER_VILLAGE: str = os.getenv("DEMO_USER_VILLAGE", "Baramati Rural")
    DEMO_USER_DISTRICT: str = os.getenv("DEMO_USER_DISTRICT", "Pune")
    DEMO_USER_STATE: str = os.getenv("DEMO_USER_STATE", "Maharashtra")
    
    # AI Providers (LLM)
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY", None)
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    TOGETHER_API_KEY: Optional[str] = os.getenv("TOGETHER_API_KEY", None)
    TOGETHER_MODEL: str = os.getenv("TOGETHER_MODEL", "meta-llama/Meta-Llama-3-8B-Instruct-Lite")
    
    # Embeddings & RAG
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "BAAI/bge-m3")
    
    # Geospatial
    OVERPASS_URL: str = os.getenv("OVERPASS_URL", "https://overpass-api.de/api/interpreter")
    NOMINATIM_URL: str = os.getenv("NOMINATIM_URL", "https://nominatim.openstreetmap.org/search")
    
    # Bhashini Indic Voice API
    BHASHINI_API_KEY: Optional[str] = os.getenv("BHASHINI_API_KEY", None)
    BHASHINI_USER_ID: Optional[str] = os.getenv("BHASHINI_USER_ID", None)
    BHASHINI_BASE_URL: str = os.getenv("BHASHINI_BASE_URL", "https://dhruva-api.bhashini.gov.in/services/inference/pipeline")
    BHASHINI_PIPELINE_ID: Optional[str] = os.getenv("BHASHINI_PIPELINE_ID", None)
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
        "*"
    ]

# If DATABASE_URL is sqlite with relative path, normalize it
_db_env = os.getenv("DATABASE_URL")
if not _db_env or _db_env.startswith("sqlite:///./") or _db_env == "sqlite:///ruralbiz.db":
    _normalized_db = f"sqlite:///{DEFAULT_SQLITE_PATH}"
else:
    _normalized_db = _db_env

settings = Settings(DATABASE_URL=_normalized_db)
