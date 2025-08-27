from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Docente(Base):
    __tablename__ = "docentes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    apellidos = Column(String(150), nullable=False) 
    email = Column(String(150), unique=True, index=True, nullable=False)
    telefono = Column(String(20), nullable=True)
    especialidad = Column(String(150), nullable=True)
    fecha_registro = Column(DateTime, default=func.now())
    is_active = Column(Boolean, default=True)
    