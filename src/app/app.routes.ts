import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Página de inicio de sesión
  { path: 'login', component: LoginComponent },

  // Página de registro
  { path: 'register', component: RegisterComponent },

  // Panel de notificaciones (protegido)
  {
    path: 'notifications',
    loadComponent: () =>
      import('./components/notifications/notifications.component').then(
        (m) => m.NotificationsComponent
      ),
    canActivate: [authGuard]
  },

  // Panel de administración (protegido)
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then(
        (m) => m.AdminComponent
      ),
    canActivate: [authGuard]
  },

  // Redirección raíz a notificaciones si está autenticado
  { path: '', redirectTo: 'notifications', pathMatch: 'full' },

  // Ruta comodín: cualquier ruta inválida redirige al login
  { path: '**', redirectTo: 'login' }
];
