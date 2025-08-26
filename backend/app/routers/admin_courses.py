# backend/app/routers/admin_courses.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.session import SessionLocal
from app.models.course import Course
from app.models.user import User
from app.schemas.course import CourseCreate, CourseUpdate, CourseOut
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/courses", tags=["admin-courses"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=CourseOut)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    try:
        # Crear el curso
        course_data = course.dict()
        teacher_ids = course_data.pop('teacher_ids', [])
        
        # Verificar que el creador existe y es válido
        creator = db.query(User).filter(
            User.id == course_data['created_by'],
            User.is_active == True
        ).first()
        
        if not creator:
            raise HTTPException(400, "El usuario creador no existe o no está activo")
        
        db_course = Course(**course_data)
        db.add(db_course)
        db.flush()  # Para obtener el ID sin hacer commit completo
        
        # Asignar docentes si se proporcionaron
        if teacher_ids:
            # Filtrar que sean docentes activos
            teachers = db.query(User).filter(
                User.id.in_(teacher_ids),
                User.role == "DOCENTE",
                User.is_active == True
            ).all()
            
            if len(teachers) != len(teacher_ids):
                db.rollback()
                found_ids = [t.id for t in teachers]
                missing_ids = [tid for tid in teacher_ids if tid not in found_ids]
                raise HTTPException(400, f"Docentes no encontrados o inactivos: {missing_ids}")
            
            # Asignar docentes al curso
            db_course.teachers.extend(teachers)
        
        db.commit()
        db.refresh(db_course)
        
        # Convertir a dict manualmente para incluir teachers
        result = CourseOut(
            id=db_course.id,
            code=db_course.code,
            name=db_course.name,
            start_date=db_course.start_date,
            end_date=db_course.end_date,
            hours=db_course.hours,
            created_by=db_course.created_by,
            teachers=[
                {
                    "id": teacher.id,
                    "full_name": teacher.full_name,
                    "email": teacher.email
                }
                for teacher in db_course.teachers
            ]
        )
        return result
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Error de integridad al crear curso: {str(e)}")
        if "duplicate key value violates unique constraint" in str(e):
            raise HTTPException(400, "Ya existe un curso con ese código")
        raise HTTPException(500, f"Error de integridad en la base de datos: {str(e)}")
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error inesperado al crear curso: {str(e)}")
        raise HTTPException(500, f"Error interno del servidor: {str(e)}")

@router.get("/")
def list_courses(db: Session = Depends(get_db)):
    try:
        courses = db.query(Course).all()
        result = []
        for course in courses:
            course_dict = {
                "id": course.id,
                "code": course.code,
                "name": course.name,
                "start_date": course.start_date.isoformat() if course.start_date else None,
                "end_date": course.end_date.isoformat() if course.end_date else None,
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
    except Exception as e:
        logger.error(f"Error al listar cursos: {str(e)}")
        raise HTTPException(500, f"Error interno del servidor: {str(e)}")

@router.get("/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db)):
    try:
        course = db.query(Course).get(course_id)
        if not course:
            raise HTTPException(404, "Curso no encontrado")
        
        return {
            "id": course.id,
            "code": course.code,
            "name": course.name,
            "start_date": course.start_date.isoformat(),
            "end_date": course.end_date.isoformat(),
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
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener curso {course_id}: {str(e)}")
        raise HTTPException(500, f"Error interno del servidor: {str(e)}")

@router.put("/{course_id}")
def update_course(course_id: int, data: CourseUpdate, db: Session = Depends(get_db)):
    try:
        course = db.query(Course).get(course_id)
        if not course:
            raise HTTPException(404, "Curso no encontrado")
        
        # Actualizar campos básicos
        update_data = data.dict(exclude_unset=True, exclude={'teacher_ids'})
        for field, value in update_data.items():
            setattr(course, field, value)
        
        # Actualizar docentes si se proporcionaron
        if data.teacher_ids is not None:
            # Obtener docentes activos
            teachers = db.query(User).filter(
                User.id.in_(data.teacher_ids),
                User.role == "DOCENTE",
                User.is_active == True
            ).all()
            
            if len(teachers) != len(data.teacher_ids):
                found_ids = [t.id for t in teachers]
                missing_ids = [tid for tid in data.teacher_ids if tid not in found_ids]
                raise HTTPException(400, f"Docentes no encontrados o inactivos: {missing_ids}")
            
            # Reemplazar la lista de docentes
            course.teachers.clear()
            course.teachers.extend(teachers)
        
        db.commit()
        db.refresh(course)
        
        return {
            "id": course.id,
            "code": course.code,
            "name": course.name,
            "start_date": course.start_date.isoformat(),
            "end_date": course.end_date.isoformat(),
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
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error al actualizar curso {course_id}: {str(e)}")
        raise HTTPException(500, f"Error interno del servidor: {str(e)}")

@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    try:
        course = db.query(Course).get(course_id)
        if not course:
            raise HTTPException(404, "Curso no encontrado")
        
        db.delete(course)
        db.commit()
        return {"message": "Curso eliminado correctamente"}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error al eliminar curso {course_id}: {str(e)}")
        raise HTTPException(500, f"Error interno del servidor: {str(e)}")