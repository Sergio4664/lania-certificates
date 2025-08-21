# app/models/enrollment.py
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import BigInteger, ForeignKey, UniqueConstraint
from app.models.enums import Base

class Enrollment(Base):
    __tablename__ = "enrollment"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    course_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("course.id", ondelete="CASCADE"), nullable=False)
    participant_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("participant.id", ondelete="CASCADE"), nullable=False)

    # Constraint único para evitar duplicados
    __table_args__ = (UniqueConstraint('course_id', 'participant_id', name='enrollment_course_id_participant_id_key'),)

    # Relaciones
    course = relationship("Course", back_populates="enrollments")
    participant = relationship("Participant", back_populates="enrollments")