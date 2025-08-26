import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Teacher {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
}

interface Course {
  id: number;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  hours: number;
  created_by: number;
  teachers?: Teacher[];
}

interface Participant {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
}

interface Certificate {
  id: number;
  serial: string;
  kind: string;
  status: string;
  course_name: string;
  participant_name: string;
  issued_at?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo">
              <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="25" fill="url(#gradient)" stroke="#e74c3c" stroke-width="2"/>
                <text x="30" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">L</text>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#e74c3c;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#c0392b;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1>LANIA - Certificaciones</h1>
              <p>Sistema de Gestión de Certificados</p>
            </div>
          </div>
          <div class="user-section">
            <span>Bienvenido, Admin</span>
            <button (click)="logout()" class="logout-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="dashboard-main">
        <!-- Sidebar -->
        <nav class="sidebar">
          <div class="nav-item" 
               [class.active]="activeModule === 'overview'" 
               (click)="setActiveModule('overview')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
            Dashboard
          </div>
          <div class="nav-item" 
               [class.active]="activeModule === 'teachers'" 
               (click)="setActiveModule('teachers')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M5.5 21a7.5 7.5 0 0 1 13 0"></path>
            </svg>
            Docentes
          </div>
          <div class="nav-item" 
               [class.active]="activeModule === 'courses'" 
               (click)="setActiveModule('courses')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Cursos
          </div>
          <div class="nav-item" 
               [class.active]="activeModule === 'participants'" 
               (click)="setActiveModule('participants')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Participantes
          </div>
          <div class="nav-item" 
               [class.active]="activeModule === 'certificates'" 
               (click)="setActiveModule('certificates')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
            Certificados
          </div>
        </nav>

        <!-- Content Area -->
        <div class="content-area">
          <!-- Overview Module -->
          <div *ngIf="activeModule === 'overview'" class="module-content">
            <h2>Panel de Control</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon courses">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>{{courses.length}}</h3>
                  <p>Cursos Activos</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon participants">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>{{participants.length}}</h3>
                  <p>Participantes</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon certificates">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>{{certificates.length}}</h3>
                  <p>Certificados</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon teachers">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M5.5 21a7.5 7.5 0 0 1 13 0"></path>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>{{teachers.length}}</h3>
                  <p>Docentes</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Teachers Module -->
          <div *ngIf="activeModule === 'teachers'" class="module-content">
            <div class="module-header">
              <h2>Gestión de Docentes</h2>
              <button class="primary-btn" (click)="showTeacherForm = !showTeacherForm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nuevo Docente
              </button>
            </div>

            <!-- Teacher Form -->
            <div *ngIf="showTeacherForm" class="form-card">
              <h3>Registrar Docente</h3>
              <form (ngSubmit)="createTeacher()" class="form-grid">
                <div class="form-group">
                  <label>Nombre Completo</label>
                  <input [(ngModel)]="newTeacher.full_name" name="full_name" required>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" [(ngModel)]="newTeacher.email" name="email" required>
                </div>
                <div class="form-group">
                  <label>Contraseña</label>
                  <input type="password" [(ngModel)]="newTeacher.password" name="password" required>
                </div>
                <div class="form-actions">
                  <button type="button" class="secondary-btn" (click)="showTeacherForm = false">Cancelar</button>
                  <button type="submit" class="primary-btn">Crear Docente</button>
                </div>
              </form>
            </div>

            <!-- Teachers Table -->
            <div class="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let teacher of teachers">
                    <td>{{teacher.full_name}}</td>
                    <td>{{teacher.email}}</td>
                    <td>
                      <span class="status" [class]="teacher.is_active ? 'status-active' : 'status-inactive'">
                        {{teacher.is_active ? 'Activo' : 'Inactivo'}}
                      </span>
                    </td>
                    <td>
                      <button class="icon-btn delete" 
                              (click)="disableTeacher(teacher.id)" 
                              [disabled]="!teacher.is_active"
                              title="Desactivar docente">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 6L6 18"></path>
                          <path d="M6 6l12 12"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Courses Module -->
          <div *ngIf="activeModule === 'courses'" class="module-content">
            <div class="module-header">
              <h2>Gestión de Cursos</h2>
              <button class="primary-btn" (click)="showCourseForm = !showCourseForm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nuevo Curso
              </button>
            </div>

