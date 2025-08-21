# app/services/certificate_service.py
import secrets, base64
from datetime import datetime, timezone
from pathlib import Path
from app.models.certificate import Certificate
from app.models.enums import CertificateStatus
from app.services.qr_service import generate_qr_png
from app.services.pdf_service import render_html, html_to_pdf_bytes

PDF_DIR = Path("storage/pdfs"); PDF_DIR.mkdir(parents=True, exist_ok=True)

def template_by_kind(kind: str) -> str:
    return {
        "ASISTENCIA":"constancia_asistencia.html",
        "APROBACION":"constancia_aprobacion.html",
        "PARTICIPACION":"constancia_participacion.html",
        "DIPLOMADO":"constancia_diplomado.html",
        "TALLER":"constancia_taller.html"
    }[kind]

def issue_certificate(db, cert: Certificate, participant: dict, course: dict):
    cert.serial = cert.serial or f"LANIA-{secrets.token_hex(6).upper()}"
    cert.qr_token = cert.qr_token or secrets.token_urlsafe(24)

    qr_png = generate_qr_png(f"https://validar.lania.mx/c/{cert.qr_token}")
    qr_data_url = "data:image/png;base64," + base64.b64encode(qr_png).decode()

    html = render_html(template_by_kind(cert.kind), {
        "participante": participant["full_name"],
        "curso": course["name"],
        "horas": course["hours"],
        "fecha": datetime.now().strftime("%d/%m/%Y"),
        "serial": cert.serial,
        "qr_data_url": qr_data_url
    })
    pdf_bytes = html_to_pdf_bytes(html, css_files=[str(PDF_DIR.parents[1] / "app" / "templates" / "base.css")])
    path = PDF_DIR / f"{cert.serial}.pdf"
    path.write_bytes(pdf_bytes)

    cert.pdf_path = str(path)
    cert.status = CertificateStatus.LISTO_PARA_DESCARGAR
    cert.issued_at = datetime.now(timezone.utc)
    db.add(cert); db.commit(); db.refresh(cert)
    return cert
