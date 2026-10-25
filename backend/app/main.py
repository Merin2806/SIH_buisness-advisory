import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import SessionLocal
from app.initial_data import init_db
from app.api.v1 import api_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ruralbiz_app")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables and bootstrap admin
    logger.info("Starting up RuralBiz AI Backend...")
    db = SessionLocal()
    try:
        init_db(db)
        logger.info("Bootstrap initialization complete.")
    finally:
        db.close()
    yield
    logger.info("Shutting down RuralBiz AI Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend REST API for RuralBiz AI: Intelligent Rural Business Advisory & Financial Planning (SIH Problem Statement 26091)",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please verify your request parameters."}
    )

# Health Checks
@app.get("/health", tags=["Health"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": settings.DATABASE_URL.split(":")[0]
    }

# Mount API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)
