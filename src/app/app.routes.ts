import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'notifications', 
    loadComponent: () => import('./components/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/notifications', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];