            <!-- Course Form -->
            <div *ngIf="showCourseForm" class="form-card">
              <h3>Crear Nuevo Curso</h3>
              <form (ngSubmit)="createCourse()" class="form-grid">
                <div class="form-group">
                  <label>Código del Curso</label>
                  <input [(ngModel)]="newCourse.code" name="code" required>
                </div>
                <div class="form-group">
                  <label>Nombre del Curso</label>
                  <input [(ngModel)]="newCourse.name" name="name" required>
                </div>
                <div class="form-group">
                  <label>Fecha de Inicio</label>
                  <input type="date" [(ngModel)]="newCourse.start_date" name="start_date" required>
                </div>
                <div class="form-group">
                  <label>Fecha de Fin</label>
                  <input type="date" [(ngModel)]="newCourse.end_date" name="end_date" required>
                </div>
                <div class="form-group">
                  <label>Horas</label>
                  <input type="number" [(ngModel)]="newCourse.hours" name="hours" required>
                </div>
                <div class="form-group full-width">
                  <label>Docentes Asignados</label>
                  <div class="teachers-selection">
                    <div class="teachers-checkboxes">
                      <div class="checkbox-item" *ngFor="let teacher of activeTeachers">
                        <input 
                          type="checkbox" 
                          [id]="'teacher-' + teacher.id"
                          [checked]="isTeacherSelected(teacher.id)"
                          (change)="toggleTeacherSelection(teacher.id, $event)"
                        >
                        <label [for]="'teacher-' + teacher.id">
                          {{teacher.full_name}}
                          <small>({{teacher.email}})</small>
                        </label>
                      </div>
                    </div>
                    <div class="selected-teachers" *ngIf="selectedTeacherIds.length > 0">
                      <h4>Docentes seleccionados:</h4>
                      <div class="teacher-tags">
                        <span class="teacher-tag" *ngFor="let teacherId of selectedTeacherIds">
                          {{getTeacherName(teacherId)}}
                          <button type="button" (click)="removeTeacher(teacherId)" class="remove-tag">×</button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-actions">
                  <button type="button" class="secondary-btn" (click)="showCourseForm = false">Cancelar</button>
                  <button type="submit" class="primary-btn">Crear Curso</button>
                </div>
              </form>
            </div>

            <!-- Courses Table -->
            <div class="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Horas</th>
                    <th>Docentes</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let course of courses">
                    <td>{{course.code}}</td>
                    <td>{{course.name}}</td>
                    <td>{{course.start_date | date:'dd/MM/yyyy'}}</td>
                    <td>{{course.end_date | date:'dd/MM/yyyy'}}</td>
                    <td>{{course.hours}}h</td>
                    <td>
                      <div class="teachers-list" *ngIf="course.teachers && course.teachers.length > 0; else noTeachers">
                        <span class="teacher-tag" *ngFor="let teacher of course.teachers">
                          {{teacher.full_name}}
                        </span>
                      </div>
                      <ng-template #noTeachers>
                        <span class="no-teachers">Sin docente asignado</span>
                      </ng-template>
                    </td>
                    <td>
                      <button class="icon-btn edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Participants Module -->
          <div *ngIf="activeModule === 'participants'" class="module-content">
            <div class="module-header">
              <h2>Gestión de Participantes</h2>
              <button class="primary-btn" (click)="showParticipantForm = !showParticipantForm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nuevo Participante
              </button>
            </div>

            <!-- Participant Form -->
            <div *ngIf="showParticipantForm" class="form-card">
              <h3>Registrar Participante</h3>
              <form (ngSubmit)="createParticipant()" class="form-grid">
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" [(ngModel)]="newParticipant.email" name="email" required>
                </div>
                <div class="form-group">
                  <label>Nombre Completo</label>
                  <input [(ngModel)]="newParticipant.full_name" name="full_name" required>
                </div>
                <div class="form-group">
                  <label>Teléfono</label>
                  <input [(ngModel)]="newParticipant.phone" name="phone">
                </div>
                <div class="form-actions">
                  <button type="button" class="secondary-btn" (click)="showParticipantForm = false">Cancelar</button>
                  <button type="submit" class="primary-btn">Registrar</button>
                </div>
              </form>
            </div>

