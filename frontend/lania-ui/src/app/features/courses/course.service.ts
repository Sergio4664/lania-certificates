// src/app/features/courses/course.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

export interface CourseDTO {
  id: number;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  hours: number;
  created_by: number; // en tu FastAPI esto hace de teacher_id actualmente
}

@Injectable({providedIn: 'root'})
export class CourseService {
  private http = inject(HttpClient);
  private base = environment.apiBase;

  listCourses() {
    return this.http.get<CourseDTO[]>(`${this.base}/api/admin/courses`);
  }

  createCourse(data: Partial<CourseDTO>) {
    return this.http.post<CourseDTO>(`${this.base}/api/admin/courses`, data);
  }

  // REQUIERE endpoint en FastAPI: PUT /api/admin/courses/:id/assign-teacher
  assignTeacher(courseId: number, teacher_id: number) {
    return this.http.put<{message:string}>(`${this.base}/api/admin/courses/${courseId}/assign-teacher`, { teacher_id });
  }

  // REQUIERE endpoint en FastAPI: GET /api/teacher/my-courses
  listMyCourses() {
    return this.http.get<CourseDTO[]>(`${this.base}/api/teacher/my-courses`);
  }
}

