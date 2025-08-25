@router.post("/{course_id}/assign-docente/{docente_id}")
def assign_docente(course_id: int, docente_id: int, db: Session = Depends(get_db)):
    relation = CourseTeacher(course_id=course_id, docente_id=docente_id)
    db.add(relation)
    db.commit()
    return {"message": "Docente asignado correctamente"}
