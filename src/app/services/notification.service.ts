import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/notifications'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${notificationId}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/mark-all-read`, {});
  }
}