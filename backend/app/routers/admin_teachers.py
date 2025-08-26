# backend/app/routers/admin_teachers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password
from pydantic import BaseModel, EmailStr
from typing import List

router = APIRouter(prefix="/api/admin/teachers", tags=["admin-teachers"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TeacherCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class TeacherOut(BaseModel):
    id: int
    full_name: str
    email: str
    is_active: bool
    role: str

    class Config:
        from_attributes = True

@router.post("/", response_model=TeacherOut)
def create_teacher(teacher: TeacherCreate, db: Session = Depends(get_db)):
    """Crear un nuevo docente como usuario con rol DOCENTE"""
    # Verificar si ya existe el email
    existing = db.query(User).filter(User.email == teacher.email).first()
    if existing:
        raise HTTPException(400, "Ya existe un usuario con ese email")
    
    # Crear usuario con rol DOCENTE
    db_teacher = User(
        email=teacher.email,
        full_name=teacher.full_name,
        role="DOCENTE",
        password_hash=hash_password(teacher.password),
        is_active=True
    )
    
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher

@router.get("/", response_model=List[TeacherOut])
def list_teachers(db: Session = Depends(get_db)):
    """Listar todos los docentes (usuarios con rol DOCENTE)"""
    return db.query(User).filter(User.role == "DOCENTE").all()

@router.delete("/{teacher_id}")
def disable_teacher(teacher_id: int, db: Session = Depends(get_db)):
    """Desactivar un docente"""
    teacher = db.query(User).filter(
        User.id == teacher_id,
        User.role == "DOCENTE"
    ).first()
    
    if not teacher:
        raise HTTPException(404, "Docente no encontrado")
    
    teacher.is_active = False
    db.commit()
    return {"message": "Docente desactivado correctamente"}