// src/app/app.routes.ts
import { Routes } from '@angular/router';
import LoginComponent from './features/auth/login/login.component';
import DashboardComponent from './features/dashboard/dashboard.component';
import PublicVerifyComponent from './features/public-verify/public-verify.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },          // Admin
  { path: 'v/:token', component: PublicVerifyComponent },        // Público
  { path: '', pathMatch: 'full', redirectTo: 'login' }
];
