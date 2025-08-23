import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

export interface DocenteDTO {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

export interface CreateDocenteDTO {
  full_name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private http = inject(HttpClient);
  private base = environment.apiBase;

  // REQUIERE endpoint en FastAPI: GET /api/admin/teachers
  list() {
    return this.http.get<DocenteDTO[]>(`${this.base}/api/admin/teachers`);
  }

  // REQUIERE endpoint en FastAPI: POST /api/admin/teachers
  create(payload: CreateDocenteDTO) {
    return this.http.post<DocenteDTO>(`${this.base}/api/admin/teachers`, payload);
  }

  // REQUIERE endpoint en FastAPI: DELETE /api/admin/teachers/:id
  disable(id: number) {
    return this.http.delete<{message: string}>(`${this.base}/api/admin/teachers/${id}`);
  }
}
