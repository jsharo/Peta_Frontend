import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../client/nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';

interface Notification {
  id: number;
  type: 'entrada' | 'salida';
  message: string;
  isRead: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-notifications-client',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './notifications-client.component.html',
  styleUrls: ['./notifications-client.component.css']
})
export class NotificationsClientComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  loading = signal(true);
  error = signal('');
  puertaDesbloqueada = signal(true);

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.error.set('');

    const user = this.authService.getCurrentUser();
    if (user && user.id_user) {
      this.notificationService.getNotificationsByUser(user.id_user).subscribe({
        next: (data: any[]) => {
          console.log('Notificaciones recibidas:', data); // <-- Agrega esto
          const parsed: Notification[] = data.map((n: any) => ({
            id: n.id,
            type: n.action, // o usa n.type si lo necesitas
            message: `La mascota ${n.petName} ha ${n.action} por la puerta ${n.doorId}.`,
            isRead: n.isRead,
            createdAt: new Date(n.createdAt)
          }));
          this.notifications.set(parsed);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(this.errorService.handleHttpError(err));
          this.loading.set(false);

          if (err.status === 401) {
            this.logout();
          }
        }
      });
    } else {
      this.error.set('Usuario no encontrado');
      this.loading.set(false);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        // Marca todas como leídas y limpia la lista visualmente
        this.notifications.set([]); // <-- Esto vacía la lista en pantalla
      },
      error: (err) => {
        this.error.set(this.errorService.handleHttpError(err));
      }
    });
  }

  recargarNotificaciones(): void {
    this.loadNotifications();
  }

  togglePuerta(): void {
    this.puertaDesbloqueada.set(!this.puertaDesbloqueada());
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}