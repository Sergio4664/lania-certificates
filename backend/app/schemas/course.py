# backend/app/schemas/course.py
from pydantic import BaseModel
from datetime import date
from typing import Optional, List

class TeacherInfo(BaseModel):
    """Información básica del docente para mostrar en los cursos"""
    id: int
    full_name: str
    email: str

class CourseBase(BaseModel):
    code: str
    name: str
    start_date: date
    end_date: date
    hours: int

class CourseCreate(CourseBase):
    created_by: int
    teacher_ids: Optional[List[int]] = []  # Lista de IDs de docentes asignados

class CourseUpdate(BaseModel):
    name: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    hours: int | None = None
    teacher_ids: Optional[List[int]] = None

class CourseOut(CourseBase):
    id: int
    created_by: int
    teachers: Optional[List[TeacherInfo]] = []  # Lista de docentes asignados

    class Config:
        from_attributes = True