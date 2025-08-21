# app/routers/admin_certificates.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.certificate import Certificate
from app.models.course import Course
from app.models.participant import Participant
from app.services.certificate_service import issue_certificate

router = APIRouter(prefix="/api/admin/certificates", tags=["admin-certificates"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/issue")
def issue(data: dict, db: Session = Depends(get_db)):
    course = db.query(Course).get(data["course_id"])
    part = db.query(Participant).get(data["participant_id"])
    if not course or not part:
        raise HTTPException(status_code=404, detail="Curso o participante inexistente")
    cert = Certificate(course_id=course.id, participant_id=part.id, kind=data["kind"])
    db.add(cert); db.commit(); db.refresh(cert)
    cert = issue_certificate(db, cert,
                             participant={"full_name": part.full_name},
                             course={"name": course.name, "hours": course.hours})
    return {"id": cert.id, "serial": cert.serial, "status": cert.status, "pdf_path": cert.pdf_path}
