import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { Router } from '@angular/router';

interface Notification {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  loading = signal(true);
  error = signal('');

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.error.set('');

    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        const parsed = notifications.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
        this.notifications.set(parsed);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.errorService.handleHttpError(err));
        this.loading.set(false);
        
        if (err.status === 401) {
          localStorage.removeItem('auth_token');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      }
    });
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.notifications.update(notifs =>
          notifs.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
      },
      error: (err) => {
        this.error.set(this.errorService.handleHttpError(err));
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update(notifs =>
          notifs.map(n => ({ ...n, isRead: true }))
        );
      },
      error: (err) => {
        this.error.set(this.errorService.handleHttpError(err));
      }
    });
  }

  recargarNotificaciones(): void {
    this.loadNotifications();
  }
}