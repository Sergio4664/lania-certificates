import { Component, OnInit } from '@angular/core';
import { TeacherService } from './teacher.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html'
})
export class TeacherComponent implements OnInit {
  docentes: any[] = [];
  newDocente = { nombre: '', email: '', telefono: '' };

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadDocentes();
  }

  loadDocentes() {
    this.teacherService.getDocentes().subscribe(data => {
      this.docentes = data;
    });
  }

  createDocente() {
    this.teacherService.createDocente(this.newDocente).subscribe(() => {
      this.newDocente = { nombre: '', email: '', telefono: '' };
      this.loadDocentes();
    });
  }
}
