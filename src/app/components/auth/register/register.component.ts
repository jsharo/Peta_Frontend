import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  error = signal('');
  loading = signal(false);
  registered = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private errorService: ErrorService
  ) {
    // Verificar si viene del registro exitoso
    this.route.queryParams.subscribe(params => {
      this.registered = params['registered'] === 'true';
    });
  }

  onSubmit() {
    // ✅ MEJORADO: Validación más robusta
    if (!this.name.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
      this.error.set('Por favor, completa todos los campos');
      return;
    }

    // ✅ MEJORADO: Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error.set('Por favor, ingresa un email válido');
      return;
    }

    // Validación de contraseñas
    if (this.password !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // ✅ MEJORADO: Validación de contraseña fuerte
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(this.password)) {
      this.error.set('La contraseña debe contener al menos una minúscula, una mayúscula y un número');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    const userData = {
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    console.log('📤 Datos a enviar:', { ...userData, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('✅ Registro exitoso:', response);
        this.loading.set(false);
        
        // ✅ MEJORADO: Mejor manejo del auto-login
        this.attemptAutoLogin();
      },
      error: (err) => {
        console.error('❌ Error en registro:', err);
        
        // ✅ CORRECTO: Usar ErrorService para todos los errores HTTP
        this.error.set(this.errorService.handleHttpError(err));
        this.loading.set(false);
        
        // ✅ MEJORADO: Manejo específico después del ErrorService
        if (err.status === 400 && err.error?.field === 'email') {
          // Limpiar solo el email si el error es específico del email
          this.email = '';
        }
      }
    });
  }

  // ✅ NUEVO: Método separado para auto-login más limpio
  private attemptAutoLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (loginResponse) => {
        console.log('✅ Auto-login exitoso:', loginResponse);
        
        // Redirigir basado en el rol del usuario
        this.redirectBasedOnRole();
      },
      error: (loginError) => {
        console.log('❌ Error en auto-login:', loginError);
        
        // Registro exitoso pero login fallido - redirigir a login manual
        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' }
        });
      }
    });
  }

  // ✅ NUEVO: Método para redirigir basado en rol (igual que LoginComponent)
  private redirectBasedOnRole(): void {
    const userRole = this.authService.getCurrentUserRole();
    
    if (!userRole) {
      console.error('❌ No se pudo obtener el rol del usuario');
      this.router.navigate(['/login']);
      return;
    }
    
    const normalizedRole = userRole.toUpperCase();
    
    switch (normalizedRole) {
      case 'ADMIN':
        this.router.navigate(['/usuarios']);
        break;
      case 'CLIENTE':
        this.router.navigate(['/notifications']);
        break;
      default:
        console.error('❌ Rol no válido:', userRole);
        this.router.navigate(['/login']);
        break;
    }
  }

  // ✅ NUEVO: Limpiar errores cuando el usuario empiece a escribir
  onInputChange(): void {
    if (this.error()) {
      this.error.set('');
    }
  }
}