            <!-- Participants Table -->
            <div class="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let participant of participants">
                    <td>{{participant.full_name}}</td>
                    <td>{{participant.email}}</td>
                    <td>{{participant.phone || 'N/A'}}</td>
                    <td>{{participant.created_at | date:'dd/MM/yyyy'}}</td>
                    <td>
                      <button class="icon-btn edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Certificates Module -->
          <div *ngIf="activeModule === 'certificates'" class="module-content">
            <div class="module-header">
              <h2>Gestión de Certificados</h2>
              <button class="primary-btn" (click)="showCertificateForm = !showCertificateForm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Emitir Certificado
              </button>
            </div>

            <!-- Certificate Form -->
            <div *ngIf="showCertificateForm" class="form-card">
              <h3>Emitir Certificado</h3>
              <form (ngSubmit)="createCertificate()" class="form-grid">
                <div class="form-group">
                  <label>Curso</label>
                  <select [(ngModel)]="newCertificate.course_id" name="course_id" required>
                    <option value="">Seleccionar curso...</option>
                    <option *ngFor="let course of courses" [value]="course.id">
                      {{course.name}}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Participante</label>
                  <select [(ngModel)]="newCertificate.participant_id" name="participant_id" required>
                    <option value="">Seleccionar participante...</option>
                    <option *ngFor="let participant of participants" [value]="participant.id">
                      {{participant.full_name}}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Tipo de Certificado</label>
                  <select [(ngModel)]="newCertificate.kind" name="kind" required>
                    <option value="">Seleccionar tipo...</option>
                    <option value="APROBACION">Aprobación</option>
                    <option value="ASISTENCIA">Asistencia</option>
                    <option value="PARTICIPACION">Participación</option>
                    <option value="DIPLOMADO">Diplomado</option>
                    <option value="TALLER">Taller</option>
                  </select>
                </div>
                <div class="form-actions">
                  <button type="button" class="secondary-btn" (click)="showCertificateForm = false">Cancelar</button>
                  <button type="submit" class="primary-btn">Emitir Certificado</button>
                </div>
              </form>
            </div>

            <!-- Certificates Table -->
            <div class="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial</th>
                    <th>Participante</th>
                    <th>Curso</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let certificate of certificates">
                    <td class="serial">{{certificate.serial}}</td>
                    <td>{{certificate.participant_name}}</td>
                    <td>{{certificate.course_name}}</td>
                    <td>
                      <span class="badge" [class]="'badge-' + certificate.kind.toLowerCase()">
                        {{certificate.kind}}
                      </span>
                    </td>
                    <td>
                      <span class="status" [class]="'status-' + certificate.status.toLowerCase().replace('_', '-')">
                        {{certificate.status.replace('_', ' ')}}
                      </span>
                    </td>
                    <td>{{certificate.issued_at || 'Pendiente'}}</td>
                    <td>
                      <button class="icon-btn download" 
                              *ngIf="certificate.status === 'LISTO_PARA_DESCARGAR'"
                              (click)="downloadCertificate(certificate.serial)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7,10 12,15 17,10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f8fafc;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Header Styles */
    .dashboard-header {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-section h1 {
      color: #e74c3c;
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }

    .logo-section p {
      color: #64748b;
      margin: 0;
      font-size: 14px;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 16px;
      color: #475569;
      font-weight: 500;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }

    .logout-btn:hover {
      background: #dc2626;
    }

    /* Main Layout */
    .dashboard-main {
      display: flex;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 80px);
    }

