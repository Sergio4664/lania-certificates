from sqlalchemy import Column, Integer, ForeignKey
from app.database import Base

class CourseTeacher(Base):
    __tablename__ = "course_teacher"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("course.id", ondelete="CASCADE"))
    docente_id = Column(Integer, ForeignKey("docentes.id", ondelete="CASCADE"))
