import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantService, ParticipantDTO } from '../../participants/participant.service';
import ImportExcelComponent from './import-excel.component';

@Component({
  standalone: true,
  selector: 'app-course-participants',
  imports: [CommonModule, FormsModule, ImportExcelComponent],
  template: `
    <div>
      <h3>Participantes del curso #{{courseId}}</h3>

      <form (ngSubmit)="add()">
        <input [(ngModel)]="full_name" name="full_name" placeholder="Nombre completo" required />
        <input [(ngModel)]="email" name="email" type="email" placeholder="Correo" required />
        <input [(ngModel)]="phone" name="phone" placeholder="Teléfono" />
        <button type="submit">Agregar</button>
      </form>

      <app-import-excel [courseId]="courseId" (uploaded)="reload()"></app-import-excel>

      <ul>
        <li *ngFor="let p of participants">
          {{p.full_name}} - {{p.email}} <span *ngIf="p.phone">({{p.phone}})</span>
        </li>
      </ul>
    </div>
  `
})
export default class CourseParticipantsComponent implements OnChanges {
  @Input() courseId!: number;
  private participantSvc = inject(ParticipantService);
  participants: ParticipantDTO[] = [];

  full_name=''; email=''; phone='';

  ngOnChanges(){ this.reload(); }

  reload(){
    if (!this.courseId) return;
    this.participantSvc.listByCourse(this.courseId).subscribe(rows => this.participants = rows);
  }

  add(){
    this.participantSvc.addToCourse(this.courseId, { full_name: this.full_name, email: this.email, phone: this.phone || undefined })
      .subscribe(() => { this.full_name=''; this.email=''; this.phone=''; this.reload(); });
  }
}
