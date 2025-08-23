import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../courses/course.service';
import { TeacherService, DocenteDTO } from '../../teacher/teacher.service';

@Component({
  standalone: true,
  selector: 'app-admin-course-create',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Crear Curso</h2>
    <form (ngSubmit)="create()">
      <input [(ngModel)]="code" name="code" placeholder="Código" required />
      <input [(ngModel)]="name" name="name" placeholder="Nombre del curso" required />
      <input [(ngModel)]="start_date" name="start_date" type="date" required />
      <input [(ngModel)]="end_date" name="end_date" type="date" required />
      <input [(ngModel)]="hours" name="hours" type="number" min="1" required />

      <select [(ngModel)]="teacher_id" name="teacher_id" required>
        <option [ngValue]="null" disabled>Seleccione Docente</option>
        <option *ngFor="let t of docentes" [ngValue]="t.id">{{ t.full_name }} ({{ t.email }})</option>
      </select>

      <button type="submit">Crear</button>
    </form>
  `
})
export default class AdminCourseCreateComponent implements OnInit {
  private courseSvc = inject(CourseService);
  private teacherSvc = inject(TeacherService);

  docentes: DocenteDTO[] = [];
  code=''; name=''; start_date=''; end_date=''; hours=8; teacher_id: number|null = null;

  ngOnInit(){ this.teacherSvc.list().subscribe(d => this.docentes = d.filter(x => x.is_active)); }

  create(){
    if (!this.teacher_id) return;
    // Tu FastAPI espera created_by; úsalo como "teacher_id" de facto
    this.courseSvc.createCourse({
      code: this.code,
      name: this.name,
      start_date: this.start_date,
      end_date: this.end_date,
      hours: this.hours,
      created_by: this.teacher_id
    }).subscribe(() => {
      this.code=''; this.name=''; this.start_date=''; this.end_date=''; this.hours=8; this.teacher_id=null;
      alert('Curso creado');
    });
  }
}
