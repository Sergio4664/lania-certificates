# app/models/participant.py
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from app.models.enums import Base

class Participant(Base):
    __tablename__ = "participant"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    phone: Mapped[str | None]

    # relaciones opcionales
    enrollments = relationship("Enrollment", back_populates="participant")
    certificates = relationship("Certificate", back_populates="participant")
