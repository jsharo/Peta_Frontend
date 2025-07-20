import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  error = signal('');
  loading = signal(false);
  registered = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorService,
    private route: ActivatedRoute
  ) {
    // ✅ TEMPORAL: Para debugging, descomenta esta línea si necesitas limpiar
    console.log('🧹 Limpiando localStorage para debugging...');
    localStorage.clear();

    // ✅ Detectar registro exitoso usando ActivatedRoute
    this.route.queryParams.subscribe(params => {
      this.registered = params['registered'] === 'true';
      
      if (this.registered) {
        console.log('✅ Usuario viene de registro exitoso');
      }
    });
    
    // ✅ SOLUCIÓN: Solo verificar autenticación si NO viene de logout
    this.checkExistingAuth();
  }

  private checkExistingAuth() {
    // ✅ Verificar si viene de logout explícito
    const fromLogout = this.route.snapshot.queryParams['fromLogout'];
    
    if (fromLogout === 'true') {
      console.log('👤 Usuario viene de logout, mostrar login');
      return; // No redirigir, mostrar login
    }

    // ✅ Solo redirigir si está autenticado Y no viene de logout
    if (this.authService.isAuthenticated()) {
      console.log('🔍 Usuario ya autenticado, verificando validez del token...');
      
      // ✅ Verificar si el token es válido
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.log('❌ No hay token, mostrar login');
        return;
      }

      // ✅ Verificar si el token no está expirado (opcional)
      try {
        // Decodificar el token para verificar expiración
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        
        if (payload.exp && payload.exp < now) {
          console.log('❌ Token expirado, limpiar y mostrar login');
          this.authService.logout();
          return;
        }
      } catch (error) {
        console.log('❌ Token inválido, limpiar y mostrar login');
        this.authService.logout();
        return;
      }

      console.log('✅ Token válido, redirigiendo...');
      this.redirectBasedOnRole();
    }
  }

  onSubmit() {
    // ✅ VALIDACIÓN: Verificar campos obligatorios
    if (!this.email.trim() || !this.password.trim()) {
      this.error.set('Por favor, completa todos los campos');
      return;
    }

    // ✅ VALIDACIÓN: Verificar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error.set('Por favor, ingresa un email válido');
      return;
    }

    if (this.loading()) return;

    this.error.set('');
    this.loading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response);
        this.loading.set(false);
        this.redirectBasedOnRole();
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        
        // ✅ USAR ErrorService para todos los errores HTTP
        this.error.set(this.errorService.handleHttpError(err));
        this.loading.set(false);
        
        // ✅ MANEJO ESPECÍFICO: Solo para casos que requieren acción adicional
        if (err.status === 401) {
          // Limpiar campos en caso de credenciales incorrectas
          this.password = '';
        }
      },
      complete: () => {
        console.log('✅ Login process completed');
      }
    });
  }

  private redirectBasedOnRole() {
    console.log('🔍 Verificando rol del usuario...');
    
    const userRole = this.authService.getCurrentUserRole();
    console.log('🔍 Rol obtenido:', userRole);
    
    if (!userRole) {
      console.error('❌ No se pudo obtener el rol del usuario');
      this.error.set('Error al obtener información del usuario');
      this.authService.logout();
      return;
    }
    
    const normalizedRole = userRole.toUpperCase();
    console.log('🔍 Rol normalizado:', normalizedRole);
    
    const validRoles = ['ADMIN', 'CLIENT'];
    if (!validRoles.includes(normalizedRole)) {
      console.error('Rol no válido:', userRole);
      this.authService.logout();
      return;
    }

    switch (normalizedRole) {
      case 'ADMIN':
        console.log('✅ Redirigiendo a lista de clientes (admin)');
        this.router.navigate(['/admin/clients-list']);
        break;
        
      case 'CLIENT':
        console.log('✅ Redirigiendo a notificaciones (client)');
        this.router.navigate(['/cliente/notificaciones']);
        break;
        
      default:
        console.error('❌ Rol no válido:', userRole);
        this.error.set('Rol de usuario no válido. Contacta al administrador.');
        this.authService.logout();
        break;
    }
  }

  // ✅ MÉTODO ADICIONAL: Para limpiar errores cuando el usuario empiece a escribir
  onInputChange() {
    if (this.error()) {
      this.error.set('');
    }
  }
}