# app/services/certificate_service.py
from datetime import date
from app.services.pdf_service import generate_certificate_pdf
from app.models.certificate import Certificate
from app.database import SessionLocal

def issue_certificate(participant_id: int, course_id: int, hours: int) -> Certificate:
    """
    Genera un certificado para un participante y lo guarda en la base de datos.
    Retorna el objeto Certificate.
    """

    db = SessionLocal()

    # Simulación: buscar nombres desde la BD (simplificado)
    participant_name = f"Participante {participant_id}"
    course_name = f"Curso {course_id}"

    # Generar el PDF en memoria
    pdf_bytes = generate_certificate_pdf(
        participant_name=participant_name,
        course_name=course_name,
        hours=hours,
        issue_date=date.today()
    )

    # Crear registro en la tabla certificate
    cert = Certificate(
        participant_id=participant_id,
        course_id=course_id,
        pdf_content=pdf_bytes,   # 👈 asegúrate de que el modelo tenga este campo (tipo LargeBinary)
        issue_date=date.today()
    )

    db.add(cert)
    db.commit()
    db.refresh(cert)
    db.close()

    return cert
