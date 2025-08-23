import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService, CourseDTO } from '../courses/course.service';
import CourseParticipantsComponent from './participants/course-participants.component';

@Component({
  standalone: true,
  selector: 'app-my-courses',
  imports: [CommonModule, CourseParticipantsComponent],
  template: `
    <h2>Mis cursos</h2>
    <ul>
      <li *ngFor="let c of courses" (click)="select(c)" style="cursor:pointer">
        {{c.code}} - {{c.name}} ({{c.start_date}} → {{c.end_date}})
      </li>
    </ul>

    <app-course-participants *ngIf="selected" [courseId]="selected.id"></app-course-participants>
  `
})
export default class MyCoursesComponent implements OnInit {
  private courseSvc = inject(CourseService);
  courses: CourseDTO[] = [];
  selected: CourseDTO | null = null;

  ngOnInit(){ this.courseSvc.listMyCourses().subscribe(cs => this.courses = cs); }
  select(c: CourseDTO){ this.selected = c; }
}
