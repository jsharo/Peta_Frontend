import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
    private errorService: ErrorService
  ) {

    // Limpiar localStorage para debugging
  console.log('🧹 Limpiando localStorage para debugging...');
  localStorage.clear();

    // Detectar si el usuario viene de un registro exitoso
    this.registered = this.router.url.includes('registered=true');
    
    // Si ya está autenticado, redirigir según el rol
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  onSubmit() {
    if (this.loading()) return;

    this.error.set('');
    this.loading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.redirectBasedOnRole();
      },
      error: (err) => {
        this.error.set(this.errorService.handleHttpError(err));
        this.loading.set(false);
      },
      complete: () => {
        console.log('Login completado');
      }
    });
  }

  private redirectBasedOnRole() {
  console.log('🔍 Verificando rol del usuario...');
  console.log('Token en localStorage:', localStorage.getItem('auth_token'));
  console.log('Usuario en localStorage:', localStorage.getItem('user'));
  
  const userRole = this.authService.getCurrentUserRole();
  console.log('Rol obtenido:', userRole);
  
  // Normalizar el rol a mayúsculas para la comparación
  const normalizedRole = userRole?.toUpperCase();
  console.log('Rol normalizado:', normalizedRole);
  
  if (normalizedRole === 'ADMIN') {
    console.log('✅ Redirigiendo a usuarios (admin)');
    this.router.navigate(['/usuarios']);
  } else if (normalizedRole === 'CLIENTE') {
    console.log('✅ Redirigiendo a notifications (cliente)');
    this.router.navigate(['/notifications']);
  } else {
    console.error('❌ Rol no válido:', userRole);
    this.error.set('Rol de usuario no válido');
    this.authService.logout();
  }
}
}