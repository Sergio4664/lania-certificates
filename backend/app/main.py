# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, admin_certificates, admin_courses, admin_participants, public_verify
from app.core.config import get_settings
from app.database import Base, engine
from app.models import course, enrollment, enums, participant, user  # Incluir todos los modelos

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

# Endpoint raíz para verificar que la API está funcionando
@app.get("/")
def read_root():
    return {"message": "LANIA Certificaciones API v0.2.0", "status": "running"}

# Routers
app.include_router(auth.router)
app.include_router(admin_certificates.router)
app.include_router(admin_courses.router)  # ← ESTE FALTABA
app.include_router(admin_participants.router) # ← ESTE FALTABA
app.include_router(public_verify.router)
