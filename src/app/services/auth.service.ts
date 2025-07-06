import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';   

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    // Agrega aquí otros campos que devuelva tu backend
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Ajusta la URL según tu entorno

  constructor(
    private http: HttpClient, 
    private errorService: ErrorService,
     private router: Router
) {}

login(email: string, password: string) {
  return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
    tap({
      next: (response) => {
        console.log('Login exitoso', response);
        localStorage.setItem('auth_token', response.token);
        this.router.navigate(['/notifications']);
      },
      error: (err) => {
        console.error('Error en login', err);
      }
    })
  );
}

  // ... (código existente)

  register(userData: { name: string, email: string, password: string }) {
  return this.http.post<{ message: string }>(`${this.apiUrl}/register`, userData).pipe(
    catchError(error => {
      return throwError(() => this.errorService.handleHttpError(error));
    })
  );
}

// ... (resto del código)

  updateProfile(userId: string, updateData: any) {
    return this.http.patch(`${this.apiUrl}/profile`, updateData, {
      headers: this.getAuthHeaders()
    });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    };
  }
}