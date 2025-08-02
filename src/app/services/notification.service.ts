import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from './error.service'; 
import { environment } from '../../environments/environment'; 

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
  private apiUrl = `${environment.apiUrl}/notifications`;

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
    // Cambia PATCH por POST aquí
    return this.http.post(`${this.apiUrl}/mark-all-read`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error al marcar todas como leídas:', error);
        return throwError(() => error);
      })
    );
  }

  // notification.service.ts
  getNotificationsByUser(userId: number) {
    return this.http.get<any[]>(`${environment.apiUrl}/notifications/user/${userId}`, { 
      headers: this.getHeaders() 
    });
  }

  markAllAsReadByUser(userId: number) {
    return this.http.patch(
      `${environment.apiUrl}/notifications/user/${userId}/read-all`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error al marcar todas como leídas por usuario:', error);
        return throwError(() => error);
      })
    );
  }

  // notification.service.ts
  deleteAllByUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/user/${userId}`);
  }
}
