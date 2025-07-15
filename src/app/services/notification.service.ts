import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from './error.service'; // ✅ AGREGAR import

interface Notification {
  id: number;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/notifications';

  constructor(
    private http: HttpClient,
    private errorService: ErrorService // ✅ AGREGAR dependencia
  ) {}

  // ✅ MEJORADO: Agregar headers de autenticación
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Error al obtener notificaciones:', error);
        return throwError(() => error);
      })
    );
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${notificationId}/read`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error al marcar como leída:', error);
        return throwError(() => error);
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/mark-all-read`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error al marcar todas como leídas:', error);
        return throwError(() => error);
      })
    );
  }
}