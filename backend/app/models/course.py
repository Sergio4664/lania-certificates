# backend/app/models/course.py
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, Integer, Date, BigInteger, ForeignKey, Table, Column
from datetime import date
from app.models.enums import Base

# Tabla de asociación para many-to-many entre Course y User (docentes)
# IMPORTANTE: Definir la tabla antes de las clases que la usan
course_teacher_association = Table(
    'course_teacher',
    Base.metadata,
    Column('course_id', BigInteger, ForeignKey('course.id', ondelete='CASCADE'), primary_key=True),
    Column('teacher_id', BigInteger, ForeignKey('app_user.id', ondelete='CASCADE'), primary_key=True)
)

class Course(Base):
    __tablename__ = "course"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    code: Mapped[str] = mapped_column(Text, unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    # FIXED: Changed type annotation from str to date to match the Date column
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    hours: Mapped[int] = mapped_column(Integer, nullable=False)
    created_by: Mapped[int] = mapped_column(BigInteger, ForeignKey("app_user.id"), nullable=False)

    # Relaciones
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="course", cascade="all, delete-orphan")
    creator = relationship("User", back_populates="courses", foreign_keys=[created_by])
    
    # Relación many-to-many con docentes - SIMPLIFICADA
    teachers = relationship(
        "User",
        secondary=course_teacher_association,
        back_populates="teaching_courses"
    )