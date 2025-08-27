# backend/app/schemas/docente.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class DocenteBase(BaseModel):
    nombre: str
    apellidos: str
    email: EmailStr
    telefono: Optional[str] = None
    especialidad: Optional[str] = None

class DocenteCreate(DocenteBase):
    """Schema para crear un docente"""
    pass

class DocenteUpdate(BaseModel):
    """Schema para actualizar un docente (todos los campos opcionales)"""
    nombre: Optional[str] = None
    apellidos: Optional[str] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    especialidad: Optional[str] = None
    is_active: Optional[bool] = None

class DocenteInfo(BaseModel):
    """Información básica del docente para mostrar en los cursos"""
    id: int
    nombre: str
    apellidos: str
    email: str
    especialidad: Optional[str] = None
    
    @property
    def full_name(self) -> str:
        return f"{self.nombre} {self.apellidos}"

class DocenteOut(DocenteBase):
    """Schema para respuesta con los datos del docente"""
    id: int
    is_active: bool
    fecha_registro: datetime
    
    @property 
    def full_name(self) -> str:
        return f"{self.nombre} {self.apellidos}"

    class Config:
        from_attributes = True