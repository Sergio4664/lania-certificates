import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = `${environment.apiUrl}/docentes`;

  constructor(private http: HttpClient) {}

  getDocentes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createDocente(docente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, docente);
  }
}
