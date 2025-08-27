# backend/app/main.py
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import Base, engine

from app.routers import (
    auth, 
    admin_certificates, 
    admin_courses, 
    admin_participants, 
    admin_docentes,
    public_verify
)
from app.core.config import get_settings
from app.database import Base, engine

# Import all models to ensure they're registered with SQLAlchemy
from app.models import (
    user,
    participant,
    course,
    enrollment,
    certificate,
    enums,
    docente,
    association_tables
)

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuración
settings = get_settings()
app = FastAPI(title="LANIA Certificaciones API", version="0.2.0")

# Exception handler global
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Error no manejado en {request.url}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Error interno del servidor: {str(exc)}"}
    )

# Middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear las tablas en la base de datos (si no existen)
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Tablas de base de datos creadas/verificadas correctamente")
except Exception as e:
    logger.error(f"Error al crear tablas: {str(e)}")
    raise

# Endpoint raíz para verificar que la API está funcionando
@app.get("/")
def read_root():
    return {"message": "LANIA Certificaciones API v0.2.0", "status": "running"}

# Health check endpoint
@app.get("/health")
def health_check():
    try:
        # Probar conexión a la base de datos
        from app.db.session import SessionLocal
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "database": "disconnected", "error": str(e)}
        )

# Routers
app.include_router(auth.router)
app.include_router(admin_certificates.router)
app.include_router(admin_courses.router)
app.include_router(admin_participants.router)
app.include_router(admin_docentes.router)
app.include_router(public_verify.router)

