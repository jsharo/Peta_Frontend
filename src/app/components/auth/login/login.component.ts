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
     this.registered = this.router.url.includes('registered=true');
  }

  onSubmit() {
  if (this.loading()) return;
  
  this.error.set('');
  this.loading.set(true);

  this.authService.login(this.email, this.password).subscribe({
    next: () => {
      console.log('Redirigiendo a notificaciones...');
      this.loading.set(false);
    },
    error: (err) => {
      console.error('Error durante login:', err);
      this.error.set(this.errorService.handleHttpError(err));
      this.loading.set(false);
    },
    complete: () => {
      console.log('Login completado');
    }
  });
}
}