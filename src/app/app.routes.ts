import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard]
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./components/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/mascotas',
    loadComponent: () =>
      import('./components/admin/ver-mascota.component').then(m => m.VerMascotasComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/registrar-mascota',
    loadComponent: () =>
      import('./components/admin/registrar-mascota.component').then(m => m.RegistrarMascotaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/registrar-usuario',
    loadComponent: () =>
      import('./components/admin/crear-usuario.component').then(m => m.CrearUsuarioComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/notificaciones',
    loadComponent: () =>
      import('./components/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/bloquear-puerta',
    loadComponent: () =>
      import('./components/admin/bloquear-puerta.component').then(m => m.BloquearPuertaComponent),
    canActivate: [authGuard]
  },
  // Redireccionamiento raíz a usuarios
  { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
  // Ruta fallback
  { path: '**', redirectTo: 'login' }
];