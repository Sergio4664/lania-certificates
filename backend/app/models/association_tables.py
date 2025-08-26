# backend/app/models/association_tables.py
from sqlalchemy import Table, Column, BigInteger, ForeignKey
from app.models.enums import Base

# Tabla de asociación para many-to-many entre Course y User (docentes)
course_teacher_association = Table(
    'course_teacher',
    Base.metadata,
    Column('course_id', BigInteger, ForeignKey('course.id', ondelete='CASCADE'), primary_key=True),
    Column('teacher_id', BigInteger, ForeignKey('app_user.id', ondelete='CASCADE'), primary_key=True)
)