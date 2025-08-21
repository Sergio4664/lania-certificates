# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, admin_certificates, public_verify
from app.core.config import get_settings
from app.database import Base, engine  # 👈 conexión a BD
from app.models import certificate, participant, course  # 👈 importa los modelos

# Configuración
settings = get_settings()
app = FastAPI(title="LANIA Certificaciones API", version="0.2.0")

# Middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear las tablas en la base de datos (si no existen)
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth.router)
app.include_router(admin_certificates.router)
app.include_router(public_verify.router)
