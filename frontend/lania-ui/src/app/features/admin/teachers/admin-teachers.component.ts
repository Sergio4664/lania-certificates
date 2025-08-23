import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherService, DocenteDTO, CreateDocenteDTO } from '../../teacher/teacher.service';

@Component({
  standalone: true,
  selector: 'app-admin-teachers',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Gestión de Docentes</h2>

    <form (ngSubmit)="create()">
      <input [(ngModel)]="form.full_name" name="full_name" placeholder="Nombre completo" required />
      <input [(ngModel)]="form.email" name="email" type="email" placeholder="Correo" required />
      <input [(ngModel)]="form.password" name="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Crear docente</button>
    </form>

    <hr />

    <ul>
      <li *ngFor="let d of docentes">
        {{d.full_name}} ({{d.email}}) - <strong>{{ d.is_active ? 'Activo' : 'Inactivo' }}</strong>
        <button (click)="disable(d.id)" [disabled]="!d.is_active">Desactivar</button>
      </li>
    </ul>
  `
})
export default class AdminTeachersComponent implements OnInit {
  private teacherSvc = inject(TeacherService);
  docentes: DocenteDTO[] = [];

  form: CreateDocenteDTO = { full_name: '', email: '', password: '' };

  ngOnInit(){ this.load(); }

  load(){
    this.teacherSvc.list().subscribe((rows) => this.docentes = rows);
  }

  create(){
    this.teacherSvc.create(this.form).subscribe(() => {
      this.form = { full_name: '', email: '', password: '' };
      this.load();
    });
  }

  disable(id: number){
    this.teacherSvc.disable(id).subscribe(() => this.load());
  }
}
