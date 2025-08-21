# app/schemas/course.py
from pydantic import BaseModel
from datetime import date

class CourseBase(BaseModel):
    code: str
    name: str
    start_date: date
    end_date: date
    hours: int

class CourseCreate(CourseBase):
    created_by: int

class CourseUpdate(BaseModel):
    name: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    hours: int | None = None

class CourseOut(CourseBase):
    id: int
    created_by: int

    class Config:
        from_attributes = True
