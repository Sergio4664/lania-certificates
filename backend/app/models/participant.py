# app/models/participant.py
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, BigInteger, DateTime
from sqlalchemy.dialects.postgresql import CITEXT
from datetime import datetime
from app.models.enums import Base

class Participant(Base):
    __tablename__ = "participant"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    email: Mapped[str] = mapped_column(CITEXT, unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(Text, nullable=False)
    phone: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    # Relaciones
    enrollments = relationship("Enrollment", back_populates="participant")
    certificates = relationship("Certificate", back_populates="participant")