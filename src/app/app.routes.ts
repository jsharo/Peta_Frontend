import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin-auth.guard';

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
  
  // Rutas que requieren solo autenticación (para cualquier usuario autenticado)
  {
    path: 'notifications',
    loadComponent: () =>
      import('./components/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [authGuard]
  },

  // Rutas que requieren ser ADMINISTRADOR
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/mascotas',
    loadComponent: () =>
      import('./components/admin/ver-mascota.component').then(m => m.VerMascotaComponent), // ✅ Corregido: VerMascotaComponent en lugar de VerMascotasComponent
    canActivate: [adminGuard]
  },
  {
    path: 'admin/registrar-mascota',
    loadComponent: () =>
      import('./components/admin/registrar-mascota.component').then(m => m.RegistrarMascotaComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/notificaciones',
    loadComponent: () =>
      import('./components/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/bloquear-puerta',
    loadComponent: () =>
      import('./components/admin/bloquear-puerta.component').then(m => m.BloquearPuertaComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./components/lista-usuarios/lista-usuarios.component').then(m => m.ListaUsuariosComponent),
    canActivate: [adminGuard] // Solo admins pueden ver la lista de usuarios
  },

  // Redireccionamientos
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];