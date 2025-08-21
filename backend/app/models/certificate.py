# app/models/certificate.py (CORREGIDO COMPLETAMENTE)
import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, BigInteger, ForeignKey, DateTime, Enum, LargeBinary
from app.models.enums import Base, CertificateKind, CertificateStatus

class Certificate(Base):
    __tablename__ = "certificate"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    course_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("course.id", ondelete="CASCADE"), nullable=False)
    participant_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("participant.id", ondelete="CASCADE"), nullable=False)
    kind: Mapped[CertificateKind] = mapped_column(Enum(CertificateKind, name="certificate_kind"), nullable=False)
    status: Mapped[CertificateStatus] = mapped_column(
        Enum(CertificateStatus, name="certificate_status"), 
        nullable=False, 
        default=CertificateStatus.EN_PROCESO
    )
    serial: Mapped[str] = mapped_column(Text, unique=True, index=True, nullable=False)
    qr_token: Mapped[str] = mapped_column(Text, unique=True, index=True, nullable=False)
    pdf_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    # AGREGAMOS el campo que falta en la BD pero que necesitamos
    pdf_content: Mapped[bytes | None] = mapped_column(LargeBinary, nullable=True)
    issued_at: Mapped[datetime.datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.datetime.utcnow)

    # Relaciones
    course = relationship("Course", back_populates="certificates")
    participant = relationship("Participant", back_populates="certificates")
