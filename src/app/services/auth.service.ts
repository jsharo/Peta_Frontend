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
    role: string; // Agregar el campo role
    name?: string; // Opcional: agregar otros campos que devuelva tu backend
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(
    private http: HttpClient, 
    private errorService: ErrorService,
    private router: Router
  ) {}

  login(email: string, password: string) {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
    tap({
      next: (response) => {
        console.log('✅ Respuesta completa del login:', response);
        console.log('Token recibido:', response.token);
        console.log('Usuario recibido:', response.user);
        
        localStorage.setItem('auth_token', response.token);
        
        // Guardar información del usuario
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('✅ Usuario guardado en localStorage');
        } else {
          console.warn('⚠️ No se recibió información del usuario');
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
      }
    })
  );
}

  register(userData: { name: string, email: string, password: string, confirmPassword: string, role?: string }) {
  console.log('📤 AuthService: Enviando datos de registro:', userData);
  return this.http.post<{ message: string }>(`${this.apiUrl}/register`, userData).pipe(
    tap({
      next: (response) => {
        console.log('✅ Respuesta del registro:', response);
      },
      error: (err) => {
        console.error('❌ Error en el registro:', err);
      }
    }),
    catchError(error => {
      console.error('❌ Error capturado en register:', error);
      return throwError(() => this.errorService.handleHttpError(error));
    })
  );
}

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
  const token = localStorage.getItem('auth_token');
  console.log('🔍 isAuthenticated() - token existe:', !!token);
  
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const isValid = Date.now() < exp;
    console.log('🔍 isAuthenticated() - token válido:', isValid);
    return isValid;
  } catch (error) {
    console.error('❌ Error al verificar token:', error);
    return false;
  }
}

  getCurrentUser() {
  const userStr = localStorage.getItem('user');
  console.log('String de usuario desde localStorage:', userStr);
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('Usuario parseado:', user);
      return user;
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      return null;
    }
  }
  return null;
}

  // Nuevo método para obtener el rol del usuario actual
  getCurrentUserRole(): string | null {
  console.log('🔍 Obteniendo rol del usuario...');
  
  const user = this.getCurrentUser();
  console.log('Usuario desde getCurrentUser():', user);
  
  if (user && user.role) {
    console.log('✅ Rol encontrado en usuario:', user.role);
    // Normalizar a mayúsculas para consistencia
    return user.role.toUpperCase();
  }
  
  // Fallback: intentar obtener el rol desde el token
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.log('❌ No hay token');
    return null;
  }
  
  try {
    console.log('🔍 Decodificando token...');
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Payload del token:', payload);
    
    const role = payload.role || payload.userRole || payload.user?.role;
    console.log('Rol extraído del token:', role);
    
    // Normalizar a mayúsculas
    return role ? role.toUpperCase() : null;
  } catch (error) {
    console.error('❌ Error al decodificar token:', error);
    return null;
  }
}

isAdmin(): boolean {
  const role = this.getCurrentUserRole();
  console.log('🔍 isAdmin() - rol obtenido:', role);
  const result = role === 'ADMIN';
  console.log('🔍 isAdmin() - resultado:', result);
  return result;
}

isCliente(): boolean {
  return this.getCurrentUserRole() === 'CLIENTE';
}

  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    };
  }
}