import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface Notification {
  id: number;
  message: string;
  type: string;
  createdAt: Date;
  isRead: boolean;
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
    private router: Router
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
      this.error.set('Error al cargar notificaciones');
      this.loading.set(false);
    }
  });
}

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.notifications.update(notifs => 
          notifs.map(n => n.id === notificationId ? {...n, isRead: true} : n)
        );
      },
      error: () => {
        this.error.set('Error al marcar como leída');
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update(notifs => 
          notifs.map(n => ({...n, isRead: true}))
        );
      },
      error: () => {
        this.error.set('Error al marcar todas como leídas');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}