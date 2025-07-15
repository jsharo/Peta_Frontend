import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule,],
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
    // Validación básica
    if (this.password !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    console.log('📤 Datos a enviar:', userData); // Para debugging

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('✅ Registro exitoso:', response);
        // Auto-login después del registro
        this.authService.login(this.email, this.password).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (loginError) => {
            console.log('❌ Error en auto-login:', loginError);
            // Registro exitoso pero login fallido
            this.router.navigate(['/login'], {
              queryParams: { registered: true }
            });
          }
        });
      },
      error: (err) => {
        console.error('❌ Error en registro:', err);
        this.error.set(this.errorService.handleHttpError(err));
        this.loading.set(false);
      }
    });
  }
}