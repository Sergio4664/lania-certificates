// src/app/app.routes.ts
import { Routes } from '@angular/router';
import LoginComponent from './features/auth/login/login.component';
import DashboardComponent from './features/dashboard/dashboard.component'; // CREA este componente básico si no existe
import PublicVerifyComponent from './features/public-verify/public-verify.component';

// Admin
import AdminTeachersComponent from './features/admin/teachers/admin-teachers.component';
import AdminCourseCreateComponent from './features/admin/courses/admin-course-create.component';

// Docente
import MyCoursesComponent from './features/teacher/my-courses.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // Admin
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin/docentes', component: AdminTeachersComponent },
  { path: 'admin/cursos/crear', component: AdminCourseCreateComponent },

  // Docente
  { path: 'mis-cursos', component: MyCoursesComponent },

  // Público
  { path: 'v/:token', component: PublicVerifyComponent },

  { path: '', pathMatch: 'full', redirectTo: 'login' }
];
