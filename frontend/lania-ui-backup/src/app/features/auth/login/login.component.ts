// src/app/features/auth/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Panel Admin</h1>
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="email" name="email" placeholder="Correo" required />
      <input [(ngModel)]="password" name="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
  `
})
export default class LoginComponent {
  private http = inject(HttpClient);
  email=''; password='';
  onSubmit(){
    this.http.post<{access_token:string}>('http://127.0.0.1:8000/auth/login',{email:this.email,password:this.password})
      .subscribe(tok => { localStorage.setItem('access_token', tok.access_token); location.href='/dashboard'; });
  }
}
