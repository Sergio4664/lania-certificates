import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey, DateTime, Enum, Text, LargeBinary
from app.models.enums import Base, CertificateKind, CertificateStatus

class Certificate(Base):
    __tablename__ = "certificate"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("course.id"))
    participant_id: Mapped[int] = mapped_column(ForeignKey("participant.id"))
    kind: Mapped[CertificateKind] = mapped_column(Enum(CertificateKind, name="certificate_kind"))
    status: Mapped[CertificateStatus] = mapped_column(Enum(CertificateStatus, name="certificate_status"))
    serial: Mapped[str] = mapped_column(String, unique=True, index=True)
    qr_token: Mapped[str] = mapped_column(String, unique=True, index=True)
    pdf_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    pdf_content: Mapped[bytes | None] = mapped_column(LargeBinary, nullable=True)
    
    # Corrección: usar datetime.datetime y mapped_column(DateTime)
    issued_at: Mapped[datetime.datetime | None] = mapped_column(DateTime, nullable=True)
    updated_at: Mapped[datetime.datetime | None] = mapped_column(DateTime, nullable=True)