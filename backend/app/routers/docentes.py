from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.docente import Docente

router = APIRouter(prefix="/docentes", tags=["Docentes"])

@router.post("/")
def create_docente(nombre: str, email: str, telefono: str = None, db: Session = Depends(get_db)):
    docente = Docente(nombre=nombre, email=email, telefono=telefono)
    db.add(docente)
    db.commit()
    db.refresh(docente)
    return docente

@router.get("/")
def list_docentes(db: Session = Depends(get_db)):
    return db.query(Docente).all()
