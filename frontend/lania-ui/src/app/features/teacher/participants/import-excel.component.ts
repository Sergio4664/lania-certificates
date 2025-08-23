import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantService } from '../../participants/participant.service';

@Component({
  standalone: true,
  selector: 'app-import-excel',
  imports: [CommonModule],
  template: `
    <div style="margin-top:1rem">
      <label>Importar Excel (.xlsx):
        <input type="file" (change)="onFile($event)" accept=".xlsx" />
      </label>
      <button (click)="upload()" [disabled]="!file">Subir</button>
    </div>
  `
})
export default class ImportExcelComponent {
  @Input() courseId!: number;
  @Output() uploaded = new EventEmitter<void>();
  private participantSvc = inject(ParticipantService);
  file: File | null = null;

  onFile(ev: Event){
    const input = ev.target as HTMLInputElement;
    this.file = input.files && input.files[0] ? input.files[0] : null;
  }

  upload(){
    if (!this.courseId || !this.file) return;
    this.participantSvc.importExcel(this.courseId, this.file)
      .subscribe(() => this.uploaded.emit());
  }
}
