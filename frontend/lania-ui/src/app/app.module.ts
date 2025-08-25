import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';   // Para [(ngModel)]
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Componentes principales
import { AppComponent } from './app.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TeacherComponent } from './features/teacher/teacher.component';
import { CourseComponent } from './features/courses/course.component';
import { ParticipantComponent } from './features/participants/participant.component';

// Definir rutas
const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'teachers', component: TeacherComponent },
  { path: 'courses', component: CourseComponent },
  { path: 'participants', component: ParticipantComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TeacherComponent,
    CourseComponent,
    ParticipantComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