    /* Sidebar */
    .sidebar {
      width: 240px;
      background: white;
      border-right: 1px solid #e2e8f0;
      padding: 24px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
      cursor: pointer;
      color: #64748b;
      font-weight: 500;
      transition: all 0.2s;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .nav-item.active {
      background: #eff6ff;
      color: #2563eb;
      border-left-color: #2563eb;
    }

    /* Content Area */
    .content-area {
      flex: 1;
      padding: 24px;
    }

    .module-content h2 {
      color: #1e293b;
      margin: 0 0 24px 0;
      font-size: 28px;
      font-weight: 600;
    }

    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.courses { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.participants { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.certificates { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.teachers { background: linear-gradient(135deg, #96fbc4 0%, #f9f586 100%); }

    .stat-info h3 {
      font-size: 32px;
      font-weight: bold;
      margin: 0;
      color: #1e293b;
    }

    .stat-info p {
      margin: 4px 0 0 0;
      color: #64748b;
      font-weight: 500;
    }

    /* Forms */
    .form-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .form-card h3 {
      color: #1e293b;
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      color: #374151;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .form-group input,
    .form-group select {
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #3b82f6;
    }

    /* Teachers Selection */
    .teachers-selection {
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      background: #f9fafb;
    }

    .teachers-checkboxes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }

    .checkbox-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .checkbox-item input[type="checkbox"] {
      margin: 0;
      margin-top: 2px;
      transform: scale(1.2);
    }

    .checkbox-item label {
      margin: 0;
      cursor: pointer;
      flex: 1;
      font-weight: 500;
      color: #1f2937;
    }

    .checkbox-item label small {
      display: block;
      color: #6b7280;
      font-weight: normal;
      font-size: 12px;
      margin-top: 2px;
    }

    .selected-teachers {
      border-top: 1px solid #e5e7eb;
      padding-top: 16px;
    }

    .selected-teachers h4 {
      color: #374151;
      font-size: 14px;
      margin: 0 0 8px 0;
    }

    .teacher-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .teacher-tag {
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .remove-tag {
      background: none;
      border: none;
      color: #ef4444;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      padding: 0;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .remove-tag:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 12px;
      grid-column: 1 / -1;
      margin-top: 8px;
    }

    /* Buttons */
    .primary-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .primary-btn:hover {
      transform: translateY(-1px);
    }

    .secondary-btn {
      background: #f1f5f9;
      color: #64748b;
      border: 1px solid #e2e8f0;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .secondary-btn:hover {
      background: #e2e8f0;
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .icon-btn.edit {
      background: #fef3c7;
      color: #d97706;
    }

    .icon-btn.edit:hover {
      background: #fde68a;
    }

    .icon-btn.download {
      background: #dcfce7;
      color: #16a34a;
    }

    .icon-btn.download:hover {
      background: #bbf7d0;
    }

    .icon-btn.delete {
      background: #fecaca;
      color: #dc2626;
    }

    .icon-btn.delete:hover:not(:disabled) {
      background: #fca5a5;
    }

    .icon-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #f1f5f9 !important;
      color: #9ca3af !important;
    }

    .icon-btn:disabled:hover {
      background: #f1f5f9 !important;
      transform: none !important;
    }

    /* Tables */
    .data-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .data-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background: #f8fafc;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e2e8f0;
    }

    .data-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      color: #64748b;
    }

    .data-table tbody tr:hover {
      background: #f8fafc;
    }

    .serial {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: #1e293b;
    }

    /* Teachers display in table */
    .teachers-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .no-teachers {
      color: #9ca3af;
      font-style: italic;
      font-size: 12px;
    }

    /* Badges and Status */
    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-aprobacion { background: #dcfce7; color: #16a34a; }
    .badge-asistencia { background: #dbeafe; color: #2563eb; }
    .badge-participacion { background: #fef3c7; color: #d97706; }
    .badge-diplomado { background: #f3e8ff; color: #9333ea; }
    .badge-taller { background: #fce7f3; color: #ec4899; }

    .status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-en-proceso { background: #fef3c7; color: #d97706; }
    .status-listo-para-descargar { background: #dcfce7; color: #16a34a; }
    .status-revocado { background: #fecaca; color: #dc2626; }

    /* Status indicators for teachers */
    .status-active {
      background: #dcfce7;
      color: #16a34a;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-inactive {
      background: #fecaca;
      color: #dc2626;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-main {
        flex-direction: column;
      }
      
      .sidebar {
        width: 100%;
        display: flex;
        overflow-x: auto;
        padding: 12px 0;
      }
      
      .nav-item {
        white-space: nowrap;
        min-width: 120px;
        border-left: none;
        border-bottom: 3px solid transparent;
      }
      
      .nav-item.active {
        border-left: none;
        border-bottom-color: #2563eb;
      }
      
      .content-area {
        padding: 16px;
      }
      
      .header-content {
        padding: 12px 16px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }

      .teachers-checkboxes {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export default class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  activeModule = 'overview';

  // Data arrays
  courses: Course[] = [];
  participants: Participant[] = [];
  certificates: Certificate[] = [];
  teachers: Teacher[] = [];

  // Form visibility flags
  showCourseForm = false;
  showParticipantForm = false;
  showCertificateForm = false;
  showTeacherForm = false;

  // Teacher selection for courses
  selectedTeacherIds: number[] = [];

  // Form models
  newTeacher = {
    full_name: '',
    email: '',
    password: ''
  };

  newCourse = {
    code: '',
    name: '',
    start_date: '',
    end_date: '',
    hours: 0,
    created_by: 2,
    teacher_ids: [] as number[]
  };

  newParticipant = {
    email: '',
    full_name: '',
    phone: ''
  };

  newCertificate = {
    course_id: '',
    participant_id: '',
    kind: ''
  };

  ngOnInit() {
    this.loadData();
  }

  // Computed properties
  get activeTeachers(): Teacher[] {
    return this.teachers.filter(t => t.is_active);
  }

  // Teacher selection methods
  isTeacherSelected(teacherId: number): boolean {
    return this.selectedTeacherIds.includes(teacherId);
  }

  toggleTeacherSelection(teacherId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedTeacherIds.includes(teacherId)) {
        this.selectedTeacherIds.push(teacherId);
      }
    } else {
      this.selectedTeacherIds = this.selectedTeacherIds.filter(id => id !== teacherId);
    }
  }

  removeTeacher(teacherId: number): void {
    this.selectedTeacherIds = this.selectedTeacherIds.filter(id => id !== teacherId);
  }

  getTeacherName(teacherId: number): string {
    const teacher = this.teachers.find(t => t.id === teacherId);
    return teacher ? teacher.full_name : 'Docente no encontrado';
  }

  setActiveModule(module: string) {
    this.activeModule = module;
    if (module !== 'overview') {
      this.loadData();
    }
  }

  loadData() {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    // Load courses
    this.http.get<Course[]>('http://127.0.0.1:8000/api/admin/courses', { headers })
      .subscribe(data => this.courses = data);

    // Load participants  
    this.http.get<Participant[]>('http://127.0.0.1:8000/api/admin/participants', { headers })
      .subscribe(data => this.participants = data);

    // Load certificates
    this.http.get<Certificate[]>('http://127.0.0.1:8000/api/admin/certificates', { headers })
      .subscribe(data => this.certificates = data);

    // Load teachers
    this.http.get<Teacher[]>('http://127.0.0.1:8000/api/admin/teachers', { headers })
      .subscribe(data => this.teachers = data);
  }

  createCourse() {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    // Prepare course data with selected teachers
    const courseData = {
      ...this.newCourse,
      teacher_ids: this.selectedTeacherIds
    };

    this.http.post('http://127.0.0.1:8000/api/admin/courses', courseData, { headers })
      .subscribe({
        next: () => {
          this.loadData();
          this.showCourseForm = false;
          this.selectedTeacherIds = [];
          this.newCourse = { 
            code: '', 
            name: '', 
            start_date: '', 
            end_date: '', 
            hours: 0, 
            created_by: 2,
            teacher_ids: []
          };
        },
        error: (err) => console.error('Error creating course:', err)
      });
  }

  createParticipant() {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post('http://127.0.0.1:8000/api/admin/participants', this.newParticipant, { headers })
      .subscribe({
        next: () => {
          this.loadData();
          this.showParticipantForm = false;
          this.newParticipant = { email: '', full_name: '', phone: '' };
        },
        error: (err) => console.error('Error creating participant:', err)
      });
  }

  createCertificate() {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post('http://127.0.0.1:8000/api/admin/certificates/issue', this.newCertificate, { headers })
      .subscribe({
        next: () => {
          this.loadData();
          this.showCertificateForm = false;
          this.newCertificate = { course_id: '', participant_id: '', kind: '' };
        },
        error: (err) => console.error('Error creating certificate:', err)
      });
  }

  createTeacher() {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post('http://127.0.0.1:8000/api/admin/teachers', this.newTeacher, { headers })
      .subscribe({
        next: () => {
          this.loadData();
          this.showTeacherForm = false;
          this.newTeacher = { full_name: '', email: '', password: '' };
        },
        error: (err) => console.error('Error creating teacher:', err)
      });
  }

  disableTeacher(id: number) {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.delete(`http://127.0.0.1:8000/api/admin/teachers/${id}`, { headers })
      .subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Error disabling teacher:', err)
      });
  }

  downloadCertificate(serial: string) {
    window.open(`http://127.0.0.1:8000/v/serial/${serial}/pdf`, '_blank');
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}