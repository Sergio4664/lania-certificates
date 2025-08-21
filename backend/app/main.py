# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, admin_certificates, public_verify
from app.core.config import get_settings

settings = get_settings()
app = FastAPI(title="LANIA Certificaciones API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin_certificates.router)
app.include_router(public_verify.router)
