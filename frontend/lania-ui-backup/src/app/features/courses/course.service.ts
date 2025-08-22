// src/app/features/courses/course.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class CourseService {
  private http = inject(HttpClient);

  listCourses() {
    return this.http.get(`${environment.apiBase}/api/admin/courses`);
  }

  createCourse(data: any) {
    return this.http.post(`${environment.apiBase}/api/admin/courses`, data);
  }
}
