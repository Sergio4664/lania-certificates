# backend/app/routers/admin_courses.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.course import Course
from app.models.user import User
from app.schemas.course import CourseCreate, CourseUpdate, CourseOut

router = APIRouter(prefix="/api/admin/courses", tags=["admin-courses"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=CourseOut)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    # Crear el curso
    course_data = course.dict()
    teacher_ids = course_data.pop('teacher_ids', [])
    
    db_course = Course(**course_data)
    db.add(db_course)
    db.flush()  # Para obtener el ID sin hacer commit
    
    # Asignar docentes si se proporcionaron
    if teacher_ids:
        teachers = db.query(User).filter(
            User.id.in_(teacher_ids),
            User.role == "DOCENTE",
            User.is_active == True
        ).all()
        
        if len(teachers) != len(teacher_ids):
            db.rollback()
            raise HTTPException(400, "Uno o más docentes no existen o no están activos")
        
        db_course.teachers = teachers
    
    db.commit()
    db.refresh(db_course)
    return db_course

@router.get("/")
def list_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    result = []
    for course in courses:
        course_dict = {
            "id": course.id,
            "code": course.code,
            "name": course.name,
            "start_date": course.start_date,
            "end_date": course.end_date,
            "hours": course.hours,
            "created_by": course.created_by,
            "teachers": [
                {
                    "id": teacher.id,
                    "full_name": teacher.full_name,
                    "email": teacher.email
                }
                for teacher in course.teachers
            ]
        }
        result.append(course_dict)
    return result

@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).get(course_id)
    if not course:
        raise HTTPException(404, "Curso no encontrado")
    return course

@router.put("/{course_id}")
def update_course(course_id: int, data: CourseUpdate, db: Session = Depends(get_db)):
    course = db.query(Course).get(course_id)
    if not course:
        raise HTTPException(404, "Curso no encontrado")
    
    # Actualizar campos básicos
    update_data = data.dict(exclude_unset=True, exclude={'teacher_ids'})
    for field, value in update_data.items():
        setattr(course, field, value)
    
    # Actualizar docentes si se proporcionaron
    if data.teacher_ids is not None:
        teachers = db.query(User).filter(
            User.id.in_(data.teacher_ids),
            User.role == "DOCENTE",
            User.is_active == True
        ).all()
        
        if len(teachers) != len(data.teacher_ids):
            raise HTTPException(400, "Uno o más docentes no existen o no están activos")
        
        course.teachers = teachers
    
    db.commit()
    db.refresh(course)
    return course

@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).get(course_id)
    if not course:
        raise HTTPException(404, "Curso no encontrado")
    db.delete(course)
    db.commit()
    return {"message": "Curso eliminado"}