# backend/app/models/association_tables.py
from sqlalchemy import Table, Column, BigInteger, ForeignKey
from app.models.enums import Base

# Tabla de asociación para many-to-many entre Course y User (docentes)
course_docente_association = Table(
    'course_docente',
    Base.metadata,
    Column('course_id', BigInteger, ForeignKey('course.id', ondelete='CASCADE'), primary_key=True),
    Column('teacher_id', BigInteger, ForeignKey('docente.id', ondelete='CASCADE'), primary_key=True)
)