import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { DoorService } from '../../services/door.service';

interface Notification {
  id: number;
  type: 'entrada' | 'salida';
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
  puertaDesbloqueada = signal(true);

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router,
    private doorService: DoorService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();

    this.doorService.obtenerEstadoPuerta().subscribe({
      next: (door) => {
        // Si la puerta está bloqueada, set a false; si está desbloqueada, set a true
        this.puertaDesbloqueada.set(!door.is_locked);
      },
      error: () => {
        // Si hay error, puedes dejarla como desbloqueada por defecto o mostrar un mensaje
        this.puertaDesbloqueada.set(true);
      }
    });
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.error.set('');

    this.notificationService.getNotifications().subscribe({
      next: (data: any[]) => {
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
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update(n =>
          n.map(notif => ({ ...notif, isRead: true }))
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

  togglePuerta(): void {
    if (this.puertaDesbloqueada()) {
      // Bloquear la puerta
      this.doorService.bloquearPuerta().subscribe({
        next: () => this.puertaDesbloqueada.set(false),
        error: () => alert('Error al bloquear la puerta')
      });
    } else {
      // Desbloquear la puerta
      this.doorService.desbloquearPuerta().subscribe({
        next: () => this.puertaDesbloqueada.set(true),
        error: () => alert('Error al desbloquear la puerta')
      });
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}
