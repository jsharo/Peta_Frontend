import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(m => m.LoginComponent)
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
    redirectTo: 'admin/admin-panel',
    pathMatch: 'full'
  },
  {
    path: 'admin/admin-panel',
    loadComponent: () =>
      import('./components/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/admin-pets-view',
    loadComponent: () =>
      import('./components/admin/admin-pets-view/admin-pets-view.component').then(m => m.AdminPetsViewComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/pet-register',
    loadComponent: () =>
      import('./components/admin/pet-register/pet-register.component').then(m => m.PetRegisterComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/notifications',
    loadComponent: () =>
      import('./components/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/block-door',
    loadComponent: () =>
      import('./components/block-door/block-door.component').then(m => m.BlockDoorComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/clients-list',
    loadComponent: () =>
      import('./components/admin/clients-list/clients-list.component').then(m => m.ClientsListComponent),
    canActivate: [adminGuard]
  },
   {
  path: 'admin/client-register',
    loadComponent: () =>
      import('./components/admin/client-register/client-register.component').then(m => m.ClientRegisterComponent),
    canActivate: [adminGuard] // Solo si quieres que solo admin pueda registrar usuarios
  },

  // Redireccionamientos
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];