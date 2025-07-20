import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-client-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-register.component.html',
  styleUrls: ['./client-register.component.css']
})
export class ClientRegisterComponent {
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
    // Validaciones
    if (!this.name.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
      this.error.set('Por favor, completa todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error.set('Por favor, ingresa un email válido');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres');
      return;
    }

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

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.loading.set(false);
        // Redirige SIEMPRE a la lista de clientes después de crear
        this.router.navigate(['/admin/clients-list']);
      },
      error: (err) => {
        this.error.set(this.errorService.handleHttpError(err));
        this.loading.set(false);

        if (err.status === 400 && err.error?.field === 'email') {
          this.email = '';
        }
      }
    });
  }

  // Limpiar errores cuando el usuario empiece a escribir
  onInputChange(): void {
    if (this.error()) {
      this.error.set('');
    }
  }
}