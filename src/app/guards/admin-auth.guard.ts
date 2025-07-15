import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ AdminGuard: Verificando acceso...');

  // Primero verificar si está autenticado
  const isAuthenticated = authService.isAuthenticated();
  console.log('🛡️ ¿Está autenticado?', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('❌ No autenticado, redirigiendo a login');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false; // ✅ AGREGAR ESTA LÍNEA - detiene la ejecución aquí
  }

  // Obtener información del usuario para debugging
  const userRole = authService.getCurrentUserRole();
  const isAdmin = authService.isAdmin();
  
  console.log('🛡️ Rol del usuario:', userRole);
  console.log('🛡️ ¿Es admin?', isAdmin);
  console.log('🛡️ Usuario actual:', authService.getCurrentUser());

  // Luego verificar si es administrador
  if (isAdmin) {
    console.log('✅ AdminGuard: Acceso permitido');
    return true;
  }

  // Si no es admin, redirigir según el caso
  console.log('❌ AdminGuard: Acceso denegado');
  
  if (userRole === 'CLIENTE') {
    console.warn('Acceso denegado: Usuario cliente intentando acceder a área de admin');
    router.navigate(['/notifications']);
    return false;
  }

  // Si no tiene rol válido, cerrar sesión y redirigir a login
  console.warn('Acceso denegado: Usuario sin rol válido');
  authService.logout();
  router.navigate(['/login']);
  return false;
};